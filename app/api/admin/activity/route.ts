import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRole, UserRole } from '../../../../lib/adminAuth';
import pool from '../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const authResult = await verifyAdminRole(request, UserRole.MODERATOR);
    
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error || 'Accès non autorisé' },
        { status: 401 }
      );
    }

    // Récupérer l'activité récente depuis la vue
    const activityQuery = `
      SELECT 
        activity_type,
        activity_description,
        details,
        created_at,
        user_name
      FROM recent_activity_view
      ORDER BY created_at DESC
      LIMIT 10
    `;

    const result = await pool.query(activityQuery);
    
    // Formater les données pour l'affichage
    const activities = result.rows.map(row => ({
      type: row.activity_type,
      description: row.activity_description,
      details: row.details,
      timestamp: row.created_at,
      user: row.user_name || 'Utilisateur inconnu',
      // Ajouter des icônes et couleurs selon le type
      icon: getActivityIcon(row.activity_type),
      color: getActivityColor(row.activity_type)
    }));

    return NextResponse.json(activities);

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'activité:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

function getActivityIcon(type: string): string {
  switch (type) {
    case 'cagnotte_created':
      return 'FiFileText';
    case 'moderation_action':
      return 'FiCheckCircle';
    case 'report_created':
      return 'FiAlertTriangle';
    case 'user_registered':
      return 'FiUsers';
    default:
      return 'FiClock';
  }
}

function getActivityColor(type: string): string {
  switch (type) {
    case 'cagnotte_created':
      return 'blue';
    case 'moderation_action':
      return 'green';
    case 'report_created':
      return 'yellow';
    case 'user_registered':
      return 'purple';
    default:
      return 'gray';
  }
}
