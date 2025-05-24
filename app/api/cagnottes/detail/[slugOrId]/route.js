import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request, { params }) {
  const slugOrId = params.slugOrId;

  if (!slugOrId) {
    return NextResponse.json({ error: 'Le slug ou l\'ID de la cagnotte est requis.' }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    let cagnotte = null;

    // Essayer de trouver par custom_url d'abord
    const resultByUrl = await client.query(
      'SELECT id, user_id, title, custom_url, category, description, images, video, is_private, show_target, target_amount, hide_amount, show_participants, current_amount, status, created_at, updated_at FROM cagnottes WHERE custom_url = $1',
      [slugOrId]
    );

    if (resultByUrl.rows.length > 0) {
      cagnotte = resultByUrl.rows[0];
    } else {
      // Si non trouvé par custom_url, essayer par ID (en s'assurant que c'est un UUID valide si vos ID sont des UUID)
      // Pour simplifier, on suppose que si ce n'est pas une URL, c'est un ID.
      // Une validation plus robuste de l'ID (ex: vérifier si c'est un UUID) pourrait être ajoutée ici.
      const resultById = await client.query(
        'SELECT id, user_id, title, custom_url, category, description, images, video, is_private, show_target, target_amount, hide_amount, show_participants, current_amount, status, created_at, updated_at FROM cagnottes WHERE id = $1',
        [slugOrId]
      );
      if (resultById.rows.length > 0) {
        cagnotte = resultById.rows[0];
      }
    }

    client.release();

    if (cagnotte) {
      // Supposons que 'images' est stocké comme une chaîne JSON dans la BDD
      // et doit être parsé en tableau pour le frontend.
      if (cagnotte.images && typeof cagnotte.images === 'string') {
        try {
          cagnotte.images = JSON.parse(cagnotte.images);
        } catch (parseError) {
          console.error('Erreur de parsing JSON pour les images:', parseError);
          cagnotte.images = []; // Ou une valeur par défaut appropriée
        }
      }
      return NextResponse.json(cagnotte, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Cagnotte introuvable.' }, { status: 404 });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la cagnotte:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
} 