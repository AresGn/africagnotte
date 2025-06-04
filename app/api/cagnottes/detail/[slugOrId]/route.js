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
      'SELECT id, user_id, title, custom_url, category, description, long_description, images, video, is_private, show_target, target_amount, hide_amount, show_participants, current_amount, participants_count, status, author_name, author_phone, author_socials, created_at, updated_at FROM cagnottes WHERE custom_url = $1',
      [slugOrId]
    );

    if (resultByUrl.rows.length > 0) {
      cagnotte = resultByUrl.rows[0];
    } else {
      // Si non trouvé par custom_url, vérifier si c'est un UUID valide avant d'essayer par ID
      if (isValidUUID(slugOrId)) {
        const resultById = await client.query(
          'SELECT id, user_id, title, custom_url, category, description, long_description, images, video, is_private, show_target, target_amount, hide_amount, show_participants, current_amount, participants_count, status, author_name, author_phone, author_socials, created_at, updated_at FROM cagnottes WHERE id = $1',
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

    if (cagnotte) {
      // Vérifier l'accès aux cagnottes privées
      if (cagnotte.is_private) {
        const headersList = request.headers;
        const userId = headersList.get('x-user-id');

        // Seul le propriétaire peut voir une cagnotte privée
        if (!userId || userId !== cagnotte.user_id) {
          client.release();
          return NextResponse.json({
            error: 'Cette cagnotte est privée et n\'est pas accessible.'
          }, { status: 403 });
        }
      }

      // Récupérer les dons récents (5 derniers)
      const donationsResult = await client.query(
        `SELECT id, donor_name, amount, comment, is_anonymous, created_at
         FROM cagnotte_donations
         WHERE cagnotte_id = $1 AND payment_status = 'completed'
         ORDER BY created_at DESC
         LIMIT 5`,
        [cagnotte.id]
      );

      // Récupérer les actualités publiées (3 dernières)
      const actualitesResult = await client.query(
        `SELECT id, title, content, images, video_url, amount_at_time, created_at
         FROM cagnotte_actualites
         WHERE cagnotte_id = $1 AND is_published = true
         ORDER BY created_at DESC
         LIMIT 3`,
        [cagnotte.id]
      );

      client.release();

      // Parser les données JSON
      if (cagnotte.images && typeof cagnotte.images === 'string') {
        try {
          cagnotte.images = JSON.parse(cagnotte.images);
        } catch (parseError) {
          console.error('Erreur de parsing JSON pour les images:', parseError);
          cagnotte.images = [];
        }
      }

      if (cagnotte.author_socials && typeof cagnotte.author_socials === 'string') {
        try {
          cagnotte.author_socials = JSON.parse(cagnotte.author_socials);
        } catch (parseError) {
          console.error('Erreur de parsing JSON pour author_socials:', parseError);
          cagnotte.author_socials = {};
        }
      }

      // Masquer les noms des donateurs anonymes
      const donations = donationsResult.rows.map(donation => ({
        ...donation,
        donor_name: donation.is_anonymous ? 'Anonyme' : donation.donor_name
      }));

      // Parser les images des actualités
      const actualites = actualitesResult.rows.map(actualite => ({
        ...actualite,
        images: actualite.images ? (typeof actualite.images === 'string' ? JSON.parse(actualite.images) : actualite.images) : null
      }));

      // Construire l'objet author pour la compatibilité avec le composant
      const author = cagnotte.author_name ? {
        name: cagnotte.author_name,
        phone: cagnotte.author_phone,
        socials: cagnotte.author_socials || {}
      } : null;

      return NextResponse.json({
        ...cagnotte,
        author,
        donations,
        actualites,
        longDescription: cagnotte.long_description
      }, { status: 200 });
    } else {
      client.release();
      return NextResponse.json({ error: 'Cagnotte introuvable.' }, { status: 404 });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la cagnotte:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}