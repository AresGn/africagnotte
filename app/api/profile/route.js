import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(request) {
  const headersList = request.headers;
  const userId = headersList.get('x-user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      first_name,
      last_name,
      username,
      phone_number,
      country
    } = body;

    // Construire dynamiquement la requête UPDATE en fonction des champs fournis
    // pour éviter de mettre à jour des champs avec NULL si non fournis dans le body.
    const updates = [];
    const values = [];
    let valueIndex = 1;

    if (first_name !== undefined) {
      updates.push(`first_name = $${valueIndex++}`);
      values.push(first_name);
    }
    if (last_name !== undefined) {
      updates.push(`last_name = $${valueIndex++}`);
      values.push(last_name);
    }
    if (username !== undefined) {
      updates.push(`username = $${valueIndex++}`);
      values.push(username);
    }
    if (phone_number !== undefined) {
      updates.push(`phone_number = $${valueIndex++}`);
      values.push(phone_number);
    }
    if (country !== undefined) {
      updates.push(`country = $${valueIndex++}`);
      values.push(country);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'Aucun champ à mettre à jour.' }, { status: 400 });
    }

    values.push(userId); // Pour la clause WHERE user_id = $N

    const client = await pool.connect();
    const queryText = `UPDATE profiles SET ${updates.join(', ')} WHERE id = $${valueIndex} RETURNING id, first_name, last_name, username, phone_number, country`;
    
    const result = await client.query(queryText, values);
    client.release();

    if (result.rows.length > 0) {
      return NextResponse.json({ message: 'Profil mis à jour avec succès.', user: result.rows[0] }, { status: 200 });
    } else {
      // Cela peut arriver si l'ID utilisateur n'existe pas dans la table profiles, 
      // ce qui serait étrange si l'utilisateur est authentifié.
      return NextResponse.json({ error: 'Profil utilisateur introuvable pour la mise à jour.' }, { status: 404 });
    }

  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    // Gérer les erreurs spécifiques, par ex. violation de contrainte unique pour username
    if (error.code === '23505') { // PostgreSQL unique violation
        if (error.constraint && error.constraint.includes('username')) {
            return NextResponse.json({ error: 'Ce pseudo est déjà utilisé.' }, { status: 409 });
        }
    }
    return NextResponse.json({ error: 'Erreur interne du serveur lors de la mise à jour du profil.' }, { status: 500 });
  }
} 