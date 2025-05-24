import pool from '../../../../lib/db'; // Ajustez le chemin si nécessaire
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid'; // Ajout de l'import pour uuid

export async function POST(request) {
  try {
    const { email, password, raw_user_meta_data } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // 1. Vérifier si l'email existe déjà
    const existingUser = await pool.query('SELECT * FROM auth.users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: 'User already exists with this email' }, { status: 409 }); // 409 Conflict
    }

    // 2. Hasher le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Générer l'ID utilisateur avec uuid
    const userId = uuidv4();

    // 3. Insérer le nouvel utilisateur dans auth.users
    const newUserResult = await pool.query(
      `INSERT INTO auth.users (id, email, encrypted_password, raw_user_meta_data)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, created_at`,
      [userId, email, hashedPassword, raw_user_meta_data ? JSON.stringify(raw_user_meta_data) : null]
    );

    const newUser = newUserResult.rows[0];

    // 4. Créer une entrée dans public.profiles
    // On essaie de créer un profil même si raw_user_meta_data est limité ou absent
    // On utilise l'email comme fallback pour full_name si rien d'autre n'est fourni.
    const firstName = raw_user_meta_data?.firstName || null;
    const lastName = raw_user_meta_data?.lastName || null;
    const country = raw_user_meta_data?.country || null;
    const username = raw_user_meta_data?.username || null; // Ou générer à partir de l'email?
    const phoneNumber = raw_user_meta_data?.phone_number || null;

    // full_name est utilisé dans la version actuelle de l'INSERT, mais votre table n'a pas full_name
    // Adaptons pour utiliser first_name et last_name directement

    try {
        await pool.query(
            `INSERT INTO public.profiles (id, first_name, last_name, username, phone_number, country)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [newUser.id, firstName, lastName, username, phoneNumber, country]
        );
        console.log(`Profile created for user ${newUser.id}`);
    } catch (profileError) {
        console.error(`Error creating profile for user ${newUser.id}:`, profileError);
        // Ne pas bloquer l'inscription si la création du profil échoue, 
        // mais logguer l'erreur est important.
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: { id: newUser.id, email: newUser.email, created_at: newUser.created_at }
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 