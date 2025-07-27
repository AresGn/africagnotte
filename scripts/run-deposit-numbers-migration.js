const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runDepositNumbersMigration() {
  console.log('🚀 Démarrage de la migration des numéros de dépôt...\n');
  
  try {
    const client = await pool.connect();
    
    console.log('📋 Ajout des colonnes de numéros de dépôt...');
    
    // Ajouter les colonnes pour les numéros de dépôt des différents opérateurs
    await client.query(`
      ALTER TABLE cagnottes 
      ADD COLUMN IF NOT EXISTS numero_moov VARCHAR(20),
      ADD COLUMN IF NOT EXISTS numero_mtn VARCHAR(20),
      ADD COLUMN IF NOT EXISTS numero_orange VARCHAR(20),
      ADD COLUMN IF NOT EXISTS numero_wave VARCHAR(20),
      ADD COLUMN IF NOT EXISTS numero_airtel VARCHAR(20),
      ADD COLUMN IF NOT EXISTS numero_autres VARCHAR(20)
    `);
    
    console.log('✅ Colonnes ajoutées avec succès');
    
    // Ajouter des commentaires pour documenter les colonnes
    console.log('📝 Ajout des commentaires...');
    
    await client.query(`
      COMMENT ON COLUMN cagnottes.numero_moov IS 'Numéro de téléphone Moov Money pour recevoir les dons';
      COMMENT ON COLUMN cagnottes.numero_mtn IS 'Numéro de téléphone MTN Mobile Money pour recevoir les dons';
      COMMENT ON COLUMN cagnottes.numero_orange IS 'Numéro de téléphone Orange Money pour recevoir les dons';
      COMMENT ON COLUMN cagnottes.numero_wave IS 'Numéro de téléphone Wave pour recevoir les dons';
      COMMENT ON COLUMN cagnottes.numero_airtel IS 'Numéro de téléphone Airtel Money pour recevoir les dons';
      COMMENT ON COLUMN cagnottes.numero_autres IS 'Numéro de téléphone pour autres opérateurs mobiles'
    `);
    
    console.log('✅ Commentaires ajoutés');
    
    // Ajouter des index pour améliorer les performances de recherche
    console.log('🔍 Création des index...');
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_cagnottes_numero_moov ON cagnottes(numero_moov) WHERE numero_moov IS NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_cagnottes_numero_mtn ON cagnottes(numero_mtn) WHERE numero_mtn IS NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_cagnottes_numero_orange ON cagnottes(numero_orange) WHERE numero_orange IS NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_cagnottes_numero_wave ON cagnottes(numero_wave) WHERE numero_wave IS NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_cagnottes_numero_airtel ON cagnottes(numero_airtel) WHERE numero_airtel IS NOT NULL
    `);
    
    console.log('✅ Index créés');
    
    // Vérifier que les colonnes ont été ajoutées
    console.log('🔍 Vérification des colonnes ajoutées...');
    
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'cagnottes' 
        AND column_name LIKE 'numero_%'
      ORDER BY column_name
    `);
    
    console.log('\n📊 Colonnes de numéros de dépôt:');
    result.rows.forEach(row => {
      console.log(`   • ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    client.release();
    
    console.log('\n🎉 Migration des numéros de dépôt terminée avec succès !');
    console.log('\n📋 Prochaines étapes:');
    console.log('   1. Mettre à jour l\'API de modification des cagnottes');
    console.log('   2. Ajouter les champs dans le formulaire de modification');
    console.log('   3. Implémenter la logique spécifique aux pays');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Exécuter la migration si le script est appelé directement
if (require.main === module) {
  runDepositNumbersMigration()
    .then(() => {
      console.log('\n✅ Script terminé avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Échec du script:', error);
      process.exit(1);
    });
}

module.exports = { runDepositNumbersMigration };
