const { createDiversifiedDonationsTable } = require('./create-diversified-donations-table');
const { createTestimonialReactionsTable } = require('./create-testimonial-reactions-table');

async function runAllMigrations() {
  console.log('🚀 Démarrage de toutes les migrations...\n');
  
  try {
    // Migration 1: Diversification des dons
    console.log('📦 Migration 1: Diversification des dons');
    await createDiversifiedDonationsTable();
    console.log('✅ Migration 1 terminée\n');
    
    // Migration 2: Système de réactions pour les témoignages
    console.log('❤️ Migration 2: Système de réactions pour les témoignages');
    await createTestimonialReactionsTable();
    console.log('✅ Migration 2 terminée\n');
    
    console.log('🎉 Toutes les migrations ont été exécutées avec succès !');
    console.log('\n📋 Résumé des nouvelles fonctionnalités ajoutées:');
    console.log('   • Diversification des dons (services, biens matériels, compétences)');
    console.log('   • Nouvelles catégories de cagnottes (Éducation, Entrepreneuriat, etc.)');
    console.log('   • Système de réactions pour les témoignages (likes, cœurs, etc.)');
    console.log('   • Support vidéo amélioré pour les témoignages');
    console.log('\n🔧 Prochaines étapes:');
    console.log('   1. Redémarrer votre serveur de développement');
    console.log('   2. Tester les nouvelles fonctionnalités');
    console.log('   3. Ajouter des images pour les nouvelles catégories dans /public/images/');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution des migrations:', error);
    process.exit(1);
  }
}

// Exécuter toutes les migrations
if (require.main === module) {
  runAllMigrations()
    .then(() => {
      console.log('✅ Script terminé avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur:', error);
      process.exit(1);
    });
}

module.exports = { runAllMigrations };
