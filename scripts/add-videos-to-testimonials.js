const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function addVideosToTestimonials() {
  console.log('🎥 Ajout de vidéos Pexels à plusieurs témoignages...\n');
  
  const client = await pool.connect();
  
  try {
    // Vidéos Pexels gratuites et libres de droits
    const videos = [
      {
        url: 'https://videos.pexels.com/video-files/31940807/12736893_1920_1080_30fps.mp4',
        description: 'Conduite nocturne sous la pluie avec lumières de la ville'
      },
      {
        url: 'https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4',
        description: 'Femme africaine souriante'
      },
      {
        url: 'https://videos.pexels.com/video-files/6893969/6893969-uhd_2560_1440_30fps.mp4',
        description: 'Enfants africains jouant'
      },
      {
        url: 'https://videos.pexels.com/video-files/4098878/4098878-uhd_2560_1440_30fps.mp4',
        description: 'Communauté africaine'
      },
      {
        url: 'https://videos.pexels.com/video-files/5745203/5745203-uhd_2560_1440_30fps.mp4',
        description: 'Famille africaine heureuse'
      }
    ];
    
    // Récupérer les témoignages existants
    const testimonialsResult = await client.query(
      'SELECT id, name FROM testimonials WHERE is_published = true ORDER BY created_at DESC LIMIT 5'
    );
    
    if (testimonialsResult.rows.length === 0) {
      console.log('❌ Aucun témoignage trouvé');
      return;
    }
    
    console.log(`📋 ${testimonialsResult.rows.length} témoignages trouvés:`);
    testimonialsResult.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.name} (${row.id})`);
    });
    
    console.log('\n🎬 Attribution des vidéos...');
    
    // Attribuer une vidéo à chaque témoignage
    for (let i = 0; i < testimonialsResult.rows.length && i < videos.length; i++) {
      const testimonial = testimonialsResult.rows[i];
      const video = videos[i];
      
      try {
        await client.query(
          'UPDATE testimonials SET video_url = $1, updated_at = NOW() WHERE id = $2',
          [video.url, testimonial.id]
        );
        
        console.log(`✅ ${testimonial.name}: ${video.description}`);
        console.log(`   URL: ${video.url}`);
        
      } catch (error) {
        console.log(`❌ Erreur pour ${testimonial.name}:`, error.message);
      }
    }
    
    // Vérification finale
    console.log('\n🔍 Vérification finale...');
    const verificationResult = await client.query(
      'SELECT id, name, video_url FROM testimonials WHERE video_url IS NOT NULL ORDER BY updated_at DESC'
    );
    
    console.log(`✅ ${verificationResult.rows.length} témoignages avec vidéo:`);
    verificationResult.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.name}`);
      console.log(`      ID: ${row.id}`);
      console.log(`      Vidéo: ${row.video_url.substring(0, 60)}...`);
    });
    
    console.log('\n🎉 Vidéos ajoutées avec succès !');
    console.log('\n🔧 Prochaines étapes:');
    console.log('   1. Redémarrer votre serveur Next.js');
    console.log('   2. Vider le cache du navigateur (Ctrl+F5)');
    console.log('   3. Aller sur http://localhost:3000/temoignages');
    console.log('   4. Vérifier que les boutons de lecture vidéo apparaissent');
    console.log('   5. Tester la lecture des vidéos');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Exécuter le script
if (require.main === module) {
  addVideosToTestimonials()
    .then(() => {
      console.log('\n✅ Script terminé');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur:', error);
      process.exit(1);
    });
}

module.exports = { addVideosToTestimonials };
