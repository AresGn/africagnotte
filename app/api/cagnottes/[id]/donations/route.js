import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Récupérer les dons d'une cagnotte
export async function GET(request, { params }) {
  const cagnotteId = (await params).id;
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get('sortBy') || 'date'; // 'date' ou 'amount'
  const limit = parseInt(searchParams.get('limit')) || 50;
  const offset = parseInt(searchParams.get('offset')) || 0;

  if (!cagnotteId) {
    return NextResponse.json({ error: 'ID de la cagnotte requis.' }, { status: 400 });
  }

  try {
    const client = await pool.connect();

    // Vérifier que la cagnotte existe et est accessible
    const cagnotteResult = await client.query(
      'SELECT id, is_private, user_id FROM cagnottes WHERE id = $1',
      [cagnotteId]
    );

    if (cagnotteResult.rows.length === 0) {
      client.release();
      return NextResponse.json({ error: 'Cagnotte introuvable.' }, { status: 404 });
    }

    const cagnotte = cagnotteResult.rows[0];

    // Si la cagnotte est privée, vérifier l'authentification (seulement pour les utilisateurs connectés)
    if (cagnotte.is_private) {
      const headersList = request.headers;
      const userId = headersList.get('x-user-id');

      // Pour les cagnottes privées, l'utilisateur doit être connecté et être le propriétaire
      if (!userId || userId !== cagnotte.user_id) {
        client.release();
        return NextResponse.json({ error: 'Accès non autorisé à cette cagnotte privée.' }, { status: 403 });
      }
    }

    // Construire la requête de tri
    let orderBy = 'created_at DESC';
    if (sortBy === 'amount') {
      orderBy = 'amount DESC, created_at DESC';
    }

    // Récupérer les dons
    const donationsResult = await client.query(
      `SELECT 
        id, donor_name, amount, comment, is_anonymous, 
        payment_status, created_at
       FROM cagnotte_donations 
       WHERE cagnotte_id = $1 AND payment_status = 'completed'
       ORDER BY ${orderBy}
       LIMIT $2 OFFSET $3`,
      [cagnotteId, limit, offset]
    );

    // Compter le total des dons
    const countResult = await client.query(
      'SELECT COUNT(*) as total FROM cagnotte_donations WHERE cagnotte_id = $1 AND payment_status = $2',
      [cagnotteId, 'completed']
    );

    client.release();

    // Masquer les noms des donateurs anonymes
    const donations = donationsResult.rows.map(donation => ({
      ...donation,
      donor_name: donation.is_anonymous ? 'Anonyme' : donation.donor_name
    }));

    return NextResponse.json({
      donations,
      pagination: {
        total: parseInt(countResult.rows[0].total),
        limit,
        offset,
        hasMore: offset + limit < parseInt(countResult.rows[0].total)
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des dons:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}

// POST - Créer un nouveau don
export async function POST(request, { params }) {
  const cagnotteId = (await params).id;

  if (!cagnotteId) {
    return NextResponse.json({ error: 'ID de la cagnotte requis.' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const {
      donor_name,
      amount,
      comment,
      is_anonymous = false,
      payment_reference,
      // payment_method, // Non utilisé pour le moment
      payment_status = 'pending',
      donation_type = 'monetary',
      // Champs pour services
      service_type,
      service_description,
      service_duration,
      service_availability,
      // Champs pour biens matériels
      material_type,
      material_description,
      material_quantity,
      material_condition,
      // Champs pour compétences
      skill_type,
      skill_description,
      skill_level,
      skill_availability,
      // Champs communs pour dons non-monétaires
      estimated_value,
      contact_info,
      delivery_method,
      location_constraint
    } = body;

    // Validation des données
    if (!donor_name) {
      return NextResponse.json({
        error: 'Le nom du donateur est requis.'
      }, { status: 400 });
    }

    // Validation spécifique selon le type de don
    if (donation_type === 'monetary') {
      if (!amount || amount <= 0) {
        return NextResponse.json({
          error: 'Le montant doit être supérieur à 0 pour un don monétaire.'
        }, { status: 400 });
      }
    } else {
      if (!estimated_value || estimated_value <= 0) {
        return NextResponse.json({
          error: 'La valeur estimée doit être supérieure à 0.'
        }, { status: 400 });
      }

      // Validation des champs spécifiques
      if (donation_type === 'service' && (!service_type || !service_description)) {
        return NextResponse.json({
          error: 'Le type et la description du service sont requis.'
        }, { status: 400 });
      }

      if (donation_type === 'material' && (!material_type || !material_description)) {
        return NextResponse.json({
          error: 'Le type et la description du bien matériel sont requis.'
        }, { status: 400 });
      }

      if (donation_type === 'skill' && (!skill_type || !skill_description)) {
        return NextResponse.json({
          error: 'Le type et la description de la compétence sont requis.'
        }, { status: 400 });
      }
    }

    const client = await pool.connect();

    // Vérifier que la cagnotte existe et est active
    const cagnotteResult = await client.query(
      'SELECT id, status FROM cagnottes WHERE id = $1',
      [cagnotteId]
    );

    if (cagnotteResult.rows.length === 0) {
      client.release();
      return NextResponse.json({ error: 'Cagnotte introuvable.' }, { status: 404 });
    }

    if (cagnotteResult.rows[0].status !== 'active') {
      client.release();
      return NextResponse.json({ 
        error: 'Cette cagnotte n\'accepte plus de dons.' 
      }, { status: 400 });
    }

    // Créer le don avec support de la diversification
    const donationResult = await client.query(
      `INSERT INTO cagnotte_donations
       (cagnotte_id, donor_name, amount, comment, is_anonymous, payment_reference, payment_status,
        donation_type, service_type, service_description, service_duration, service_availability,
        material_type, material_description, material_quantity, material_condition,
        skill_type, skill_description, skill_level, skill_availability,
        estimated_value, contact_info, delivery_method, location_constraint)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
       RETURNING *`,
      [
        cagnotteId,
        donor_name,
        donation_type === 'monetary' ? amount : null,
        comment || null,
        is_anonymous,
        payment_reference || null,
        payment_status,
        donation_type,
        service_type || null,
        service_description || null,
        service_duration || null,
        service_availability || null,
        material_type || null,
        material_description || null,
        material_quantity || null,
        material_condition || null,
        skill_type || null,
        skill_description || null,
        skill_level || null,
        skill_availability || null,
        estimated_value || null,
        contact_info ? JSON.stringify(contact_info) : null,
        delivery_method || null,
        location_constraint || null
      ]
    );

    client.release();

    const donation = donationResult.rows[0];

    const successMessage = donation_type === 'monetary'
      ? 'Don créé avec succès.'
      : 'Contribution enregistrée avec succès.';

    return NextResponse.json({
      message: successMessage,
      donation: {
        id: donation.id,
        donor_name: donation.is_anonymous ? 'Anonyme' : donation.donor_name,
        amount: donation.amount,
        donation_type: donation.donation_type,
        estimated_value: donation.estimated_value,
        comment: donation.comment,
        payment_status: donation.payment_status,
        created_at: donation.created_at
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création du don:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}
