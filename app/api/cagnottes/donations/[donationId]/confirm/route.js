import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// PUT - Confirmer un don (webhook de paiement)
export async function PUT(request, { params }) {
  const donationId = params.donationId;

  if (!donationId) {
    return NextResponse.json({ error: 'ID du don requis.' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const {
      payment_status, // 'completed', 'failed', 'refunded'
      payment_reference,
      webhook_signature // Pour vérifier l'authenticité du webhook
    } = body;

    // TODO: Vérifier la signature du webhook selon votre système de paiement
    // if (!verifyWebhookSignature(webhook_signature, body)) {
    //   return NextResponse.json({ error: 'Signature invalide.' }, { status: 401 });
    // }

    if (!payment_status || !['completed', 'failed', 'refunded'].includes(payment_status)) {
      return NextResponse.json({ 
        error: 'Statut de paiement invalide.' 
      }, { status: 400 });
    }

    const client = await pool.connect();

    // Vérifier que le don existe
    const donationResult = await client.query(
      'SELECT id, cagnotte_id, amount, payment_status FROM cagnotte_donations WHERE id = $1',
      [donationId]
    );

    if (donationResult.rows.length === 0) {
      client.release();
      return NextResponse.json({ error: 'Don introuvable.' }, { status: 404 });
    }

    const donation = donationResult.rows[0];

    // Mettre à jour le statut du don
    const updateResult = await client.query(
      `UPDATE cagnotte_donations 
       SET payment_status = $1, payment_reference = $2, updated_at = now()
       WHERE id = $3
       RETURNING *`,
      [payment_status, payment_reference || null, donationId]
    );

    client.release();

    const updatedDonation = updateResult.rows[0];

    // Log pour le suivi
    console.log(`Don ${donationId} mis à jour: ${payment_status}`);

    return NextResponse.json({
      message: `Statut du don mis à jour: ${payment_status}`,
      donation: {
        id: updatedDonation.id,
        payment_status: updatedDonation.payment_status,
        payment_reference: updatedDonation.payment_reference,
        updated_at: updatedDonation.updated_at
      }
    });

  } catch (error) {
    console.error('Erreur lors de la confirmation du don:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}

// GET - Récupérer le statut d'un don
export async function GET(request, { params }) {
  const donationId = params.donationId;

  if (!donationId) {
    return NextResponse.json({ error: 'ID du don requis.' }, { status: 400 });
  }

  try {
    const client = await pool.connect();

    const donationResult = await client.query(
      `SELECT 
        id, cagnotte_id, donor_name, amount, comment, 
        is_anonymous, payment_status, payment_reference, 
        created_at, updated_at
       FROM cagnotte_donations 
       WHERE id = $1`,
      [donationId]
    );

    client.release();

    if (donationResult.rows.length === 0) {
      return NextResponse.json({ error: 'Don introuvable.' }, { status: 404 });
    }

    const donation = donationResult.rows[0];

    return NextResponse.json({
      donation: {
        id: donation.id,
        cagnotte_id: donation.cagnotte_id,
        donor_name: donation.is_anonymous ? 'Anonyme' : donation.donor_name,
        amount: donation.amount,
        comment: donation.comment,
        payment_status: donation.payment_status,
        payment_reference: donation.payment_reference,
        created_at: donation.created_at,
        updated_at: donation.updated_at
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du don:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}
