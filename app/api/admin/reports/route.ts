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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const reason = searchParams.get('reason') || '';
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const client = await pool.connect();

    try {
      // Construire la clause WHERE
      const conditions = [];
      const params = [];
      let paramIndex = 1;

      if (status) {
        conditions.push(`r.status = $${paramIndex}`);
        params.push(status);
        paramIndex++;
      }

      if (reason) {
        conditions.push(`r.reason = $${paramIndex}`);
        params.push(reason);
        paramIndex++;
      }

      if (search) {
        conditions.push(`(
          c.title ILIKE $${paramIndex} OR 
          r.description ILIKE $${paramIndex} OR
          reporter.username ILIKE $${paramIndex}
        )`);
        params.push(`%${search}%`);
        paramIndex++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      // Requête principale pour récupérer les signalements
      const reportsQuery = `
        SELECT 
          r.id,
          r.reason,
          r.description,
          r.status,
          r.created_at,
          r.reviewed_at,
          c.id as cagnotte_id,
          c.title as cagnotte_title,
          c.moderation_status as cagnotte_status,
          reporter.id as reporter_id,
          reporter.username as reporter_username,
          reporter.first_name as reporter_first_name,
          reporter.last_name as reporter_last_name,
          reviewer.id as reviewer_id,
          reviewer.username as reviewer_username,
          reviewer.first_name as reviewer_first_name,
          reviewer.last_name as reviewer_last_name
        FROM reports r
        LEFT JOIN cagnottes c ON r.cagnotte_id = c.id
        LEFT JOIN profiles reporter ON r.reporter_id = reporter.id
        LEFT JOIN profiles reviewer ON r.reviewed_by = reviewer.id
        ${whereClause}
        ORDER BY 
          CASE 
            WHEN r.status = 'pending' THEN 1
            WHEN r.status = 'reviewed' THEN 2
            WHEN r.status = 'resolved' THEN 3
          END,
          r.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      params.push(limit, offset);
      const reportsResult = await client.query(reportsQuery, params);

      // Compter le total
      const countQuery = `
        SELECT COUNT(*) as total
        FROM reports r
        LEFT JOIN cagnottes c ON r.cagnotte_id = c.id
        LEFT JOIN profiles reporter ON r.reporter_id = reporter.id
        ${whereClause}
      `;
      
      const countParams = params.slice(0, -2); // Enlever limit et offset
      const countResult = await client.query(countQuery, countParams);

      // Statistiques générales
      const statsResult = await client.query(`
        SELECT 
          COUNT(*) as total_reports,
          COUNT(*) FILTER (WHERE status = 'pending') as pending_reports,
          COUNT(*) FILTER (WHERE status = 'reviewed') as reviewed_reports,
          COUNT(*) FILTER (WHERE status = 'resolved') as resolved_reports,
          COUNT(*) FILTER (WHERE reason = 'fraud') as fraud_reports,
          COUNT(*) FILTER (WHERE reason = 'inappropriate') as inappropriate_reports,
          COUNT(*) FILTER (WHERE reason = 'spam') as spam_reports,
          COUNT(*) FILTER (WHERE reason = 'other') as other_reports
        FROM reports
      `);

      client.release();

      return NextResponse.json({
        reports: reportsResult.rows,
        pagination: {
          total: parseInt(countResult.rows[0].total),
          limit,
          offset,
          hasMore: offset + limit < parseInt(countResult.rows[0].total)
        },
        stats: statsResult.rows[0]
      });

    } catch (error) {
      client.release();
      throw error;
    }

  } catch (error) {
    console.error('Erreur lors de la récupération des signalements:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
