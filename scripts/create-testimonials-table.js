const { Pool } = require('pg');
require('dotenv').config();

// Configuration pour Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function createTestimonialsTable() {
  console.log('🚀 Création de la table testimonials sur Neon...\n');
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('📊 Création de la table testimonials...\n');
    
    // Créer la table testimonials
    await client.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age INTEGER,
        location VARCHAR(255) NOT NULL,
        story TEXT NOT NULL,
        short_description VARCHAR(500) NOT NULL,
        main_image VARCHAR(500) NOT NULL,
        before_image VARCHAR(500),
        after_image VARCHAR(500),
        video_url VARCHAR(500),
        additional_images TEXT[], -- Array de URLs d'images
        amount_raised DECIMAL(12,2) NOT NULL DEFAULT 0,
        donors_count INTEGER NOT NULL DEFAULT 0,
        category VARCHAR(100) NOT NULL,
        impact TEXT[] NOT NULL, -- Array des impacts réalisés
        is_featured BOOLEAN DEFAULT false,
        is_published BOOLEAN DEFAULT true,
        cagnotte_id UUID REFERENCES cagnottes(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    console.log('✅ Table testimonials créée');
    
    // Créer des index pour optimiser les requêtes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_testimonials_category ON testimonials(category);
      CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);
      CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(is_published);
      CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at);
    `);
    
    console.log('✅ Index créés');
    
    // Créer une fonction pour mettre à jour updated_at automatiquement
    await client.query(`
      CREATE OR REPLACE FUNCTION update_testimonials_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    await client.query(`
      DROP TRIGGER IF EXISTS trigger_update_testimonials_updated_at ON testimonials;
      CREATE TRIGGER trigger_update_testimonials_updated_at
        BEFORE UPDATE ON testimonials
        FOR EACH ROW
        EXECUTE FUNCTION update_testimonials_updated_at();
    `);
    
    console.log('✅ Trigger de mise à jour automatique créé');
    
    // Insérer des données de test avec des images libres de droit
    const testTestimonials = [
      {
        name: 'Aminata Diallo',
        age: 8,
        location: 'Dakar, Sénégal',
        story: `Aminata était née avec une malformation cardiaque qui nécessitait une intervention chirurgicale urgente. Sa famille, sans moyens financiers suffisants, s'est tournée vers AfricaGnotte pour lancer une cagnotte.

Grâce à la générosité de 127 donateurs, nous avons pu réunir les fonds nécessaires pour son opération. Aujourd'hui, Aminata court, joue et va à l'école comme tous les enfants de son âge.

"Je peux maintenant courir avec mes amis et je rêve de devenir médecin pour aider d'autres enfants comme moi", dit-elle avec un grand sourire.

L'opération s'est déroulée avec succès à l'hôpital Aristide Le Dantec de Dakar. Les médecins ont confirmé que son cœur fonctionne parfaitement maintenant.

Sa famille exprime une gratitude immense envers tous les donateurs qui ont rendu ce miracle possible. Aminata peut maintenant envisager un avenir brillant et en bonne santé.`,
        short_description: 'Opération cardiaque réussie grâce à votre solidarité',
        main_image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop',
        before_image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
        after_image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop',
        video_url: null,
        additional_images: [
          'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop'
        ],
        amount_raised: 2500000,
        donors_count: 127,
        category: 'Santé',
        impact: [
          'Opération cardiaque réussie',
          'Retour à l\'école normal',
          'Qualité de vie considérablement améliorée',
          'Famille soulagée et reconnaissante'
        ],
        is_featured: true
      },
      {
        name: 'Mamadou Keita',
        age: 45,
        location: 'Bamako, Mali',
        story: `Mamadou était un père de famille qui avait perdu son emploi et sa maison dans un incendie. Avec ses 4 enfants, il se retrouvait dans une situation très difficile.

La communauté s'est mobilisée autour de sa cagnotte pour l'aider à reconstruire sa vie. En plus des fonds collectés, plusieurs donateurs ont proposé des opportunités d'emploi.

Aujourd'hui, Mamadou a un nouveau travail stable, ses enfants sont scolarisés et la famille a pu emménager dans un nouveau logement décent.

"AfricaGnotte m'a redonné espoir. Ce n'est pas seulement l'argent, c'est toute cette solidarité qui m'a permis de me relever", témoigne-t-il avec émotion.

La reconstruction n'a pas été facile, mais avec le soutien de la communauté, Mamadou a pu surmonter cette épreuve et offrir un nouveau départ à sa famille.`,
        short_description: 'Une famille reconstruite après un incendie',
        main_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
        before_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        after_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
        video_url: null,
        additional_images: [],
        amount_raised: 1800000,
        donors_count: 89,
        category: 'Urgence',
        impact: [
          'Nouveau logement sécurisé',
          'Emploi stable retrouvé',
          'Enfants rescolarisés',
          'Dignité familiale restaurée'
        ],
        is_featured: true
      },
      {
        name: 'Fatou Sow',
        age: 23,
        location: 'Abidjan, Côte d\'Ivoire',
        story: `Fatou rêvait de devenir infirmière mais sa famille n'avait pas les moyens de financer ses études. Déterminée, elle a créé une cagnotte pour financer sa formation.

Sa détermination et son projet de formation ont touché de nombreuses personnes. Non seulement elle a atteint son objectif financier, mais plusieurs professionnels de santé l'ont également mentorée.

Aujourd'hui diplômée, Fatou travaille dans un centre de santé communautaire et aide à son tour d'autres jeunes à réaliser leurs rêves.

"Grâce à AfricaGnotte, j'ai pu réaliser mon rêve et maintenant j'aide d'autres personnes. C'est un cercle vertueux de solidarité", explique-t-elle fièrement.

Son parcours inspire maintenant d'autres jeunes femmes de sa communauté à poursuivre leurs études et leurs rêves professionnels.`,
        short_description: 'De rêve à réalité : devenir infirmière',
        main_image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=600&fit=crop',
        before_image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop',
        after_image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=600&fit=crop',
        video_url: null,
        additional_images: [],
        amount_raised: 950000,
        donors_count: 156,
        category: 'Éducation',
        impact: [
          'Diplôme d\'infirmière obtenu',
          'Emploi dans le secteur de la santé',
          'Mentorat d\'autres jeunes',
          'Contribution au système de santé'
        ],
        is_featured: true
      },
      {
        name: 'Khadija Ouattara',
        age: 35,
        location: 'Ouagadougou, Burkina Faso',
        story: `Khadija était une mère célibataire de trois enfants qui avait perdu son petit commerce à cause de la pandémie. Sans revenus, elle ne pouvait plus nourrir sa famille ni payer le loyer.

Sa situation désespérée l'a poussée à créer une cagnotte sur AfricaGnotte. La réponse de la communauté a été immédiate et touchante. En plus des dons, plusieurs personnes lui ont proposé des opportunités d'emploi et des formations.

Aujourd'hui, Khadija a relancé son commerce avec un capital plus important et emploie même deux autres femmes de son quartier. Elle est devenue un exemple d'entrepreneuriat féminin dans sa communauté.

"AfricaGnotte ne m'a pas seulement aidée financièrement, mais m'a redonné confiance en moi et en l'avenir", témoigne-t-elle avec fierté.`,
        short_description: 'De la précarité à l\'entrepreneuriat réussi',
        main_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop',
        before_image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&h=600&fit=crop',
        after_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop',
        video_url: null,
        additional_images: [],
        amount_raised: 750000,
        donors_count: 67,
        category: 'Entrepreneuriat',
        impact: [
          'Commerce relancé avec succès',
          'Création d\'emplois pour 2 femmes',
          'Autonomie financière retrouvée',
          'Modèle d\'inspiration communautaire'
        ],
        is_featured: false
      },
      {
        name: 'Ibrahim Traoré',
        age: 19,
        location: 'Conakry, Guinée',
        story: `Ibrahim était un jeune orphelin très doué en informatique mais sans moyens pour poursuivre ses études. Il rêvait de devenir développeur web pour sortir de la pauvreté.

Sa détermination et son projet de formation en développement web ont touché de nombreux donateurs. Plusieurs développeurs professionnels se sont même proposés pour le mentorer gratuitement.

Après 18 mois de formation intensive, Ibrahim travaille maintenant comme développeur freelance et gagne suffisamment pour subvenir à ses besoins et aider d'autres jeunes de son orphelinat.

"La technologie m'a ouvert les portes du monde entier. Maintenant, je peux travailler pour des clients partout en Afrique et même en Europe", explique-t-il avec enthousiasme.`,
        short_description: 'De l\'orphelinat au succès numérique',
        main_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
        before_image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop',
        after_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
        video_url: null,
        additional_images: [],
        amount_raised: 650000,
        donors_count: 94,
        category: 'Éducation',
        impact: [
          'Formation en développement web complétée',
          'Emploi stable en freelance',
          'Mentorat d\'autres jeunes',
          'Indépendance financière'
        ],
        is_featured: false
      }
    ];
    
    // Insérer les témoignages de test
    for (const testimonial of testTestimonials) {
      await client.query(`
        INSERT INTO testimonials (
          name, age, location, story, short_description, main_image, 
          before_image, after_image, video_url, additional_images,
          amount_raised, donors_count, category, impact, is_featured
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `, [
        testimonial.name,
        testimonial.age,
        testimonial.location,
        testimonial.story,
        testimonial.short_description,
        testimonial.main_image,
        testimonial.before_image,
        testimonial.after_image,
        testimonial.video_url,
        testimonial.additional_images,
        testimonial.amount_raised,
        testimonial.donors_count,
        testimonial.category,
        testimonial.impact,
        testimonial.is_featured
      ]);
    }
    
    console.log(`✅ ${testTestimonials.length} témoignages de test ajoutés`);
    
    await client.query('COMMIT');
    
    // Vérifier les données créées
    const testimonialsCount = await client.query('SELECT COUNT(*) FROM testimonials');
    console.log(`\n📊 Total de témoignages: ${testimonialsCount.rows[0].count}`);
    
    const featuredCount = await client.query('SELECT COUNT(*) FROM testimonials WHERE is_featured = true');
    console.log(`⭐ Témoignages en vedette: ${featuredCount.rows[0].count}`);
    
    console.log('\n🎉 Table testimonials créée avec succès !');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erreur lors de la création:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

createTestimonialsTable();
