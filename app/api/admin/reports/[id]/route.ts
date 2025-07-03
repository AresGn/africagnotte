import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRole, UserRole } from '../../../../../lib/adminAuth';
import pool from '../../../../../lib/db';

// PUT - Traiter un signalement
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id: reportId } = await params;
    const body = await request.json();
    const { status, notes } = body;

    // Validation des données
    if (!status || !['reviewed', 'resolved'].includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide. Statuts autorisés: reviewed, resolved' },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Vérifier que le signalement existe
      const reportResult = await client.query(
        'SELECT * FROM reports WHERE id = $1',
        [reportId]
      );

      if (reportResult.rows.length === 0) {
        await client.query('ROLLBACK');
        client.release();
        return NextResponse.json(
          { error: 'Signalement non trouvé' },
          { status: 404 }
        );
      }

      // Mettre à jour le signalement
      await client.query(
        `UPDATE reports 
         SET status = $1, 
             reviewed_by = $2, 
             reviewed_at = NOW()
         WHERE id = $3`,
        [status, authResult.user?.id, reportId]
      );

      // Si le signalement est résolu, on peut aussi ajouter une note dans moderation_actions
      if (status === 'resolved' && notes) {
        const report = reportResult.rows[0];
        await client.query(
          `INSERT INTO moderation_actions (cagnotte_id, moderator_id, action, reason, notes)
           VALUES ($1, $2, 'report_resolved', $3, $4)`,
          [report.cagnotte_id, authResult.user?.id, report.reason, notes]
        );
      }

      await client.query('COMMIT');

      // Récupérer le signalement mis à jour
      const updatedReportResult = await client.query(
        `SELECT 
          r.*,
          c.title as cagnotte_title,
          reviewer.username as reviewer_username,
          reviewer.first_name as reviewer_first_name,
          reviewer.last_name as reviewer_last_name
         FROM reports r
         LEFT JOIN cagnottes c ON r.cagnotte_id = c.id
         LEFT JOIN profiles reviewer ON r.reviewed_by = reviewer.id
         WHERE r.id = $1`,
        [reportId]
      );

      client.release();

      return NextResponse.json({
        success: true,
        message: `Signalement ${status === 'reviewed' ? 'examiné' : 'résolu'} avec succès`,
        report: updatedReportResult.rows[0]
      });

    } catch (error) {
      await client.query('ROLLBACK');
      client.release();
      throw error;
    }

  } catch (error) {
    console.error('Erreur lors du traitement du signalement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// GET - Récupérer les détails d'un signalement
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id: reportId } = await params;
    const client = await pool.connect();

    // Récupérer les détails du signalement
    const reportResult = await client.query(
      `SELECT 
        r.*,
        c.id as cagnotte_id,
        c.title as cagnotte_title,
        c.description as cagnotte_description,
        c.moderation_status as cagnotte_status,
        reporter.username as reporter_username,
        reporter.first_name as reporter_first_name,
        reporter.last_name as reporter_last_name,
        reviewer.username as reviewer_username,
        reviewer.first_name as reviewer_first_name,
        reviewer.last_name as reviewer_last_name
       FROM reports r
       LEFT JOIN cagnottes c ON r.cagnotte_id = c.id
       LEFT JOIN profiles reporter ON r.reporter_id = reporter.id
       LEFT JOIN profiles reviewer ON r.reviewed_by = reviewer.id
       WHERE r.id = $1`,
      [reportId]
    );

    if (reportResult.rows.length === 0) {
      client.release();
      return NextResponse.json(
        { error: 'Signalement non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer l'historique de modération de la cagnotte associée
    const historyResult = await client.query(
      `SELECT 
        ma.*,
        p.username as moderator_username,
        p.first_name as moderator_first_name,
        p.last_name as moderator_last_name
       FROM moderation_actions ma
       LEFT JOIN profiles p ON ma.moderator_id = p.id
       WHERE ma.cagnotte_id = $1
       ORDER BY ma.created_at DESC`,
      [reportResult.rows[0].cagnotte_id]
    );

    client.release();

    return NextResponse.json({
      report: reportResult.rows[0],
      moderationHistory: historyResult.rows
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du signalement:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
