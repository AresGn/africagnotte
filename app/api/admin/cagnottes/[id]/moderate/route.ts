import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRole, UserRole } from '../../../../../../lib/adminAuth';
import pool from '../../../../../../lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification admin (minimum moderator)
    const authResult = await verifyAdminRole(request, UserRole.MODERATOR);
    
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error || 'Accès non autorisé' },
        { status: 401 }
      );
    }

    const cagnotteId = params.id;
    const body = await request.json();
    const { action, reason, notes } = body;

    // Validation des données
    if (!action || !['approve', 'reject', 'suspend', 'request_info'].includes(action)) {
      return NextResponse.json(
        { error: 'Action invalide. Actions autorisées: approve, reject, suspend, request_info' },
        { status: 400 }
      );
    }

    if (!cagnotteId) {
      return NextResponse.json(
        { error: 'ID de la cagnotte requis' },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Vérifier que la cagnotte existe
      const cagnotteResult = await client.query(
        'SELECT id, title, user_id, moderation_status FROM cagnottes WHERE id = $1',
        [cagnotteId]
      );

      if (cagnotteResult.rows.length === 0) {
        await client.query('ROLLBACK');
        client.release();
        return NextResponse.json(
          { error: 'Cagnotte introuvable' },
          { status: 404 }
        );
      }

      const cagnotte = cagnotteResult.rows[0];

      // Déterminer le nouveau statut de modération
      let newModerationStatus: string;
      switch (action) {
        case 'approve':
          newModerationStatus = 'approved';
          break;
        case 'reject':
          newModerationStatus = 'rejected';
          break;
        case 'suspend':
          newModerationStatus = 'suspended';
          break;
        case 'request_info':
          newModerationStatus = 'pending'; // Reste en attente mais avec une demande d'info
          break;
        default:
          throw new Error('Action non supportée');
      }

      // Mettre à jour le statut de modération de la cagnotte
      await client.query(
        `UPDATE cagnottes 
         SET moderation_status = $1::moderation_status,
             moderation_notes = $2,
             moderated_by = $3,
             moderated_at = NOW()
         WHERE id = $4`,
        [newModerationStatus, notes, authResult.user?.id, cagnotteId]
      );

      // Enregistrer l'action de modération
      await client.query(
        `INSERT INTO moderation_actions (cagnotte_id, moderator_id, action, reason, notes)
         VALUES ($1, $2, $3, $4, $5)`,
        [cagnotteId, authResult.user?.id, action, reason, notes]
      );

      await client.query('COMMIT');

      // Retourner la cagnotte mise à jour
      const updatedCagnotte = await client.query(
        `SELECT id, title, moderation_status, moderation_notes, moderated_by, moderated_at
         FROM cagnottes WHERE id = $1`,
        [cagnotteId]
      );

      client.release();

      return NextResponse.json({
        success: true,
        message: `Cagnotte ${action === 'approve' ? 'approuvée' : action === 'reject' ? 'rejetée' : action === 'suspend' ? 'suspendue' : 'mise à jour'} avec succès`,
        cagnotte: updatedCagnotte.rows[0]
      });

    } catch (error) {
      await client.query('ROLLBACK');
      client.release();
      throw error;
    }

  } catch (error) {
    console.error('Erreur lors de la modération de la cagnotte:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// GET - Récupérer l'historique de modération d'une cagnotte
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification admin
    const authResult = await verifyAdminRole(request, UserRole.MODERATOR);
    
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error || 'Accès non autorisé' },
        { status: 401 }
      );
    }

    const cagnotteId = params.id;
    const client = await pool.connect();

    // Récupérer l'historique de modération
    const historyResult = await client.query(
      `SELECT 
        ma.id,
        ma.action,
        ma.reason,
        ma.notes,
        ma.created_at,
        p.username as moderator_username,
        p.first_name as moderator_first_name,
        p.last_name as moderator_last_name
       FROM moderation_actions ma
       LEFT JOIN profiles p ON ma.moderator_id = p.id
       WHERE ma.cagnotte_id = $1
       ORDER BY ma.created_at DESC`,
      [cagnotteId]
    );

    // Récupérer les informations actuelles de la cagnotte
    const cagnotteResult = await client.query(
      `SELECT 
        id, title, moderation_status, moderation_notes, 
        moderated_by, moderated_at, created_at
       FROM cagnottes 
       WHERE id = $1`,
      [cagnotteId]
    );

    client.release();

    if (cagnotteResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Cagnotte introuvable' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      cagnotte: cagnotteResult.rows[0],
      history: historyResult.rows
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique de modération:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
