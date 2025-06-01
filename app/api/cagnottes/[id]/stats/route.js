import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Récupérer les statistiques détaillées d'une cagnotte
export async function GET(request, { params }) {
  const cagnotteId = params.id;
  const headersList = request.headers;
  const userId = headersList.get('x-user-id');

  if (!cagnotteId) {
    return NextResponse.json({ error: 'ID de la cagnotte requis.' }, { status: 400 });
  }

  try {
    const client = await pool.connect();

    // Vérifier que la cagnotte existe
    const cagnotteResult = await client.query(
      'SELECT id, title, user_id, is_private, current_amount, target_amount, participants_count, created_at FROM cagnottes WHERE id = $1',
      [cagnotteId]
    );

    if (cagnotteResult.rows.length === 0) {
      client.release();
      return NextResponse.json({ error: 'Cagnotte introuvable.' }, { status: 404 });
    }

    const cagnotte = cagnotteResult.rows[0];
    const isOwner = userId === cagnotte.user_id;

    // Si la cagnotte est privée, seul le propriétaire peut voir les stats
    if (cagnotte.is_private && !isOwner) {
      client.release();
      return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 403 });
    }

    // Statistiques de base
    const basicStats = {
      total_amount: cagnotte.current_amount || 0,
      target_amount: cagnotte.target_amount,
      participants_count: cagnotte.participants_count || 0,
      completion_percentage: cagnotte.target_amount ? 
        Math.round((cagnotte.current_amount / cagnotte.target_amount) * 100) : null
    };

    // Statistiques détaillées (pour le propriétaire uniquement)
    let detailedStats = {};
    if (isOwner) {
      // Répartition par montant
      const amountDistribution = await client.query(
        `SELECT 
          CASE 
            WHEN amount < 25000 THEN 'Petits dons (< 25k)'
            WHEN amount BETWEEN 25000 AND 100000 THEN 'Dons moyens (25k-100k)'
            WHEN amount BETWEEN 100001 AND 250000 THEN 'Gros dons (100k-250k)'
            ELSE 'Très gros dons (> 250k)'
          END as tranche,
          COUNT(*) as count,
          SUM(amount) as total
         FROM cagnotte_donations 
         WHERE cagnotte_id = $1 AND payment_status = 'completed'
         GROUP BY 
          CASE 
            WHEN amount < 25000 THEN 'Petits dons (< 25k)'
            WHEN amount BETWEEN 25000 AND 100000 THEN 'Dons moyens (25k-100k)'
            WHEN amount BETWEEN 100001 AND 250000 THEN 'Gros dons (100k-250k)'
            ELSE 'Très gros dons (> 250k)'
          END
         ORDER BY MIN(amount)`,
        [cagnotteId]
      );

      // Évolution par semaine
      const weeklyEvolution = await client.query(
        `SELECT 
          DATE_TRUNC('week', created_at) as week,
          COUNT(*) as donations_count,
          SUM(amount) as week_amount,
          SUM(SUM(amount)) OVER (ORDER BY DATE_TRUNC('week', created_at)) as cumulative_amount
         FROM cagnotte_donations 
         WHERE cagnotte_id = $1 AND payment_status = 'completed'
         GROUP BY DATE_TRUNC('week', created_at)
         ORDER BY week`,
        [cagnotteId]
      );

      // Top donateurs (anonymisé)
      const topDonors = await client.query(
        `SELECT 
          CASE 
            WHEN is_anonymous THEN 'Anonyme'
            ELSE LEFT(donor_name, 1) || '***'
          END as donor_display,
          amount,
          created_at
         FROM cagnotte_donations 
         WHERE cagnotte_id = $1 AND payment_status = 'completed'
         ORDER BY amount DESC
         LIMIT 10`,
        [cagnotteId]
      );

      // Statistiques des commentaires
      const commentStats = await client.query(
        `SELECT 
          COUNT(*) as total_donations,
          COUNT(comment) as donations_with_comment,
          ROUND((COUNT(comment)::float / COUNT(*)) * 100, 1) as comment_percentage
         FROM cagnotte_donations 
         WHERE cagnotte_id = $1 AND payment_status = 'completed'`,
        [cagnotteId]
      );

      // Dons en attente
      const pendingDonations = await client.query(
        `SELECT 
          COUNT(*) as pending_count,
          COALESCE(SUM(amount), 0) as pending_amount
         FROM cagnotte_donations 
         WHERE cagnotte_id = $1 AND payment_status = 'pending'`,
        [cagnotteId]
      );

      detailedStats = {
        amount_distribution: amountDistribution.rows,
        weekly_evolution: weeklyEvolution.rows,
        top_donors: topDonors.rows,
        comment_stats: commentStats.rows[0],
        pending_donations: pendingDonations.rows[0],
        average_donation: basicStats.participants_count > 0 ? 
          Math.round(basicStats.total_amount / basicStats.participants_count) : 0
      };
    }

    // Statistiques publiques supplémentaires
    const publicStats = await client.query(
      `SELECT 
        MIN(created_at) as first_donation,
        MAX(created_at) as last_donation,
        AVG(amount) as average_amount
       FROM cagnotte_donations 
       WHERE cagnotte_id = $1 AND payment_status = 'completed'`,
      [cagnotteId]
    );

    // Nombre d'actualités
    const actualitesCount = await client.query(
      'SELECT COUNT(*) as count FROM cagnotte_actualites WHERE cagnotte_id = $1 AND is_published = true',
      [cagnotteId]
    );

    client.release();

    const response = {
      cagnotte_info: {
        id: cagnotte.id,
        title: cagnotte.title,
        created_at: cagnotte.created_at
      },
      basic_stats: basicStats,
      public_stats: {
        first_donation: publicStats.rows[0]?.first_donation,
        last_donation: publicStats.rows[0]?.last_donation,
        average_donation: publicStats.rows[0]?.average_amount ? 
          Math.round(publicStats.rows[0].average_amount) : 0,
        actualites_count: parseInt(actualitesCount.rows[0].count)
      }
    };

    // Ajouter les stats détaillées si c'est le propriétaire
    if (isOwner) {
      response.detailed_stats = detailedStats;
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}
