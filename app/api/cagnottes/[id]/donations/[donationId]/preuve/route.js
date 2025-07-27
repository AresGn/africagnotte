import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Configuration de la base de données
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * POST /api/cagnottes/[id]/donations/[donationId]/preuve
 * Ajouter une preuve de paiement à une donation
 */
export async function POST(request, { params }) {
  const { id: cagnotteId, donationId } = await params;

  try {
    const body = await request.json();
    const {
      proof_image_url,
      payment_status = 'proof_uploaded'
    } = body;

    // Validation des données
    if (!proof_image_url) {
      return NextResponse.json({
        error: 'L\'URL de la preuve de paiement est requise.'
      }, { status: 400 });
    }

    // Validation de l'URL Cloudinary
    if (!proof_image_url.includes('cloudinary.com')) {
      return NextResponse.json({
        error: 'L\'URL de la preuve doit être hébergée sur Cloudinary.'
      }, { status: 400 });
    }

    const client = await pool.connect();

    // Vérifier que la donation existe et appartient à la cagnotte
    const donationCheck = await client.query(
      'SELECT id, payment_status FROM cagnotte_donations WHERE id = $1 AND cagnotte_id = $2',
      [donationId, cagnotteId]
    );

    if (donationCheck.rows.length === 0) {
      client.release();
      return NextResponse.json({
        error: 'Donation introuvable.'
      }, { status: 404 });
    }

    const donation = donationCheck.rows[0];

    // Vérifier que la donation n'a pas déjà une preuve validée
    if (donation.payment_status === 'completed') {
      client.release();
      return NextResponse.json({
        error: 'Cette donation a déjà été validée.'
      }, { status: 400 });
    }

    // Mettre à jour la donation avec la preuve de paiement
    const updateResult = await client.query(
      `UPDATE cagnotte_donations 
       SET proof_image_url = $1, 
           payment_status = $2, 
           proof_uploaded_at = NOW(),
           updated_at = NOW()
       WHERE id = $3 AND cagnotte_id = $4
       RETURNING *`,
      [proof_image_url, payment_status || 'pending', donationId, cagnotteId]
    );

    client.release();

    const updatedDonation = updateResult.rows[0];

    return NextResponse.json({
      message: 'Preuve de paiement enregistrée avec succès.',
      donation: {
        id: updatedDonation.id,
        payment_status: updatedDonation.payment_status,
        proof_image_url: updatedDonation.proof_image_url,
        proof_uploaded_at: updatedDonation.proof_uploaded_at
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la preuve:', error);
    return NextResponse.json({
      error: 'Erreur interne du serveur.'
    }, { status: 500 });
  }
}

/**
 * GET /api/cagnottes/[id]/donations/[donationId]/preuve
 * Récupérer les informations de preuve de paiement d'une donation
 */
export async function GET(request, { params }) {
  const { id: cagnotteId, donationId } = params;

  try {
    const client = await pool.connect();

    // Récupérer les informations de la donation avec preuve
    const result = await client.query(
      `SELECT id, donor_name, amount, payment_status, proof_image_url, 
              proof_uploaded_at, payment_reference, created_at
       FROM cagnotte_donations 
       WHERE id = $1 AND cagnotte_id = $2`,
      [donationId, cagnotteId]
    );

    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({
        error: 'Donation introuvable.'
      }, { status: 404 });
    }

    const donation = result.rows[0];

    return NextResponse.json({
      donation: {
        id: donation.id,
        donor_name: donation.donor_name,
        amount: donation.amount,
        payment_status: donation.payment_status,
        proof_image_url: donation.proof_image_url,
        proof_uploaded_at: donation.proof_uploaded_at,
        payment_reference: donation.payment_reference,
        created_at: donation.created_at
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Erreur lors de la récupération de la preuve:', error);
    return NextResponse.json({
      error: 'Erreur interne du serveur.'
    }, { status: 500 });
  }
}

/**
 * PUT /api/cagnottes/[id]/donations/[donationId]/preuve
 * Mettre à jour le statut de validation d'une preuve (pour les admins)
 */
export async function PUT(request, { params }) {
  const { id: cagnotteId, donationId } = params;

  try {
    const body = await request.json();
    const {
      payment_status,
      admin_notes
    } = body;

    // Validation du statut
    const validStatuses = ['proof_uploaded', 'proof_verified', 'completed', 'rejected'];
    if (!validStatuses.includes(payment_status)) {
      return NextResponse.json({
        error: 'Statut de paiement invalide.'
      }, { status: 400 });
    }

    const client = await pool.connect();

    // Vérifier que la donation existe
    const donationCheck = await client.query(
      'SELECT id, amount FROM cagnotte_donations WHERE id = $1 AND cagnotte_id = $2',
      [donationId, cagnotteId]
    );

    if (donationCheck.rows.length === 0) {
      client.release();
      return NextResponse.json({
        error: 'Donation introuvable.'
      }, { status: 404 });
    }

    const donation = donationCheck.rows[0];

    // Mettre à jour le statut de la donation
    const updateResult = await client.query(
      `UPDATE cagnotte_donations 
       SET payment_status = $1, 
           admin_notes = $2,
           verified_at = CASE WHEN $1 = 'completed' THEN NOW() ELSE verified_at END,
           updated_at = NOW()
       WHERE id = $3 AND cagnotte_id = $4
       RETURNING *`,
      [payment_status, admin_notes || null, donationId, cagnotteId]
    );

    // Si la donation est validée, mettre à jour le montant de la cagnotte
    if (payment_status === 'completed') {
      await client.query(
        'UPDATE cagnottes SET current_amount = current_amount + $1, updated_at = NOW() WHERE id = $2',
        [donation.amount, cagnotteId]
      );
    }

    client.release();

    const updatedDonation = updateResult.rows[0];

    return NextResponse.json({
      message: 'Statut de la donation mis à jour avec succès.',
      donation: {
        id: updatedDonation.id,
        payment_status: updatedDonation.payment_status,
        admin_notes: updatedDonation.admin_notes,
        verified_at: updatedDonation.verified_at
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    return NextResponse.json({
      error: 'Erreur interne du serveur.'
    }, { status: 500 });
  }
}
