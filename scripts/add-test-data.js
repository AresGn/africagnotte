const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function addTestData() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('🎭 Ajout de données de test pour le dashboard admin...\n');
    
    // 1. Mettre à jour les statuts de modération des cagnottes existantes
    console.log('📝 Mise à jour des statuts de modération des cagnottes...');
    
    const cagnottes = await client.query('SELECT id FROM cagnottes ORDER BY created_at');
    
    if (cagnottes.rows.length > 0) {
      // Approuver la plupart des cagnottes
      for (let i = 0; i < cagnottes.rows.length; i++) {
        const cagnotteId = cagnottes.rows[i].id;
        let status, moderatedBy = null;
        
        if (i === 0) {
          status = 'pending'; // 1 en attente
        } else if (i === 1) {
          status = 'pending'; // 2 en attente
        } else if (i === cagnottes.rows.length - 1) {
          status = 'rejected'; // 1 rejetée
          moderatedBy = (await client.query("SELECT id FROM profiles WHERE role = 'super_admin' LIMIT 1")).rows[0]?.id;
        } else {
          status = 'approved'; // Les autres approuvées
          moderatedBy = (await client.query("SELECT id FROM profiles WHERE role = 'super_admin' LIMIT 1")).rows[0]?.id;
        }
        
        if (moderatedBy) {
          await client.query(`
            UPDATE cagnottes
            SET moderation_status = $1::moderation_status,
                moderated_by = $2::uuid,
                moderated_at = NOW()
            WHERE id = $3
          `, [status, moderatedBy, cagnotteId]);
        } else {
          await client.query(`
            UPDATE cagnottes
            SET moderation_status = $1::moderation_status
            WHERE id = $2
          `, [status, cagnotteId]);
        }
      }
      
      console.log(`   ✅ ${cagnottes.rows.length} cagnottes mises à jour`);
    }
    
    // 2. Ajouter des signalements de test
    console.log('\n🚨 Ajout de signalements de test...');
    
    const reporterUser = await client.query("SELECT id FROM profiles WHERE role = 'user' LIMIT 1");
    const reportedCagnotte = await client.query("SELECT id FROM cagnottes LIMIT 1");
    
    if (reporterUser.rows.length > 0 && reportedCagnotte.rows.length > 0) {
      const testReports = [
        {
          cagnotte_id: reportedCagnotte.rows[0].id,
          reporter_id: reporterUser.rows[0].id,
          reason: 'inappropriate',
          description: 'Contenu inapproprié dans la description de la cagnotte',
          status: 'pending'
        },
        {
          cagnotte_id: reportedCagnotte.rows[0].id,
          reporter_id: reporterUser.rows[0].id,
          reason: 'fraud',
          description: 'Suspicion de fraude - informations douteuses',
          status: 'pending'
        },
        {
          cagnotte_id: reportedCagnotte.rows[0].id,
          reporter_id: reporterUser.rows[0].id,
          reason: 'spam',
          description: 'Cagnotte créée uniquement pour du spam',
          status: 'reviewed'
        }
      ];
      
      for (const report of testReports) {
        await client.query(`
          INSERT INTO reports (cagnotte_id, reporter_id, reason, description, status, created_at)
          VALUES ($1, $2, $3, $4, $5, NOW() - INTERVAL '${Math.floor(Math.random() * 7)} days')
        `, [report.cagnotte_id, report.reporter_id, report.reason, report.description, report.status]);
      }
      
      console.log(`   ✅ ${testReports.length} signalements ajoutés`);
    }
    
    // 3. Ajouter des actions de modération
    console.log('\n⚖️ Ajout d\'actions de modération...');
    
    const moderator = await client.query("SELECT id FROM profiles WHERE role = 'super_admin' LIMIT 1");
    const approvedCagnottes = await client.query("SELECT id FROM cagnottes WHERE moderation_status = 'approved' LIMIT 2");
    
    if (moderator.rows.length > 0 && approvedCagnottes.rows.length > 0) {
      const testActions = [
        {
          cagnotte_id: approvedCagnottes.rows[0].id,
          moderator_id: moderator.rows[0].id,
          action: 'approve',
          reason: 'Cagnotte conforme aux conditions d\'utilisation',
          notes: 'Vérification effectuée - tout est en ordre'
        }
      ];
      
      if (approvedCagnottes.rows.length > 1) {
        testActions.push({
          cagnotte_id: approvedCagnottes.rows[1].id,
          moderator_id: moderator.rows[0].id,
          action: 'approve',
          reason: 'Objectif légitime et documentation fournie',
          notes: 'Approuvé après vérification des documents'
        });
      }
      
      for (const action of testActions) {
        await client.query(`
          INSERT INTO moderation_actions (cagnotte_id, moderator_id, action, reason, notes, created_at)
          VALUES ($1, $2, $3, $4, $5, NOW() - INTERVAL '${Math.floor(Math.random() * 5)} days')
        `, [action.cagnotte_id, action.moderator_id, action.action, action.reason, action.notes]);
      }
      
      console.log(`   ✅ ${testActions.length} actions de modération ajoutées`);
    }
    
    await client.query('COMMIT');
    
    // 4. Vérifier les statistiques finales
    console.log('\n📊 Statistiques finales:');
    
    const finalStats = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM cagnottes) as total_cagnottes,
        (SELECT COUNT(*) FROM cagnottes WHERE moderation_status = 'pending') as pending_cagnottes,
        (SELECT COUNT(*) FROM cagnottes WHERE moderation_status = 'approved') as approved_cagnottes,
        (SELECT COUNT(*) FROM cagnottes WHERE moderation_status = 'rejected') as rejected_cagnottes,
        (SELECT COUNT(*) FROM profiles) as total_users,
        (SELECT COUNT(*) FROM reports WHERE status = 'pending') as pending_reports,
        (SELECT COUNT(*) FROM reports) as total_reports,
        (SELECT COUNT(*) FROM moderation_actions) as total_actions
    `);
    
    const stats = finalStats.rows[0];
    console.log(`   📝 Total cagnottes: ${stats.total_cagnottes}`);
    console.log(`   ⏳ En attente: ${stats.pending_cagnottes}`);
    console.log(`   ✅ Approuvées: ${stats.approved_cagnottes}`);
    console.log(`   ❌ Rejetées: ${stats.rejected_cagnottes}`);
    console.log(`   👥 Utilisateurs: ${stats.total_users}`);
    console.log(`   🚨 Signalements en attente: ${stats.pending_reports}`);
    console.log(`   📋 Total signalements: ${stats.total_reports}`);
    console.log(`   ⚖️ Actions de modération: ${stats.total_actions}`);
    
    console.log('\n🎉 Données de test ajoutées avec succès !');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erreur lors de l\'ajout des données de test:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addTestData();
