import { NextResponse } from 'next/server';
// import { headers } from 'next/headers';
import pool from '@/lib/db';

export async function GET(request) {
  const headersList = request.headers;
  const userId = headersList.get('x-user-id');

  if (!userId) {
    // Le middleware devrait avoir déjà bloqué cela, mais c'est une double vérification.
    return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  }

  try {
    const client = await pool.connect();
    // Supposons que votre table de cagnottes s'appelle 'cagnottes' 
    // et qu'elle a une colonne 'user_id' ou 'creator_id' qui référence l'ID de l'utilisateur.
    // Adaptez le nom de la table et de la colonne si nécessaire.
    const result = await client.query(
      'SELECT id, title, description, target_amount, current_amount, created_at, category, status, custom_url, images FROM cagnottes WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    client.release();

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des cagnottes:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur lors de la récupération des cagnottes.' }, { status: 500 });
  }
}

export async function POST(request) {
  const headersList = request.headers; // Lire les en-têtes de la requête
  const userId = headersList.get('x-user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Authentification requise pour créer une cagnotte.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      custom_url,
      category,
      description,
      images, // S'attendre à une chaîne JSON ici, comme avant
      video,
      is_private,
      show_target,
      target_amount,
      hide_amount,
      show_participants
    } = body;

    // Validation basique (peut être étendue)
    if (!title || !category || !description) {
      return NextResponse.json({ error: 'Les champs titre, catégorie et description sont requis.' }, { status: 400 });
    }

    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO cagnottes (user_id, title, custom_url, category, description, images, video, is_private, show_target, target_amount, hide_amount, show_participants, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
      [
        userId,
        title,
        custom_url || null,
        category,
        description,
        images, // Doit être une chaîne JSON valide
        video || null,
        is_private || false,
        show_target || false,
        target_amount || null,
        hide_amount || false,
        show_participants !== undefined ? show_participants : true, // Valeur par défaut si non fournie
        'active' // Statut par défaut lors de la création
      ]
    );
    client.release();

    if (result.rows.length > 0) {
      // Parser les images avant de renvoyer, pour cohérence
      const newCagnotte = result.rows[0];
      if (newCagnotte.images && typeof newCagnotte.images === 'string') {
        try {
          newCagnotte.images = JSON.parse(newCagnotte.images);
        } catch {
            newCagnotte.images = [];
        }
      }
      return NextResponse.json(newCagnotte, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Échec de la création de la cagnotte.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Erreur lors de la création de la cagnotte:', error);
    // Vérifier si c'est une erreur de contrainte unique (ex: custom_url)
    if (error.code === '23505') { // Code d'erreur PostgreSQL pour violation de contrainte unique
        return NextResponse.json({ error: 'Cette URL personnalisée est déjà utilisée.' }, { status: 409 }); // 409 Conflict
    }
    return NextResponse.json({ error: 'Erreur interne du serveur lors de la création de la cagnotte.' }, { status: 500 });
  }
} 