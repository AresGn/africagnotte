const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testCountryPaymentSystem() {
  console.log('🧪 Test du système de paiement spécifique aux pays...\n');
  
  try {
    const client = await pool.connect();
    
    // 1. Vérifier que les colonnes de numéros de dépôt existent
    console.log('1️⃣ Vérification de la structure de la base de données...');
    
    const columnsResult = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'cagnottes' 
        AND column_name LIKE 'numero_%'
      ORDER BY column_name
    `);
    
    if (columnsResult.rows.length === 6) {
      console.log('✅ Toutes les colonnes de numéros de dépôt sont présentes:');
      columnsResult.rows.forEach(row => {
        console.log(`   • ${row.column_name}: ${row.data_type}`);
      });
    } else {
      console.log('❌ Colonnes manquantes dans la table cagnottes');
      return;
    }
    
    // 2. Vérifier qu'il y a des utilisateurs avec des pays
    console.log('\n2️⃣ Vérification des utilisateurs avec pays...');
    
    const usersResult = await client.query(`
      SELECT country, COUNT(*) as count
      FROM profiles 
      WHERE country IS NOT NULL
      GROUP BY country
      ORDER BY count DESC
    `);
    
    if (usersResult.rows.length > 0) {
      console.log('✅ Utilisateurs par pays:');
      usersResult.rows.forEach(row => {
        console.log(`   • ${row.country}: ${row.count} utilisateur(s)`);
      });
    } else {
      console.log('⚠️  Aucun utilisateur avec pays défini');
    }
    
    // 3. Créer une cagnotte de test avec numéros de dépôt
    console.log('\n3️⃣ Test de création de cagnotte avec numéros de dépôt...');
    
    // Récupérer un utilisateur existant
    const userResult = await client.query(`
      SELECT id, username, country FROM profiles LIMIT 1
    `);
    
    if (userResult.rows.length === 0) {
      console.log('❌ Aucun utilisateur trouvé pour le test');
      return;
    }
    
    const testUser = userResult.rows[0];
    console.log(`📝 Utilisateur de test: ${testUser.username} (${testUser.country || 'Pays non défini'})`);
    
    // Créer une cagnotte de test
    const testCagnotteData = {
      user_id: testUser.id,
      title: 'Test Cagnotte - Système de Paiement',
      category: 'Test',
      description: 'Cagnotte de test pour vérifier le système de paiement par pays',
      images: JSON.stringify(['https://example.com/test-image.jpg']),
      numero_moov: '97123456',
      numero_mtn: '67123456',
      numero_orange: '07123456',
      numero_wave: '77123456',
      numero_airtel: '78123456',
      numero_autres: '90123456',
      status: 'active',
      moderation_status: 'approved'
    };
    
    const insertResult = await client.query(`
      INSERT INTO cagnottes (
        user_id, title, category, description, images,
        numero_moov, numero_mtn, numero_orange, numero_wave, numero_airtel, numero_autres,
        status, moderation_status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
      RETURNING id, title
    `, [
      testCagnotteData.user_id,
      testCagnotteData.title,
      testCagnotteData.category,
      testCagnotteData.description,
      testCagnotteData.images,
      testCagnotteData.numero_moov,
      testCagnotteData.numero_mtn,
      testCagnotteData.numero_orange,
      testCagnotteData.numero_wave,
      testCagnotteData.numero_airtel,
      testCagnotteData.numero_autres,
      testCagnotteData.status,
      testCagnotteData.moderation_status
    ]);
    
    const testCagnotte = insertResult.rows[0];
    console.log(`✅ Cagnotte de test créée: ${testCagnotte.title} (ID: ${testCagnotte.id})`);
    
    // 4. Vérifier la récupération des données
    console.log('\n4️⃣ Test de récupération des numéros de dépôt...');
    
    const retrieveResult = await client.query(`
      SELECT numero_moov, numero_mtn, numero_orange, numero_wave, numero_airtel, numero_autres
      FROM cagnottes 
      WHERE id = $1
    `, [testCagnotte.id]);
    
    if (retrieveResult.rows.length > 0) {
      const numbers = retrieveResult.rows[0];
      console.log('✅ Numéros de dépôt récupérés:');
      Object.entries(numbers).forEach(([key, value]) => {
        if (value) {
          console.log(`   • ${key}: ${value}`);
        }
      });
    }
    
    // 5. Test de mise à jour
    console.log('\n5️⃣ Test de mise à jour des numéros de dépôt...');
    
    const updateResult = await client.query(`
      UPDATE cagnottes 
      SET numero_moov = $1, numero_mtn = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING numero_moov, numero_mtn
    `, ['97654321', '67654321', testCagnotte.id]);
    
    if (updateResult.rows.length > 0) {
      console.log('✅ Mise à jour réussie:');
      console.log(`   • Nouveau Moov: ${updateResult.rows[0].numero_moov}`);
      console.log(`   • Nouveau MTN: ${updateResult.rows[0].numero_mtn}`);
    }
    
    // 6. Nettoyage - Supprimer la cagnotte de test
    console.log('\n6️⃣ Nettoyage...');
    
    await client.query('DELETE FROM cagnottes WHERE id = $1', [testCagnotte.id]);
    console.log('✅ Cagnotte de test supprimée');
    
    client.release();
    
    console.log('\n🎉 Tous les tests sont passés avec succès !');
    console.log('\n📋 Résumé:');
    console.log('   ✅ Structure de base de données correcte');
    console.log('   ✅ Création de cagnotte avec numéros de dépôt');
    console.log('   ✅ Récupération des numéros de dépôt');
    console.log('   ✅ Mise à jour des numéros de dépôt');
    console.log('   ✅ Nettoyage effectué');
    
    console.log('\n🚀 Le système est prêt pour les tests utilisateur !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Exécuter le test si le script est appelé directement
if (require.main === module) {
  testCountryPaymentSystem()
    .then(() => {
      console.log('\n✅ Test terminé avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Échec du test:', error);
      process.exit(1);
    });
}

module.exports = { testCountryPaymentSystem };
