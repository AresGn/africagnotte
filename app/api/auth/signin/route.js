import pool from '@/lib/db'; // Chemin corrigé avec l'alias
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // 1. Rechercher l'utilisateur par email
    const userResult = await pool.query('SELECT * FROM auth.users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials - user not found' }, { status: 401 }); // Unauthorized
    }

    const user = userResult.rows[0];

    // 2. Vérifier le mot de passe
    const passwordIsValid = await bcrypt.compare(password, user.encrypted_password);

    if (!passwordIsValid) {
      return NextResponse.json({ error: 'Invalid credentials - password mismatch' }, { status: 401 }); // Unauthorized
    }

    // 3. Générer le JWT
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      // Vous pouvez ajouter d'autres informations au payload si nécessaire,
      // comme des rôles ou des informations de `user.raw_user_meta_data`
      // Par exemple : app_metadata: user.raw_app_meta_data, user_metadata: user.raw_user_meta_data
    };

    const jwtSecret = process.env.JWT_SECRET;
    console.log('[SignIn Route] JWT_SECRET from process.env:', jwtSecret);
    const jwtExpiresIn = process.env.JWT_EXPIRE || '7d'; // Utilise la valeur de .env ou 7 jours par défaut

    if (!jwtSecret) {
        console.error('JWT_SECRET is not defined in .env file for signin route');
        return NextResponse.json({ error: 'Internal Server Error - JWT configuration missing' }, { status: 500 });
    }

    const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: jwtExpiresIn });

    // Supprimer le mot de passe de l'objet utilisateur retourné
    delete user.encrypted_password;

    // Créer la réponse JSON
    const response = NextResponse.json({
      message: 'User signed in successfully',
      user: user // Retourne les informations de l'utilisateur (sans le mot de passe hashé)
    }, { status: 200 });

    // Calculer l'expiration en millisecondes pour le cookie
    let expiresInMilliseconds;
    if (jwtExpiresIn.endsWith('d')) {
      expiresInMilliseconds = parseInt(jwtExpiresIn, 10) * 24 * 60 * 60 * 1000;
    } else if (jwtExpiresIn.endsWith('h')) {
      expiresInMilliseconds = parseInt(jwtExpiresIn, 10) * 60 * 60 * 1000;
    } else if (jwtExpiresIn.endsWith('m')) {
      expiresInMilliseconds = parseInt(jwtExpiresIn, 10) * 60 * 1000;
    } else {
      expiresInMilliseconds = parseInt(jwtExpiresIn, 10) * 1000; // Supposons secondes par défaut
    }

    // Définir le cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: expiresInMilliseconds / 1000, // maxAge est en secondes
      path: '/',
      sameSite: 'lax',
    });

    return response;

  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 