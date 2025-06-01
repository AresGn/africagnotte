import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Récupérer une actualité spécifique
export async function GET(request, { params }) {
  const actualiteId = params.actualiteId;

  if (!actualiteId) {
    return NextResponse.json({ error: 'ID de l\'actualité requis.' }, { status: 400 });
  }

  try {
    const client = await pool.connect();

    const actualiteResult = await client.query(
      `SELECT 
        a.id, a.title, a.content, a.images, a.video_url, 
        a.amount_at_time, a.is_published, a.created_at, a.updated_at,
        c.id as cagnotte_id, c.title as cagnotte_title, c.is_private, c.user_id
       FROM cagnotte_actualites a
       JOIN cagnottes c ON a.cagnotte_id = c.id
       WHERE a.id = $1`,
      [actualiteId]
    );

    if (actualiteResult.rows.length === 0) {
      client.release();
      return NextResponse.json({ error: 'Actualité introuvable.' }, { status: 404 });
    }

    const actualite = actualiteResult.rows[0];
    const headersList = request.headers;
    const userId = headersList.get('x-user-id');
    const isOwner = userId === actualite.user_id;

    // Vérifier les permissions d'accès
    if (!actualite.is_published && !isOwner) {
      client.release();
      return NextResponse.json({ error: 'Actualité non publiée.' }, { status: 403 });
    }

    if (actualite.is_private && !isOwner) {
      client.release();
      return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 403 });
    }

    client.release();

    return NextResponse.json({
      actualite: {
        id: actualite.id,
        title: actualite.title,
        content: actualite.content,
        images: actualite.images,
        video_url: actualite.video_url,
        amount_at_time: actualite.amount_at_time,
        is_published: actualite.is_published,
        created_at: actualite.created_at,
        updated_at: actualite.updated_at,
        cagnotte: {
          id: actualite.cagnotte_id,
          title: actualite.cagnotte_title
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'actualité:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}

// PUT - Modifier une actualité (propriétaire uniquement)
export async function PUT(request, { params }) {
  const actualiteId = params.actualiteId;
  const headersList = request.headers;
  const userId = headersList.get('x-user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  }

  if (!actualiteId) {
    return NextResponse.json({ error: 'ID de l\'actualité requis.' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const {
      title,
      content,
      images,
      video_url,
      is_published
    } = body;

    const client = await pool.connect();

    // Vérifier que l'actualité existe et appartient à l'utilisateur
    const actualiteResult = await client.query(
      `SELECT a.id, c.user_id
       FROM cagnotte_actualites a
       JOIN cagnottes c ON a.cagnotte_id = c.id
       WHERE a.id = $1`,
      [actualiteId]
    );

    if (actualiteResult.rows.length === 0) {
      client.release();
      return NextResponse.json({ error: 'Actualité introuvable.' }, { status: 404 });
    }

    if (actualiteResult.rows[0].user_id !== userId) {
      client.release();
      return NextResponse.json({ 
        error: 'Vous n\'êtes pas autorisé à modifier cette actualité.' 
      }, { status: 403 });
    }

    // Construire la requête de mise à jour dynamiquement
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title !== undefined) {
      if (!title || title.length > 200) {
        client.release();
        return NextResponse.json({ 
          error: 'Le titre est requis et ne peut pas dépasser 200 caractères.' 
        }, { status: 400 });
      }
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }

    if (content !== undefined) {
      if (!content) {
        client.release();
        return NextResponse.json({ 
          error: 'Le contenu est requis.' 
        }, { status: 400 });
      }
      updates.push(`content = $${paramCount++}`);
      values.push(content);
    }

    if (images !== undefined) {
      updates.push(`images = $${paramCount++}`);
      values.push(images ? JSON.stringify(images) : null);
    }

    if (video_url !== undefined) {
      updates.push(`video_url = $${paramCount++}`);
      values.push(video_url || null);
    }

    if (is_published !== undefined) {
      updates.push(`is_published = $${paramCount++}`);
      values.push(is_published);
    }

    if (updates.length === 0) {
      client.release();
      return NextResponse.json({ 
        error: 'Aucune donnée à mettre à jour.' 
      }, { status: 400 });
    }

    // Ajouter updated_at et l'ID
    updates.push(`updated_at = now()`);
    values.push(actualiteId);

    const updateResult = await client.query(
      `UPDATE cagnotte_actualites 
       SET ${updates.join(', ')}
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    client.release();

    const updatedActualite = updateResult.rows[0];

    return NextResponse.json({
      message: 'Actualité mise à jour avec succès.',
      actualite: updatedActualite
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'actualité:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}

// DELETE - Supprimer une actualité (propriétaire uniquement)
export async function DELETE(request, { params }) {
  const actualiteId = params.actualiteId;
  const headersList = request.headers;
  const userId = headersList.get('x-user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  }

  if (!actualiteId) {
    return NextResponse.json({ error: 'ID de l\'actualité requis.' }, { status: 400 });
  }

  try {
    const client = await pool.connect();

    // Vérifier que l'actualité existe et appartient à l'utilisateur
    const actualiteResult = await client.query(
      `SELECT a.id, a.title, c.user_id
       FROM cagnotte_actualites a
       JOIN cagnottes c ON a.cagnotte_id = c.id
       WHERE a.id = $1`,
      [actualiteId]
    );

    if (actualiteResult.rows.length === 0) {
      client.release();
      return NextResponse.json({ error: 'Actualité introuvable.' }, { status: 404 });
    }

    if (actualiteResult.rows[0].user_id !== userId) {
      client.release();
      return NextResponse.json({ 
        error: 'Vous n\'êtes pas autorisé à supprimer cette actualité.' 
      }, { status: 403 });
    }

    // Supprimer l'actualité
    await client.query(
      'DELETE FROM cagnotte_actualites WHERE id = $1',
      [actualiteId]
    );

    client.release();

    return NextResponse.json({
      message: 'Actualité supprimée avec succès.'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'actualité:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}
