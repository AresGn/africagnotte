import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Fonction utilitaire pour valider les données de cagnotte
function validateCagnotteData(data) {
  const errors = [];
  
  if (!data.title || data.title.trim().length === 0) {
    errors.push('Le titre est requis');
  }
  if (data.title && data.title.length > 50) {
    errors.push('Le titre ne peut pas dépasser 50 caractères');
  }
  if (!data.category || data.category.trim().length === 0) {
    errors.push('La catégorie est requise');
  }
  if (!data.description || data.description.trim().length === 0) {
    errors.push('La description est requise');
  }
  if (data.show_target && (!data.target_amount || data.target_amount <= 0)) {
    errors.push('Le montant cible doit être supérieur à 0 quand l\'affichage de l\'objectif est activé');
  }
  
  return errors;
}

// GET - Récupérer une cagnotte spécifique (avec vérification de propriété)
export async function GET(request, { params }) {
  const headersList = request.headers;
  const userId = headersList.get('x-user-id');
  const cagnotteId = params.id;

  if (!userId) {
    return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  }

  if (!cagnotteId) {
    return NextResponse.json({ error: 'ID de la cagnotte requis.' }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM cagnottes WHERE id = $1 AND user_id = $2',
      [cagnotteId, userId]
    );
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Cagnotte introuvable ou accès non autorisé.' }, { status: 404 });
    }

    const cagnotte = result.rows[0];
    
    // Parser les images si nécessaire
    if (cagnotte.images && typeof cagnotte.images === 'string') {
      try {
        cagnotte.images = JSON.parse(cagnotte.images);
      } catch (parseError) {
        console.error('Erreur de parsing JSON pour les images:', parseError);
        cagnotte.images = [];
      }
    }

    return NextResponse.json(cagnotte, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération de la cagnotte:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}

// PUT - Mettre à jour une cagnotte
export async function PUT(request, { params }) {
  const headersList = request.headers;
  const userId = headersList.get('x-user-id');
  const cagnotteId = params.id;

  if (!userId) {
    return NextResponse.json({ error: 'Authentification requise pour modifier une cagnotte.' }, { status: 401 });
  }

  if (!cagnotteId) {
    return NextResponse.json({ error: 'ID de la cagnotte requis.' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const {
      title,
      custom_url,
      category,
      description,
      images,
      video,
      is_private,
      show_target,
      target_amount,
      hide_amount,
      show_participants
    } = body;

    // Validation des données
    const validationErrors = validateCagnotteData(body);
    if (validationErrors.length > 0) {
      return NextResponse.json({ 
        error: 'Données invalides', 
        details: validationErrors 
      }, { status: 400 });
    }

    const client = await pool.connect();
    
    // Vérifier que la cagnotte existe et appartient à l'utilisateur
    const checkResult = await client.query(
      'SELECT id FROM cagnottes WHERE id = $1 AND user_id = $2',
      [cagnotteId, userId]
    );

    if (checkResult.rows.length === 0) {
      client.release();
      return NextResponse.json({ error: 'Cagnotte introuvable ou accès non autorisé.' }, { status: 404 });
    }

    // Mettre à jour la cagnotte
    const updateResult = await client.query(
      `UPDATE cagnottes 
       SET title = $1, custom_url = $2, category = $3, description = $4, 
           images = $5, video = $6, is_private = $7, show_target = $8, 
           target_amount = $9, hide_amount = $10, show_participants = $11, 
           updated_at = NOW()
       WHERE id = $12 AND user_id = $13 
       RETURNING *`,
      [
        title,
        custom_url || null,
        category,
        description,
        images, // Doit être une chaîne JSON valide
        video || null,
        is_private || false,
        show_target || false,
        show_target ? target_amount : null,
        hide_amount || false,
        show_participants !== undefined ? show_participants : true,
        cagnotteId,
        userId
      ]
    );
    
    client.release();

    if (updateResult.rows.length > 0) {
      const updatedCagnotte = updateResult.rows[0];
      
      // Parser les images avant de renvoyer
      if (updatedCagnotte.images && typeof updatedCagnotte.images === 'string') {
        try {
          updatedCagnotte.images = JSON.parse(updatedCagnotte.images);
        } catch {
          updatedCagnotte.images = [];
        }
      }
      
      return NextResponse.json(updatedCagnotte, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Échec de la mise à jour de la cagnotte.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la cagnotte:', error);
    
    // Vérifier si c'est une erreur de contrainte unique (ex: custom_url)
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Cette URL personnalisée est déjà utilisée.' }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Erreur interne du serveur lors de la mise à jour.' }, { status: 500 });
  }
}

// DELETE - Supprimer une cagnotte
export async function DELETE(request, { params }) {
  const headersList = request.headers;
  const userId = headersList.get('x-user-id');
  const cagnotteId = params.id;

  if (!userId) {
    return NextResponse.json({ error: 'Authentification requise pour supprimer une cagnotte.' }, { status: 401 });
  }

  if (!cagnotteId) {
    return NextResponse.json({ error: 'ID de la cagnotte requis.' }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    
    // Vérifier que la cagnotte existe et appartient à l'utilisateur
    const checkResult = await client.query(
      'SELECT id, title FROM cagnottes WHERE id = $1 AND user_id = $2',
      [cagnotteId, userId]
    );

    if (checkResult.rows.length === 0) {
      client.release();
      return NextResponse.json({ error: 'Cagnotte introuvable ou accès non autorisé.' }, { status: 404 });
    }

    // Supprimer la cagnotte
    const deleteResult = await client.query(
      'DELETE FROM cagnottes WHERE id = $1 AND user_id = $2 RETURNING id, title',
      [cagnotteId, userId]
    );
    
    client.release();

    if (deleteResult.rows.length > 0) {
      return NextResponse.json({ 
        message: 'Cagnotte supprimée avec succès',
        deleted: deleteResult.rows[0]
      }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Échec de la suppression de la cagnotte.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Erreur lors de la suppression de la cagnotte:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur lors de la suppression.' }, { status: 500 });
  }
}
