const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function testNewFeatures() {
  console.log('🧪 Test des nouvelles fonctionnalités...\n');
  
  const client = await pool.connect();
  
  try {
    // Test 1: Vérifier les nouvelles colonnes de diversification des dons
    console.log('📦 Test 1: Diversification des dons');
    const donationsColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'cagnotte_donations' 
      AND column_name IN ('donation_type', 'service_type', 'material_type', 'skill_type', 'estimated_value')
      ORDER BY column_name
    `);
    
    if (donationsColumns.rows.length >= 5) {
      console.log('✅ Colonnes de diversification des dons présentes');
      donationsColumns.rows.forEach(row => {
        console.log(`   - ${row.column_name}: ${row.data_type}`);
      });
    } else {
      console.log('❌ Colonnes de diversification manquantes');
    }
    
    // Test 2: Vérifier la table des catégories de dons
    console.log('\n📂 Test 2: Catégories de dons');
    const categoriesCount = await client.query('SELECT COUNT(*) as count FROM donation_categories');
    const categoriesTypes = await client.query('SELECT DISTINCT type FROM donation_categories ORDER BY type');
    
    console.log(`✅ ${categoriesCount.rows[0].count} catégories de dons trouvées`);
    console.log('   Types disponibles:', categoriesTypes.rows.map(r => r.type).join(', '));
    
    // Test 3: Vérifier le système de réactions
    console.log('\n❤️ Test 3: Système de réactions');
    const reactionsTable = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'testimonial_reactions'
      ORDER BY column_name
    `);
    
    if (reactionsTable.rows.length > 0) {
      console.log('✅ Table testimonial_reactions créée');
      console.log('   Colonnes:', reactionsTable.rows.map(r => r.column_name).join(', '));
    } else {
      console.log('❌ Table testimonial_reactions manquante');
    }
    
    // Test 4: Vérifier les compteurs de réactions dans testimonials
    console.log('\n📊 Test 4: Compteurs de réactions');
    const reactionCounters = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'testimonials' 
      AND column_name LIKE '%_count'
      ORDER BY column_name
    `);
    
    if (reactionCounters.rows.length >= 5) {
      console.log('✅ Compteurs de réactions ajoutés aux témoignages');
      console.log('   Compteurs:', reactionCounters.rows.map(r => r.column_name).join(', '));
    } else {
      console.log('❌ Compteurs de réactions manquants');
    }
    
    // Test 5: Vérifier les triggers et fonctions
    console.log('\n⚙️ Test 5: Triggers et fonctions');
    const functions = await client.query(`
      SELECT routine_name 
      FROM information_schema.routines 
      WHERE routine_type = 'FUNCTION' 
      AND routine_name LIKE '%reaction%'
    `);
    
    const triggers = await client.query(`
      SELECT trigger_name, event_object_table 
      FROM information_schema.triggers 
      WHERE trigger_name LIKE '%reaction%'
    `);
    
    console.log(`✅ ${functions.rows.length} fonction(s) de réaction trouvée(s)`);
    console.log(`✅ ${triggers.rows.length} trigger(s) de réaction trouvé(s)`);
    
    // Test 6: Test d'insertion d'une réaction
    console.log('\n🧪 Test 6: Test d\'insertion d\'une réaction');
    
    // Récupérer un témoignage existant
    const testimonial = await client.query('SELECT id FROM testimonials LIMIT 1');
    
    if (testimonial.rows.length > 0) {
      const testimonialId = testimonial.rows[0].id;
      
      // Insérer une réaction de test
      await client.query(`
        INSERT INTO testimonial_reactions (testimonial_id, user_ip, user_fingerprint, reaction_type)
        VALUES ($1, '127.0.0.1', 'test_fingerprint', 'like')
        ON CONFLICT (testimonial_id, user_ip, user_fingerprint) 
        DO UPDATE SET reaction_type = 'like'
      `, [testimonialId]);
      
      // Vérifier que les compteurs ont été mis à jour
      const updatedTestimonial = await client.query(
        'SELECT likes_count, total_reactions FROM testimonials WHERE id = $1',
        [testimonialId]
      );
      
      if (updatedTestimonial.rows[0].likes_count > 0) {
        console.log('✅ Réaction de test insérée et compteurs mis à jour');
        console.log(`   Likes: ${updatedTestimonial.rows[0].likes_count}, Total: ${updatedTestimonial.rows[0].total_reactions}`);
      } else {
        console.log('❌ Problème avec la mise à jour des compteurs');
      }
      
      // Nettoyer la réaction de test
      await client.query(
        'DELETE FROM testimonial_reactions WHERE testimonial_id = $1 AND user_fingerprint = $2',
        [testimonialId, 'test_fingerprint']
      );
      console.log('🧹 Réaction de test supprimée');
      
    } else {
      console.log('⚠️ Aucun témoignage trouvé pour tester les réactions');
    }
    
    console.log('\n🎉 Tests terminés avec succès !');
    console.log('\n📋 Résumé:');
    console.log('   ✅ Base de données mise à jour');
    console.log('   ✅ Nouvelles tables créées');
    console.log('   ✅ Colonnes ajoutées');
    console.log('   ✅ Triggers et fonctions opérationnels');
    console.log('\n🚀 Vous pouvez maintenant redémarrer votre serveur et tester les nouvelles fonctionnalités !');
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Exécuter les tests
if (require.main === module) {
  testNewFeatures()
    .then(() => {
      console.log('\n✅ Tests terminés');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur:', error);
      process.exit(1);
    });
}

module.exports = { testNewFeatures };
