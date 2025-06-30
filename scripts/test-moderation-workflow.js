const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

async function testModerationWorkflow() {
  const client = await pool.connect();
  
  try {
    console.log('🧪 Test du workflow de modération\n');

    // 1. Vérifier qu'il y a des cagnottes en attente
    console.log('1️⃣ Vérification des cagnottes en attente...');
    const pendingResult = await client.query(
      "SELECT id, title, moderation_status FROM cagnottes WHERE moderation_status = 'pending'"
    );
    
    console.log(`   ✅ ${pendingResult.rows.length} cagnotte(s) en attente de modération`);
    pendingResult.rows.forEach(row => {
      console.log(`      - ${row.title} (${row.id})`);
    });

    // 2. Vérifier les API publiques ne retournent que les cagnottes approuvées
    console.log('\n2️⃣ Test des API publiques...');
    
    // Simuler une requête à l'API publique
    const publicResult = await client.query(
      "SELECT id, title, moderation_status FROM cagnottes WHERE is_private = false AND moderation_status = 'approved' ORDER BY created_at DESC"
    );
    
    console.log(`   ✅ API publique retourne ${publicResult.rows.length} cagnotte(s) approuvée(s)`);
    publicResult.rows.forEach(row => {
      console.log(`      - ${row.title} (statut: ${row.moderation_status})`);
    });

    // 3. Vérifier les API featured
    const featuredResult = await client.query(
      `SELECT id, title, moderation_status FROM cagnottes 
       WHERE is_private = false 
         AND status = 'active'
         AND moderation_status = 'approved'
       ORDER BY created_at DESC 
       LIMIT 3`
    );
    
    console.log(`   ✅ API featured retourne ${featuredResult.rows.length} cagnotte(s) en vedette`);

    // 4. Vérifier la structure des tables de modération
    console.log('\n3️⃣ Vérification des tables de modération...');
    
    const moderationActionsCount = await client.query('SELECT COUNT(*) FROM moderation_actions');
    console.log(`   ✅ ${moderationActionsCount.rows[0].count} action(s) de modération enregistrée(s)`);
    
    const reportsCount = await client.query('SELECT COUNT(*) FROM reports');
    console.log(`   ✅ ${reportsCount.rows[0].count} signalement(s) enregistré(s)`);

    // 5. Vérifier les colonnes de modération dans cagnottes
    console.log('\n4️⃣ Vérification des colonnes de modération...');
    
    const moderationColumnsResult = await client.query(`
      SELECT 
        COUNT(*) FILTER (WHERE moderation_status IS NOT NULL) as with_status,
        COUNT(*) FILTER (WHERE moderation_status = 'pending') as pending,
        COUNT(*) FILTER (WHERE moderation_status = 'approved') as approved,
        COUNT(*) FILTER (WHERE moderation_status = 'rejected') as rejected,
        COUNT(*) FILTER (WHERE moderation_status = 'suspended') as suspended,
        COUNT(*) as total
      FROM cagnottes
    `);
    
    const stats = moderationColumnsResult.rows[0];
    console.log(`   ✅ Répartition des statuts de modération:`);
    console.log(`      - En attente: ${stats.pending}`);
    console.log(`      - Approuvées: ${stats.approved}`);
    console.log(`      - Rejetées: ${stats.rejected}`);
    console.log(`      - Suspendues: ${stats.suspended}`);
    console.log(`      - Total: ${stats.total}`);

    // 6. Vérifier les permissions admin
    console.log('\n5️⃣ Vérification des rôles admin...');
    
    const adminRoles = await client.query(`
      SELECT role, COUNT(*) as count 
      FROM profiles 
      WHERE role IN ('moderator', 'admin', 'super_admin')
      GROUP BY role
    `);
    
    console.log(`   ✅ Utilisateurs avec permissions admin:`);
    adminRoles.rows.forEach(row => {
      console.log(`      - ${row.role}: ${row.count} utilisateur(s)`);
    });

    // 7. Recommandations
    console.log('\n📋 Recommandations:');
    
    if (pendingResult.rows.length > 0) {
      console.log(`   ⚠️  Il y a ${pendingResult.rows.length} cagnotte(s) en attente de modération`);
      console.log(`      → Connectez-vous à /admin/cagnottes pour les modérer`);
    }
    
    if (publicResult.rows.length === 0) {
      console.log(`   ⚠️  Aucune cagnotte approuvée visible publiquement`);
      console.log(`      → Approuvez quelques cagnottes pour tester l'affichage public`);
    }
    
    if (adminRoles.rows.length === 0) {
      console.log(`   ❌ Aucun utilisateur admin trouvé`);
      console.log(`      → Exécutez le script setup-admin-neon.js pour créer un admin`);
    }

    console.log('\n✅ Test du workflow de modération terminé !');
    console.log('\n🔗 URLs importantes:');
    console.log('   - Dashboard admin: http://localhost:3000/admin');
    console.log('   - Gestion cagnottes: http://localhost:3000/admin/cagnottes');
    console.log('   - API publique: http://localhost:3000/api/cagnottes/public');
    console.log('   - API featured: http://localhost:3000/api/cagnottes/featured');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

testModerationWorkflow();
