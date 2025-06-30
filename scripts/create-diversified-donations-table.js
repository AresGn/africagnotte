const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function createDiversifiedDonationsTable() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('🎯 Extension de la table cagnotte_donations pour la diversification des dons...\n');
    
    // Ajouter les nouvelles colonnes pour la diversification des dons
    await client.query(`
      ALTER TABLE cagnotte_donations 
      ADD COLUMN IF NOT EXISTS donation_type VARCHAR(20) DEFAULT 'monetary',
      ADD COLUMN IF NOT EXISTS service_type VARCHAR(100),
      ADD COLUMN IF NOT EXISTS service_description TEXT,
      ADD COLUMN IF NOT EXISTS service_duration INTEGER,
      ADD COLUMN IF NOT EXISTS service_availability TEXT,
      ADD COLUMN IF NOT EXISTS material_type VARCHAR(100),
      ADD COLUMN IF NOT EXISTS material_description TEXT,
      ADD COLUMN IF NOT EXISTS material_quantity INTEGER,
      ADD COLUMN IF NOT EXISTS material_condition VARCHAR(50),
      ADD COLUMN IF NOT EXISTS skill_type VARCHAR(100),
      ADD COLUMN IF NOT EXISTS skill_description TEXT,
      ADD COLUMN IF NOT EXISTS skill_level VARCHAR(50),
      ADD COLUMN IF NOT EXISTS skill_availability TEXT,
      ADD COLUMN IF NOT EXISTS estimated_value DECIMAL(10,2),
      ADD COLUMN IF NOT EXISTS contact_info JSONB,
      ADD COLUMN IF NOT EXISTS delivery_method VARCHAR(50),
      ADD COLUMN IF NOT EXISTS location_constraint TEXT
    `);
    
    console.log('✅ Colonnes de diversification ajoutées à cagnotte_donations');
    
    // Créer des index pour optimiser les requêtes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_donations_type ON cagnotte_donations(donation_type);
      CREATE INDEX IF NOT EXISTS idx_donations_service_type ON cagnotte_donations(service_type);
      CREATE INDEX IF NOT EXISTS idx_donations_material_type ON cagnotte_donations(material_type);
      CREATE INDEX IF NOT EXISTS idx_donations_skill_type ON cagnotte_donations(skill_type);
    `);
    
    console.log('✅ Index créés pour la diversification des dons');
    
    // Créer une table pour les catégories de dons diversifiés
    await client.query(`
      CREATE TABLE IF NOT EXISTS donation_categories (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        type VARCHAR(20) NOT NULL, -- 'service', 'material', 'skill'
        name VARCHAR(100) NOT NULL,
        description TEXT,
        icon VARCHAR(50),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    console.log('✅ Table donation_categories créée');
    
    // Insérer les catégories par défaut
    const defaultCategories = [
      // Services
      { type: 'service', name: 'Transport', description: 'Services de transport et livraison', icon: '🚗' },
      { type: 'service', name: 'Cuisine', description: 'Préparation de repas et restauration', icon: '👨‍🍳' },
      { type: 'service', name: 'Nettoyage', description: 'Services de nettoyage et entretien', icon: '🧹' },
      { type: 'service', name: 'Garde d\'enfants', description: 'Services de garde et accompagnement', icon: '👶' },
      { type: 'service', name: 'Soins médicaux', description: 'Consultations et soins de santé', icon: '⚕️' },
      
      // Biens matériels
      { type: 'material', name: 'Équipement médical', description: 'Matériel médical et de santé', icon: '🏥' },
      { type: 'material', name: 'Mobilier', description: 'Tables, chaises, lits, etc.', icon: '🪑' },
      { type: 'material', name: 'Électroménager', description: 'Appareils électroménagers', icon: '🔌' },
      { type: 'material', name: 'Vêtements', description: 'Vêtements et textiles', icon: '👕' },
      { type: 'material', name: 'Fournitures scolaires', description: 'Matériel éducatif et scolaire', icon: '📚' },
      { type: 'material', name: 'Nourriture', description: 'Denrées alimentaires et provisions', icon: '🍎' },
      
      // Compétences
      { type: 'skill', name: 'Enseignement', description: 'Formation et éducation', icon: '👨‍🏫' },
      { type: 'skill', name: 'Informatique', description: 'Support technique et développement', icon: '💻' },
      { type: 'skill', name: 'Comptabilité', description: 'Gestion financière et comptable', icon: '📊' },
      { type: 'skill', name: 'Marketing', description: 'Communication et promotion', icon: '📢' },
      { type: 'skill', name: 'Artisanat', description: 'Travaux manuels et créatifs', icon: '🔨' },
      { type: 'skill', name: 'Conseil juridique', description: 'Assistance juridique et administrative', icon: '⚖️' }
    ];
    
    for (const category of defaultCategories) {
      await client.query(`
        INSERT INTO donation_categories (type, name, description, icon)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
      `, [category.type, category.name, category.description, category.icon]);
    }
    
    console.log('✅ Catégories par défaut insérées');
    
    await client.query('COMMIT');
    console.log('\n🎉 Extension de la base de données pour la diversification des dons terminée avec succès !');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erreur lors de l\'extension de la base de données:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Exécuter le script
if (require.main === module) {
  createDiversifiedDonationsTable()
    .then(() => {
      console.log('✅ Script terminé avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur:', error);
      process.exit(1);
    });
}

module.exports = { createDiversifiedDonationsTable };
