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
    const status = searchParams.get('status'); // pending, approved, rejected, suspended
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');

    const client = await pool.connect();

    // Construire la requête avec filtres
    let whereClause = 'WHERE 1=1';
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (status && ['pending', 'approved', 'rejected', 'suspended'].includes(status)) {
      whereClause += ` AND c.moderation_status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    if (search) {
      whereClause += ` AND (c.title ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Requête principale
    const query = `
      SELECT 
        c.id,
        c.title,
        c.description,
        c.category,
        c.target_amount,
        c.current_amount,
        c.status,
        c.moderation_status,
        c.moderation_notes,
        c.moderated_at,
        c.created_at,
        c.updated_at,
        p.username as creator_username,
        p.first_name as creator_first_name,
        p.last_name as creator_last_name,
        p.phone_number as creator_phone,
        moderator.username as moderator_username,
        moderator.first_name as moderator_first_name,
        moderator.last_name as moderator_last_name
      FROM cagnottes c
      LEFT JOIN profiles p ON c.user_id = p.id
      LEFT JOIN profiles moderator ON c.moderated_by = moderator.id
      ${whereClause}
      ORDER BY 
        CASE 
          WHEN c.moderation_status = 'pending' THEN 1
          WHEN c.moderation_status = 'approved' THEN 2
          WHEN c.moderation_status = 'rejected' THEN 3
          WHEN c.moderation_status = 'suspended' THEN 4
          ELSE 5
        END,
        c.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    const result = await client.query(query, queryParams);

    // Compter le total pour la pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM cagnottes c
      LEFT JOIN profiles p ON c.user_id = p.id
      ${whereClause}
    `;

    const countResult = await client.query(countQuery, queryParams.slice(0, -2)); // Enlever limit et offset

    // Statistiques rapides
    const statsQuery = `
      SELECT 
        moderation_status,
        COUNT(*) as count
      FROM cagnottes
      GROUP BY moderation_status
    `;

    const statsResult = await client.query(statsQuery);

    client.release();

    // Formater les résultats
    const cagnottes = result.rows.map(row => ({
      ...row,
      creator: {
        username: row.creator_username,
        first_name: row.creator_first_name,
        last_name: row.creator_last_name,
        phone: row.creator_phone
      },
      moderator: row.moderator_username ? {
        username: row.moderator_username,
        first_name: row.moderator_first_name,
        last_name: row.moderator_last_name
      } : null
    }));

    // Nettoyer les propriétés redondantes
    cagnottes.forEach(cagnotte => {
      delete cagnotte.creator_username;
      delete cagnotte.creator_first_name;
      delete cagnotte.creator_last_name;
      delete cagnotte.creator_phone;
      delete cagnotte.moderator_username;
      delete cagnotte.moderator_first_name;
      delete cagnotte.moderator_last_name;
    });

    const stats = statsResult.rows.reduce((acc, row) => {
      acc[row.moderation_status || 'null'] = parseInt(row.count);
      return acc;
    }, {});

    return NextResponse.json({
      cagnottes,
      pagination: {
        total: parseInt(countResult.rows[0].total),
        limit,
        offset,
        hasMore: offset + limit < parseInt(countResult.rows[0].total)
      },
      stats
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des cagnottes admin:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
