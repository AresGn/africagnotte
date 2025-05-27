import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Fonction utilitaire pour valider si une chaîne est un UUID valide
function isValidUUID(str) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export async function GET(request, { params }) {
  const { slugOrId } = await params;

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
      // Si non trouvé par custom_url, vérifier si c'est un UUID valide avant d'essayer par ID
      if (isValidUUID(slugOrId)) {
        const resultById = await client.query(
          'SELECT id, user_id, title, custom_url, category, description, images, video, is_private, show_target, target_amount, hide_amount, show_participants, current_amount, status, created_at, updated_at FROM cagnottes WHERE id = $1',
          [slugOrId]
        );
        if (resultById.rows.length > 0) {
          cagnotte = resultById.rows[0];
        }
      } else {
        // Si ce n'est ni une URL personnalisée ni un UUID valide, retourner une erreur explicite
        client.release();
        return NextResponse.json({
          error: 'Cagnotte introuvable. L\'identifiant fourni n\'est ni une URL personnalisée valide ni un ID valide.'
        }, { status: 404 });
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