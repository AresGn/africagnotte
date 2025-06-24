import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, UserRole } from '../../../../lib/adminAuth';
import pool from '../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const authResult = await withAdminAuth(request, UserRole.MODERATOR);
    
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    // Récupérer les statistiques depuis la base de données
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM cagnottes) as total_cagnottes,
        (SELECT COUNT(*) FROM cagnottes WHERE moderation_status = 'pending') as pending_cagnottes,
        (SELECT COUNT(*) FROM cagnottes WHERE moderation_status = 'approved') as approved_cagnottes,
        (SELECT COUNT(*) FROM cagnottes WHERE moderation_status = 'rejected') as rejected_cagnottes,
        (SELECT COUNT(*) FROM cagnottes WHERE moderation_status = 'suspended') as suspended_cagnottes,
        (SELECT COUNT(*) FROM profiles) as total_users,
        (SELECT COUNT(*) FROM reports WHERE status = 'pending') as pending_reports,
        (SELECT COUNT(*) FROM reports) as total_reports
    `;

    const result = await pool.query(statsQuery);
    const stats = result.rows[0];

    // Convertir les chaînes en nombres
    const formattedStats = {
      total_cagnottes: parseInt(stats.total_cagnottes) || 0,
      pending_cagnottes: parseInt(stats.pending_cagnottes) || 0,
      approved_cagnottes: parseInt(stats.approved_cagnottes) || 0,
      rejected_cagnottes: parseInt(stats.rejected_cagnottes) || 0,
      suspended_cagnottes: parseInt(stats.suspended_cagnottes) || 0,
      total_users: parseInt(stats.total_users) || 0,
      pending_reports: parseInt(stats.pending_reports) || 0,
      total_reports: parseInt(stats.total_reports) || 0
    };

    return NextResponse.json(formattedStats);

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques admin:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
