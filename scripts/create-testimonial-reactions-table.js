const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function createTestimonialReactionsTable() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('❤️ Création du système de réactions pour les témoignages...\n');
    
    // Créer la table des réactions
    await client.query(`
      CREATE TABLE IF NOT EXISTS testimonial_reactions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        testimonial_id UUID NOT NULL REFERENCES testimonials(id) ON DELETE CASCADE,
        user_ip VARCHAR(45), -- Pour les utilisateurs anonymes
        user_fingerprint VARCHAR(255), -- Empreinte du navigateur
        reaction_type VARCHAR(20) NOT NULL CHECK (reaction_type IN ('like', 'heart', 'support', 'inspire')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        
        -- Contrainte pour éviter les doublons (un utilisateur ne peut réagir qu'une fois par témoignage)
        UNIQUE(testimonial_id, user_ip, user_fingerprint)
      )
    `);
    
    console.log('✅ Table testimonial_reactions créée');
    
    // Créer des index pour optimiser les requêtes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_testimonial_reactions_testimonial_id ON testimonial_reactions(testimonial_id);
      CREATE INDEX IF NOT EXISTS idx_testimonial_reactions_type ON testimonial_reactions(reaction_type);
      CREATE INDEX IF NOT EXISTS idx_testimonial_reactions_created_at ON testimonial_reactions(created_at);
    `);
    
    console.log('✅ Index créés pour les réactions');
    
    // Ajouter des colonnes de compteurs aux témoignages pour optimiser les performances
    await client.query(`
      ALTER TABLE testimonials 
      ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS hearts_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS support_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS inspire_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_reactions INTEGER DEFAULT 0
    `);
    
    console.log('✅ Colonnes de compteurs ajoutées aux témoignages');
    
    // Créer une fonction pour mettre à jour les compteurs automatiquement
    await client.query(`
      CREATE OR REPLACE FUNCTION update_testimonial_reaction_counts()
      RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'INSERT' THEN
          -- Incrémenter le compteur approprié
          UPDATE testimonials 
          SET 
            likes_count = likes_count + CASE WHEN NEW.reaction_type = 'like' THEN 1 ELSE 0 END,
            hearts_count = hearts_count + CASE WHEN NEW.reaction_type = 'heart' THEN 1 ELSE 0 END,
            support_count = support_count + CASE WHEN NEW.reaction_type = 'support' THEN 1 ELSE 0 END,
            inspire_count = inspire_count + CASE WHEN NEW.reaction_type = 'inspire' THEN 1 ELSE 0 END,
            total_reactions = total_reactions + 1,
            updated_at = NOW()
          WHERE id = NEW.testimonial_id;
          RETURN NEW;
        ELSIF TG_OP = 'DELETE' THEN
          -- Décrémenter le compteur approprié
          UPDATE testimonials 
          SET 
            likes_count = likes_count - CASE WHEN OLD.reaction_type = 'like' THEN 1 ELSE 0 END,
            hearts_count = hearts_count - CASE WHEN OLD.reaction_type = 'heart' THEN 1 ELSE 0 END,
            support_count = support_count - CASE WHEN OLD.reaction_type = 'support' THEN 1 ELSE 0 END,
            inspire_count = inspire_count - CASE WHEN OLD.reaction_type = 'inspire' THEN 1 ELSE 0 END,
            total_reactions = total_reactions - 1,
            updated_at = NOW()
          WHERE id = OLD.testimonial_id;
          RETURN OLD;
        ELSIF TG_OP = 'UPDATE' THEN
          -- Mettre à jour si le type de réaction change
          IF OLD.reaction_type != NEW.reaction_type THEN
            UPDATE testimonials 
            SET 
              likes_count = likes_count 
                - CASE WHEN OLD.reaction_type = 'like' THEN 1 ELSE 0 END
                + CASE WHEN NEW.reaction_type = 'like' THEN 1 ELSE 0 END,
              hearts_count = hearts_count 
                - CASE WHEN OLD.reaction_type = 'heart' THEN 1 ELSE 0 END
                + CASE WHEN NEW.reaction_type = 'heart' THEN 1 ELSE 0 END,
              support_count = support_count 
                - CASE WHEN OLD.reaction_type = 'support' THEN 1 ELSE 0 END
                + CASE WHEN NEW.reaction_type = 'support' THEN 1 ELSE 0 END,
              inspire_count = inspire_count 
                - CASE WHEN OLD.reaction_type = 'inspire' THEN 1 ELSE 0 END
                + CASE WHEN NEW.reaction_type = 'inspire' THEN 1 ELSE 0 END,
              updated_at = NOW()
            WHERE id = NEW.testimonial_id;
          END IF;
          RETURN NEW;
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    console.log('✅ Fonction de mise à jour des compteurs créée');
    
    // Créer les triggers
    await client.query(`
      DROP TRIGGER IF EXISTS trigger_update_testimonial_reaction_counts ON testimonial_reactions;
      CREATE TRIGGER trigger_update_testimonial_reaction_counts
        AFTER INSERT OR UPDATE OR DELETE ON testimonial_reactions
        FOR EACH ROW
        EXECUTE FUNCTION update_testimonial_reaction_counts();
    `);
    
    console.log('✅ Triggers créés');
    
    // Créer une fonction pour mettre à jour updated_at automatiquement
    await client.query(`
      CREATE OR REPLACE FUNCTION update_testimonial_reactions_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    await client.query(`
      DROP TRIGGER IF EXISTS trigger_update_testimonial_reactions_updated_at ON testimonial_reactions;
      CREATE TRIGGER trigger_update_testimonial_reactions_updated_at
        BEFORE UPDATE ON testimonial_reactions
        FOR EACH ROW
        EXECUTE FUNCTION update_testimonial_reactions_updated_at();
    `);
    
    console.log('✅ Trigger updated_at créé');
    
    // Initialiser les compteurs pour les témoignages existants
    await client.query(`
      UPDATE testimonials 
      SET 
        likes_count = COALESCE((
          SELECT COUNT(*) FROM testimonial_reactions 
          WHERE testimonial_id = testimonials.id AND reaction_type = 'like'
        ), 0),
        hearts_count = COALESCE((
          SELECT COUNT(*) FROM testimonial_reactions 
          WHERE testimonial_id = testimonials.id AND reaction_type = 'heart'
        ), 0),
        support_count = COALESCE((
          SELECT COUNT(*) FROM testimonial_reactions 
          WHERE testimonial_id = testimonials.id AND reaction_type = 'support'
        ), 0),
        inspire_count = COALESCE((
          SELECT COUNT(*) FROM testimonial_reactions 
          WHERE testimonial_id = testimonials.id AND reaction_type = 'inspire'
        ), 0),
        total_reactions = COALESCE((
          SELECT COUNT(*) FROM testimonial_reactions 
          WHERE testimonial_id = testimonials.id
        ), 0)
    `);
    
    console.log('✅ Compteurs initialisés pour les témoignages existants');
    
    await client.query('COMMIT');
    console.log('\n🎉 Système de réactions pour les témoignages créé avec succès !');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erreur lors de la création du système de réactions:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Exécuter le script
if (require.main === module) {
  createTestimonialReactionsTable()
    .then(() => {
      console.log('✅ Script terminé avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur:', error);
      process.exit(1);
    });
}

module.exports = { createTestimonialReactionsTable };
