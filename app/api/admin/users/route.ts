import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRole, UserRole } from '../../../../lib/adminAuth';
import pool from '../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const authResult = await verifyAdminRole(request, UserRole.ADMIN);
    
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error || 'Accès non autorisé' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const client = await pool.connect();

    try {
      // Construire la clause WHERE
      const conditions = [];
      const params = [];
      let paramIndex = 1;

      if (role) {
        conditions.push(`p.role = $${paramIndex}`);
        params.push(role);
        paramIndex++;
      }

      // Note: is_active column doesn't exist in current schema
      // if (status === 'active') {
      //   conditions.push(`p.is_active = true`);
      // } else if (status === 'inactive') {
      //   conditions.push(`p.is_active = false`);
      // }

      if (search) {
        conditions.push(`(
          p.username ILIKE $${paramIndex} OR
          p.first_name ILIKE $${paramIndex} OR
          p.last_name ILIKE $${paramIndex} OR
          p.phone_number ILIKE $${paramIndex}
        )`);
        params.push(`%${search}%`);
        paramIndex++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      // Requête principale pour récupérer les utilisateurs
      const usersQuery = `
        SELECT
          p.id,
          p.username,
          p.first_name,
          p.last_name,
          p.phone_number,
          p.country,
          p.role,
          p.created_at,
          p.updated_at,
          COUNT(c.id) as cagnottes_count,
          COALESCE(SUM(c.current_amount), 0) as total_raised
        FROM profiles p
        LEFT JOIN cagnottes c ON p.id = c.user_id AND c.moderation_status = 'approved'
        ${whereClause}
        GROUP BY p.id, p.username, p.first_name, p.last_name,
                 p.phone_number, p.country, p.role, p.created_at, p.updated_at
        ORDER BY p.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      params.push(limit, offset);
      const usersResult = await client.query(usersQuery, params);

      // Compter le total
      const countQuery = `
        SELECT COUNT(*) as total
        FROM profiles p
        ${whereClause}
      `;
      
      const countParams = params.slice(0, -2); // Enlever limit et offset
      const countResult = await client.query(countQuery, countParams);

      // Statistiques générales
      const statsResult = await client.query(`
        SELECT
          COUNT(*) as total_users,
          COUNT(*) as active_users,
          0 as inactive_users,
          COUNT(*) FILTER (WHERE role = 'user') as regular_users,
          COUNT(*) FILTER (WHERE role = 'moderator') as moderators,
          COUNT(*) FILTER (WHERE role = 'admin') as admins,
          COUNT(*) FILTER (WHERE role = 'super_admin') as super_admins,
          COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as new_users_week,
          COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_users_month
        FROM profiles
      `);

      // Activité récente des utilisateurs
      const activityResult = await client.query(`
        SELECT 
          'cagnotte_created' as activity_type,
          'Cagnotte créée' as activity_description,
          c.title as details,
          c.created_at,
          COALESCE(p.first_name || ' ' || p.last_name, p.username) as user_name,
          p.id as user_id
        FROM cagnottes c
        LEFT JOIN profiles p ON c.user_id = p.id
        WHERE c.created_at >= NOW() - INTERVAL '7 days'
        
        UNION ALL
        
        SELECT 
          'user_registered' as activity_type,
          'Nouvel utilisateur' as activity_description,
          COALESCE(p.first_name || ' ' || p.last_name, p.username) as details,
          p.created_at,
          COALESCE(p.first_name || ' ' || p.last_name, p.username) as user_name,
          p.id as user_id
        FROM profiles p
        WHERE p.created_at >= NOW() - INTERVAL '7 days'
        
        ORDER BY created_at DESC
        LIMIT 10
      `);

      client.release();

      return NextResponse.json({
        users: usersResult.rows,
        pagination: {
          total: parseInt(countResult.rows[0].total),
          limit,
          offset,
          hasMore: offset + limit < parseInt(countResult.rows[0].total)
        },
        stats: statsResult.rows[0],
        recentActivity: activityResult.rows
      });

    } catch (error) {
      client.release();
      throw error;
    }

  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
