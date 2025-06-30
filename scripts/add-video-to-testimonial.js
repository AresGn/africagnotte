const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function addVideoToTestimonial() {
  console.log('🎥 Ajout de la vidéo Pexels au témoignage...\n');
  
  const client = await pool.connect();
  
  try {
    const testimonialId = 'e225fc75-53ea-4f48-8834-e98563f35b3e';
    const videoUrl = 'https://videos.pexels.com/video-files/31940807/12736893_1920_1080_30fps.mp4';
    
    // Vérifier si le témoignage existe
    const checkResult = await client.query(
      'SELECT id, name FROM testimonials WHERE id = $1',
      [testimonialId]
    );
    
    if (checkResult.rows.length === 0) {
      console.log('❌ Témoignage non trouvé avec cet ID');
      console.log('📋 Témoignages disponibles:');
      
      const allTestimonials = await client.query(
        'SELECT id, name FROM testimonials ORDER BY created_at DESC LIMIT 10'
      );
      
      allTestimonials.rows.forEach(row => {
        console.log(`   - ${row.name}: ${row.id}`);
      });
      
      return;
    }
    
    const testimonial = checkResult.rows[0];
    console.log(`✅ Témoignage trouvé: ${testimonial.name}`);
    
    // Mettre à jour avec la vidéo
    const updateResult = await client.query(
      'UPDATE testimonials SET video_url = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [videoUrl, testimonialId]
    );
    
    if (updateResult.rows.length > 0) {
      console.log('✅ Vidéo ajoutée avec succès !');
      console.log(`   URL: ${videoUrl}`);
      console.log(`   Témoignage: ${testimonial.name}`);
      console.log(`   ID: ${testimonialId}`);
      
      // Vérifier que la vidéo est bien enregistrée
      const verifyResult = await client.query(
        'SELECT video_url FROM testimonials WHERE id = $1',
        [testimonialId]
      );
      
      if (verifyResult.rows[0].video_url) {
        console.log('✅ Vérification: Vidéo bien enregistrée en base');
      } else {
        console.log('❌ Erreur: Vidéo non enregistrée');
      }
    } else {
      console.log('❌ Erreur lors de la mise à jour');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Exécuter le script
if (require.main === module) {
  addVideoToTestimonial()
    .then(() => {
      console.log('\n✅ Script terminé');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur:', error);
      process.exit(1);
    });
}

module.exports = { addVideoToTestimonial };
