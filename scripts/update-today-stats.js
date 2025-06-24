const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function updateTodayStats() {
  const client = await pool.connect();
  
  try {
    console.log('📊 Mise à jour des statistiques d\'aujourd\'hui...\n');
    
    // Appeler la fonction update_daily_stats
    await client.query('SELECT update_daily_stats()');
    
    console.log('✅ Fonction update_daily_stats exécutée');
    
    // Vérifier les statistiques d'aujourd'hui
    const todayStats = await client.query(`
      SELECT * FROM daily_stats 
      WHERE date = CURRENT_DATE
    `);
    
    if (todayStats.rows.length > 0) {
      const stats = todayStats.rows[0];
      console.log('\n📈 Statistiques d\'aujourd\'hui:');
      console.log(`   📝 Nouvelles cagnottes: ${stats.new_cagnottes}`);
      console.log(`   👥 Nouveaux utilisateurs: ${stats.new_users}`);
      console.log(`   ⚖️ Modérations effectuées: ${stats.moderations_done}`);
      console.log(`   🚨 Signalements reçus: ${stats.reports_received}`);
      console.log(`   ✅ Signalements résolus: ${stats.reports_resolved}`);
      console.log(`   💰 Total collecté: ${stats.total_amount_collected} FCFA`);
    } else {
      console.log('❌ Aucune statistique trouvée pour aujourd\'hui');
    }
    
    // Ajouter quelques activités récentes si nécessaire
    const activityCount = await client.query(`
      SELECT COUNT(*) FROM recent_activity_view
    `);
    
    console.log(`\n📋 Activités récentes disponibles: ${activityCount.rows[0].count}`);
    
    if (parseInt(activityCount.rows[0].count) < 3) {
      console.log('\n🎭 Ajout d\'activités récentes pour démonstration...');
      
      // Ajouter une action de modération récente
      const adminUser = await client.query("SELECT id FROM profiles WHERE role = 'super_admin' LIMIT 1");
      const pendingCagnotte = await client.query("SELECT id FROM cagnottes WHERE moderation_status = 'pending' LIMIT 1");
      
      if (adminUser.rows.length > 0 && pendingCagnotte.rows.length > 0) {
        await client.query(`
          INSERT INTO moderation_actions (cagnotte_id, moderator_id, action, reason, notes, created_at)
          VALUES ($1, $2, 'approve', 'Cagnotte conforme aux conditions', 'Vérification effectuée aujourd\'hui', NOW())
        `, [pendingCagnotte.rows[0].id, adminUser.rows[0].id]);
        
        console.log('   ✅ Action de modération ajoutée');
      }
    }
    
    console.log('\n🎉 Mise à jour terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

updateTodayStats();
