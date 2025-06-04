import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// POST - Créer une donation (accessible aux utilisateurs anonymes)
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
      donor_email, // Optionnel pour les utilisateurs anonymes
      donor_phone  // Optionnel pour les utilisateurs anonymes
    } = body;

    // Validation des données
    if (!donor_name || !amount) {
      return NextResponse.json({ 
        error: 'Le nom du donateur et le montant sont requis.' 
      }, { status: 400 });
    }

    if (amount <= 0) {
      return NextResponse.json({ 
        error: 'Le montant doit être supérieur à 0.' 
      }, { status: 400 });
    }

    if (donor_name.length > 100) {
      return NextResponse.json({ 
        error: 'Le nom du donateur ne peut pas dépasser 100 caractères.' 
      }, { status: 400 });
    }

    if (comment && comment.length > 500) {
      return NextResponse.json({ 
        error: 'Le commentaire ne peut pas dépasser 500 caractères.' 
      }, { status: 400 });
    }

    const client = await pool.connect();

    // Vérifier que la cagnotte existe et est accessible
    const cagnotteResult = await client.query(
      'SELECT id, is_private, status, current_amount FROM cagnottes WHERE id = $1',
      [cagnotteId]
    );

    if (cagnotteResult.rows.length === 0) {
      client.release();
      return NextResponse.json({ error: 'Cagnotte introuvable.' }, { status: 404 });
    }

    const cagnotte = cagnotteResult.rows[0];

    // Vérifier que la cagnotte est publique (les donations anonymes ne sont autorisées que sur les cagnottes publiques)
    if (cagnotte.is_private) {
      client.release();
      return NextResponse.json({ 
        error: 'Les donations ne sont pas autorisées sur les cagnottes privées.' 
      }, { status: 403 });
    }

    // Vérifier que la cagnotte est active
    if (cagnotte.status !== 'active') {
      client.release();
      return NextResponse.json({ 
        error: 'Cette cagnotte n\'accepte plus de donations.' 
      }, { status: 400 });
    }

    // Créer la donation
    const donationResult = await client.query(
      `INSERT INTO cagnotte_donations 
       (cagnotte_id, donor_name, amount, comment, is_anonymous, payment_reference, donor_email, donor_phone, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        cagnotteId,
        donor_name,
        amount,
        comment || null,
        is_anonymous,
        payment_reference || null,
        donor_email || null,
        donor_phone || null,
        'pending' // Statut initial
      ]
    );

    // Mettre à jour le montant collecté de la cagnotte
    await client.query(
      'UPDATE cagnottes SET current_amount = current_amount + $1, updated_at = NOW() WHERE id = $2',
      [amount, cagnotteId]
    );

    client.release();

    const newDonation = donationResult.rows[0];

    return NextResponse.json({
      message: 'Donation créée avec succès.',
      donation: {
        id: newDonation.id,
        amount: newDonation.amount,
        donor_name: newDonation.is_anonymous ? 'Anonyme' : newDonation.donor_name,
        comment: newDonation.comment,
        created_at: newDonation.created_at
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création de la donation:', error);
    return NextResponse.json({ 
      error: 'Erreur interne du serveur lors de la création de la donation.' 
    }, { status: 500 });
  }
}
