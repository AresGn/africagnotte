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

    // Récupérer les statistiques du jour
    const todayStatsQuery = `
      SELECT 
        new_cagnottes,
        new_users,
        moderations_done,
        reports_received,
        reports_resolved,
        total_amount_collected
      FROM daily_stats 
      WHERE date = CURRENT_DATE
    `;

    const todayResult = await pool.query(todayStatsQuery);
    
    // Si pas de données pour aujourd'hui, calculer en temps réel
    let todayStats;
    if (todayResult.rows.length === 0) {
      const realTimeQuery = `
        SELECT 
          COALESCE(COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE), 0) as new_cagnottes,
          COALESCE((SELECT COUNT(*) FROM profiles WHERE DATE(created_at) = CURRENT_DATE), 0) as new_users,
          COALESCE((SELECT COUNT(*) FROM moderation_actions WHERE DATE(created_at) = CURRENT_DATE), 0) as moderations_done,
          COALESCE((SELECT COUNT(*) FROM reports WHERE DATE(created_at) = CURRENT_DATE), 0) as reports_received,
          COALESCE((SELECT COUNT(*) FROM reports WHERE DATE(reviewed_at) = CURRENT_DATE), 0) as reports_resolved,
          COALESCE((SELECT SUM(current_amount) FROM cagnottes WHERE DATE(updated_at) = CURRENT_DATE), 0) as total_amount_collected
        FROM cagnottes
      `;
      
      const realTimeResult = await pool.query(realTimeQuery);
      todayStats = realTimeResult.rows[0];
    } else {
      todayStats = todayResult.rows[0];
    }

    // Récupérer les tendances des 7 derniers jours
    const trendsQuery = `
      SELECT 
        date,
        new_cagnottes,
        new_users,
        moderations_done,
        reports_received,
        total_amount_collected
      FROM daily_stats 
      WHERE date >= CURRENT_DATE - INTERVAL '7 days'
      ORDER BY date DESC
    `;

    const trendsResult = await pool.query(trendsQuery);

    // Calculer les moyennes et tendances
    const trends = trendsResult.rows;
    const avgNewCagnottes = trends.length > 0 ? 
      trends.reduce((sum, day) => sum + parseInt(day.new_cagnottes), 0) / trends.length : 0;
    const avgNewUsers = trends.length > 0 ? 
      trends.reduce((sum, day) => sum + parseInt(day.new_users), 0) / trends.length : 0;

    // Formater la réponse
    const response = {
      today: {
        new_cagnottes: parseInt(todayStats.new_cagnottes) || 0,
        new_users: parseInt(todayStats.new_users) || 0,
        moderations_done: parseInt(todayStats.moderations_done) || 0,
        reports_received: parseInt(todayStats.reports_received) || 0,
        reports_resolved: parseInt(todayStats.reports_resolved) || 0,
        total_amount_collected: parseFloat(todayStats.total_amount_collected) || 0
      },
      trends: {
        avg_new_cagnottes: Math.round(avgNewCagnottes * 10) / 10,
        avg_new_users: Math.round(avgNewUsers * 10) / 10,
        weekly_data: trends.map(day => ({
          date: day.date,
          new_cagnottes: parseInt(day.new_cagnottes),
          new_users: parseInt(day.new_users),
          moderations_done: parseInt(day.moderations_done),
          total_collected: parseFloat(day.total_amount_collected)
        }))
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques quotidiennes:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
