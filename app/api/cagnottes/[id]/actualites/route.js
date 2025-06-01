import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Récupérer les actualités d'une cagnotte
export async function GET(request, { params }) {
  const cagnotteId = (await params).id;
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit')) || 10;
  const offset = parseInt(searchParams.get('offset')) || 0;
  const includeUnpublished = searchParams.get('includeUnpublished') === 'true';

  if (!cagnotteId) {
    return NextResponse.json({ error: 'ID de la cagnotte requis.' }, { status: 400 });
  }

  try {
    const client = await pool.connect();

    // Vérifier que la cagnotte existe
    const cagnotteResult = await client.query(
      'SELECT id, is_private, user_id FROM cagnottes WHERE id = $1',
      [cagnotteId]
    );

    if (cagnotteResult.rows.length === 0) {
      client.release();
      return NextResponse.json({ error: 'Cagnotte introuvable.' }, { status: 404 });
    }

    const cagnotte = cagnotteResult.rows[0];
    const headersList = request.headers;
    const userId = headersList.get('x-user-id');
    const isOwner = userId === cagnotte.user_id;

    // Si la cagnotte est privée, vérifier l'authentification
    if (cagnotte.is_private && !isOwner) {
      client.release();
      return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 403 });
    }

    // Construire la condition de publication
    let publishedCondition = 'AND is_published = true';
    if (includeUnpublished && isOwner) {
      publishedCondition = ''; // Le propriétaire peut voir toutes les actualités
    }

    // Récupérer les actualités
    const actualitesResult = await client.query(
      `SELECT 
        id, title, content, images, video_url, amount_at_time, 
        is_published, created_at, updated_at
       FROM cagnotte_actualites 
       WHERE cagnotte_id = $1 ${publishedCondition}
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [cagnotteId, limit, offset]
    );

    // Compter le total des actualités
    const countResult = await client.query(
      `SELECT COUNT(*) as total 
       FROM cagnotte_actualites 
       WHERE cagnotte_id = $1 ${publishedCondition}`,
      [cagnotteId]
    );

    client.release();

    return NextResponse.json({
      actualites: actualitesResult.rows,
      pagination: {
        total: parseInt(countResult.rows[0].total),
        limit,
        offset,
        hasMore: offset + limit < parseInt(countResult.rows[0].total)
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des actualités:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}

// POST - Créer une nouvelle actualité (propriétaire uniquement)
export async function POST(request, { params }) {
  const cagnotteId = (await params).id;
  const headersList = request.headers;
  const userId = headersList.get('x-user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  }

  if (!cagnotteId) {
    return NextResponse.json({ error: 'ID de la cagnotte requis.' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const {
      title,
      content,
      images,
      video_url,
      is_published = true
    } = body;

    // Validation des données
    if (!title || !content) {
      return NextResponse.json({ 
        error: 'Le titre et le contenu sont requis.' 
      }, { status: 400 });
    }

    if (title.length > 200) {
      return NextResponse.json({ 
        error: 'Le titre ne peut pas dépasser 200 caractères.' 
      }, { status: 400 });
    }

    const client = await pool.connect();

    // Vérifier que la cagnotte existe et appartient à l'utilisateur
    const cagnotteResult = await client.query(
      'SELECT id, user_id, current_amount FROM cagnottes WHERE id = $1',
      [cagnotteId]
    );

    if (cagnotteResult.rows.length === 0) {
      client.release();
      return NextResponse.json({ error: 'Cagnotte introuvable.' }, { status: 404 });
    }

    if (cagnotteResult.rows[0].user_id !== userId) {
      client.release();
      return NextResponse.json({ 
        error: 'Vous n\'êtes pas autorisé à créer des actualités pour cette cagnotte.' 
      }, { status: 403 });
    }

    // Récupérer le montant actuel pour amount_at_time
    const currentAmount = cagnotteResult.rows[0].current_amount || 0;

    // Créer l'actualité
    const actualiteResult = await client.query(
      `INSERT INTO cagnotte_actualites 
       (cagnotte_id, title, content, images, video_url, amount_at_time, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        cagnotteId, 
        title, 
        content, 
        images ? JSON.stringify(images) : null,
        video_url || null,
        currentAmount,
        is_published
      ]
    );

    client.release();

    const actualite = actualiteResult.rows[0];

    return NextResponse.json({
      message: 'Actualité créée avec succès.',
      actualite
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création de l\'actualité:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}
