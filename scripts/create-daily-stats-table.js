const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function createDailyStatsTable() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('📊 Création de la table daily_stats...\n');
    
    // Créer la table daily_stats
    await client.query(`
      CREATE TABLE IF NOT EXISTS daily_stats (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        date DATE NOT NULL UNIQUE,
        new_cagnottes INTEGER DEFAULT 0,
        new_users INTEGER DEFAULT 0,
        moderations_done INTEGER DEFAULT 0,
        reports_received INTEGER DEFAULT 0,
        reports_resolved INTEGER DEFAULT 0,
        total_amount_collected DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    console.log('✅ Table daily_stats créée');
    
    // Créer un index sur la date
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(date)
    `);
    
    console.log('✅ Index sur date créé');
    
    // Ajouter quelques données historiques de test
    console.log('\n📈 Ajout de données historiques de test...');
    
    const testData = [];
    const today = new Date();
    
    // Générer 30 jours de données
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dateStr = date.toISOString().split('T')[0];
      
      testData.push({
        date: dateStr,
        new_cagnottes: Math.floor(Math.random() * 5) + 1, // 1-5 nouvelles cagnottes
        new_users: Math.floor(Math.random() * 10) + 2, // 2-11 nouveaux utilisateurs
        moderations_done: Math.floor(Math.random() * 8), // 0-7 modérations
        reports_received: Math.floor(Math.random() * 3), // 0-2 signalements
        reports_resolved: Math.floor(Math.random() * 2), // 0-1 signalement résolu
        total_amount_collected: (Math.random() * 50000 + 10000).toFixed(2) // 10k-60k FCFA
      });
    }
    
    // Insérer les données de test
    for (const data of testData) {
      await client.query(`
        INSERT INTO daily_stats (date, new_cagnottes, new_users, moderations_done, reports_received, reports_resolved, total_amount_collected)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (date) DO NOTHING
      `, [
        data.date,
        data.new_cagnottes,
        data.new_users,
        data.moderations_done,
        data.reports_received,
        data.reports_resolved,
        data.total_amount_collected
      ]);
    }
    
    console.log(`✅ ${testData.length} jours de données historiques ajoutés`);
    
    // Créer une fonction pour mettre à jour les stats quotidiennes
    await client.query(`
      CREATE OR REPLACE FUNCTION update_daily_stats()
      RETURNS void AS $$
      DECLARE
        today_date DATE := CURRENT_DATE;
        stats_record RECORD;
      BEGIN
        -- Calculer les statistiques du jour
        SELECT 
          COALESCE(COUNT(*) FILTER (WHERE DATE(created_at) = today_date), 0) as new_cagnottes,
          COALESCE((SELECT COUNT(*) FROM profiles WHERE DATE(created_at) = today_date), 0) as new_users,
          COALESCE((SELECT COUNT(*) FROM moderation_actions WHERE DATE(created_at) = today_date), 0) as moderations_done,
          COALESCE((SELECT COUNT(*) FROM reports WHERE DATE(created_at) = today_date), 0) as reports_received,
          COALESCE((SELECT COUNT(*) FROM reports WHERE DATE(reviewed_at) = today_date), 0) as reports_resolved,
          COALESCE((SELECT SUM(current_amount) FROM cagnottes WHERE DATE(updated_at) = today_date), 0) as total_collected
        INTO stats_record
        FROM cagnottes;
        
        -- Insérer ou mettre à jour les statistiques
        INSERT INTO daily_stats (date, new_cagnottes, new_users, moderations_done, reports_received, reports_resolved, total_amount_collected, updated_at)
        VALUES (today_date, stats_record.new_cagnottes, stats_record.new_users, stats_record.moderations_done, 
                stats_record.reports_received, stats_record.reports_resolved, stats_record.total_collected, NOW())
        ON CONFLICT (date) 
        DO UPDATE SET 
          new_cagnottes = EXCLUDED.new_cagnottes,
          new_users = EXCLUDED.new_users,
          moderations_done = EXCLUDED.moderations_done,
          reports_received = EXCLUDED.reports_received,
          reports_resolved = EXCLUDED.reports_resolved,
          total_amount_collected = EXCLUDED.total_amount_collected,
          updated_at = NOW();
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    console.log('✅ Fonction update_daily_stats créée');
    
    // Créer une vue pour les statistiques récentes
    await client.query(`
      CREATE OR REPLACE VIEW recent_activity_view AS
      SELECT 
        'cagnotte_created' as activity_type,
        'Nouvelle cagnotte créée' as activity_description,
        c.title as details,
        c.created_at,
        COALESCE(p.first_name || ' ' || p.last_name, p.username) as user_name
      FROM cagnottes c
      LEFT JOIN profiles p ON c.user_id = p.id
      WHERE c.created_at >= NOW() - INTERVAL '7 days'
      
      UNION ALL
      
      SELECT 
        'moderation_action' as activity_type,
        'Action de modération' as activity_description,
        ma.action || ': ' || COALESCE(ma.reason, 'Aucune raison') as details,
        ma.created_at,
        COALESCE(p.first_name || ' ' || p.last_name, p.username) as user_name
      FROM moderation_actions ma
      LEFT JOIN profiles p ON ma.moderator_id = p.id
      WHERE ma.created_at >= NOW() - INTERVAL '7 days'
      
      UNION ALL
      
      SELECT 
        'report_created' as activity_type,
        'Nouveau signalement' as activity_description,
        r.reason || ': ' || LEFT(r.description, 50) as details,
        r.created_at,
        COALESCE(p.first_name || ' ' || p.last_name, p.username) as user_name
      FROM reports r
      LEFT JOIN profiles p ON r.reporter_id = p.id
      WHERE r.created_at >= NOW() - INTERVAL '7 days'
      
      ORDER BY created_at DESC
      LIMIT 20
    `);
    
    console.log('✅ Vue recent_activity_view créée');
    
    await client.query('COMMIT');
    
    // Vérifier les données créées
    const statsCount = await client.query('SELECT COUNT(*) FROM daily_stats');
    console.log(`\n📊 Total d'entrées dans daily_stats: ${statsCount.rows[0].count}`);
    
    const recentActivity = await client.query('SELECT COUNT(*) FROM recent_activity_view');
    console.log(`📋 Activités récentes disponibles: ${recentActivity.rows[0].count}`);
    
    console.log('\n🎉 Table daily_stats et vues créées avec succès !');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erreur lors de la création:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

createDailyStatsTable();
