import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRole, UserRole } from '../../../../../lib/adminAuth';
import pool from '../../../../../lib/db';

// PUT - Modifier un utilisateur
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification admin
    const authResult = await verifyAdminRole(request, UserRole.ADMIN);
    
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error || 'Accès non autorisé' },
        { status: 401 }
      );
    }

    const { id: userId } = await params;
    const body = await request.json();
    const { action, role } = body;

    // Validation des données
    if (!action || !['activate', 'deactivate', 'change_role'].includes(action)) {
      return NextResponse.json(
        { error: 'Action invalide. Actions autorisées: activate, deactivate, change_role' },
        { status: 400 }
      );
    }

    if (action === 'change_role' && !role) {
      return NextResponse.json(
        { error: 'Le rôle est requis pour l\'action change_role' },
        { status: 400 }
      );
    }

    if (action === 'change_role' && !['user', 'moderator', 'admin', 'super_admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Rôle invalide. Rôles autorisés: user, moderator, admin, super_admin' },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Vérifier que l'utilisateur existe
      const userResult = await client.query(
        'SELECT * FROM profiles WHERE id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        await client.query('ROLLBACK');
        client.release();
        return NextResponse.json(
          { error: 'Utilisateur non trouvé' },
          { status: 404 }
        );
      }

      const user = userResult.rows[0];

      // Vérifier les permissions pour les changements de rôle
      if (action === 'change_role') {
        // Seul un super_admin peut modifier les rôles admin et super_admin
        if ((role === 'admin' || role === 'super_admin' || user.role === 'admin' || user.role === 'super_admin') 
            && authResult.user?.role !== 'super_admin') {
          await client.query('ROLLBACK');
          client.release();
          return NextResponse.json(
            { error: 'Seul un super administrateur peut modifier les rôles administrateur' },
            { status: 403 }
          );
        }

        // Empêcher de se retirer ses propres privilèges super_admin
        if (user.id === authResult.user?.id && user.role === 'super_admin' && role !== 'super_admin') {
          await client.query('ROLLBACK');
          client.release();
          return NextResponse.json(
            { error: 'Vous ne pouvez pas retirer vos propres privilèges de super administrateur' },
            { status: 403 }
          );
        }
      }

      // Appliquer l'action
      let updateQuery = '';
      let updateParams: (string | number)[] = [];
      let actionDescription = '';

      switch (action) {
        case 'activate':
          updateQuery = 'UPDATE profiles SET is_active = true, updated_at = NOW() WHERE id = $1';
          updateParams = [userId];
          actionDescription = 'Utilisateur activé';
          break;
        case 'deactivate':
          updateQuery = 'UPDATE profiles SET is_active = false, updated_at = NOW() WHERE id = $1';
          updateParams = [userId];
          actionDescription = 'Utilisateur désactivé';
          break;
        case 'change_role':
          updateQuery = 'UPDATE profiles SET role = $1, updated_at = NOW() WHERE id = $2';
          updateParams = [role, userId];
          actionDescription = `Rôle changé vers ${role}`;
          break;
      }

      await client.query(updateQuery, updateParams);

      // Enregistrer l'action dans un log (optionnel - vous pouvez créer une table admin_actions)
      // Pour l'instant, on peut utiliser moderation_actions ou créer une nouvelle table
      
      await client.query('COMMIT');

      // Récupérer l'utilisateur mis à jour
      const updatedUserResult = await client.query(
        `SELECT 
          id, username, email, first_name, last_name, 
          phone_number, role, is_active, created_at, updated_at
         FROM profiles 
         WHERE id = $1`,
        [userId]
      );

      client.release();

      return NextResponse.json({
        success: true,
        message: actionDescription,
        user: updatedUserResult.rows[0]
      });

    } catch (error) {
      await client.query('ROLLBACK');
      client.release();
      throw error;
    }

  } catch (error) {
    console.error('Erreur lors de la modification de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// GET - Récupérer les détails d'un utilisateur
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification admin
    const authResult = await verifyAdminRole(request, UserRole.ADMIN);
    
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error || 'Accès non autorisé' },
        { status: 401 }
      );
    }

    const { id: userId } = await params;
    const client = await pool.connect();

    // Récupérer les détails de l'utilisateur
    const userResult = await client.query(
      `SELECT 
        p.*,
        COUNT(c.id) as total_cagnottes,
        COUNT(c.id) FILTER (WHERE c.moderation_status = 'approved') as approved_cagnottes,
        COUNT(c.id) FILTER (WHERE c.moderation_status = 'pending') as pending_cagnottes,
        COUNT(c.id) FILTER (WHERE c.moderation_status = 'rejected') as rejected_cagnottes,
        COALESCE(SUM(c.current_amount) FILTER (WHERE c.moderation_status = 'approved'), 0) as total_raised
       FROM profiles p
       LEFT JOIN cagnottes c ON p.id = c.user_id
       WHERE p.id = $1
       GROUP BY p.id`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      client.release();
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer les cagnottes récentes de l'utilisateur
    const cagnottesResult = await client.query(
      `SELECT 
        id, title, description, target_amount, current_amount, 
        moderation_status, created_at
       FROM cagnottes 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 5`,
      [userId]
    );

    // Récupérer les signalements concernant cet utilisateur
    const reportsResult = await client.query(
      `SELECT 
        r.id, r.reason, r.description, r.status, r.created_at,
        c.title as cagnotte_title
       FROM reports r
       LEFT JOIN cagnottes c ON r.cagnotte_id = c.id
       WHERE c.user_id = $1
       ORDER BY r.created_at DESC
       LIMIT 5`,
      [userId]
    );

    client.release();

    return NextResponse.json({
      user: userResult.rows[0],
      recentCagnottes: cagnottesResult.rows,
      recentReports: reportsResult.rows
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
