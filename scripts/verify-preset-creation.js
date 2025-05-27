const https = require('https');

// Configuration
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dql2osqaj';
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'africagnotte_media';

console.log('🔍 Vérification de la création du preset Cloudinary...\n');

function checkPreset() {
  return new Promise((resolve, reject) => {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload/preset/${uploadPreset}`;
    
    console.log('🌐 Test de l\'URL:', url);
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ SUCCÈS: Le preset existe et est accessible!');
          console.log('');
          
          try {
            const presetData = JSON.parse(data);
            console.log('📋 Configuration du preset:');
            console.log('   Nom:', presetData.name);
            console.log('   Mode:', presetData.unsigned ? 'Unsigned ✅' : 'Signed ❌');
            console.log('   Resource type:', presetData.resource_type || 'auto');
            console.log('   Formats autorisés:', presetData.allowed_formats || 'tous');
            console.log('   Taille max:', presetData.max_file_size ? `${Math.round(presetData.max_file_size / 1024 / 1024)}MB` : 'non définie');
            
            if (presetData.folder) {
              console.log('   Dossier:', presetData.folder);
            }
            
            console.log('');
            
            if (presetData.unsigned) {
              console.log('🎉 Configuration parfaite! Votre application peut maintenant uploader des fichiers.');
              console.log('');
              console.log('📝 Prochaines étapes:');
              console.log('1. Testez l\'upload sur http://localhost:3000/test-cloudinary');
              console.log('2. Testez dans votre application de création de cagnotte');
              console.log('3. Supprimez les logs de debug du composant MediaUpload');
            } else {
              console.log('⚠️  ATTENTION: Le preset est en mode "Signed".');
              console.log('   Changez-le en mode "Unsigned" pour permettre les uploads frontend.');
            }
            
          } catch (e) {
            console.log('✅ Preset accessible, mais impossible de parser la réponse.');
            console.log('Réponse brute:', data.substring(0, 200) + '...');
          }
          
          resolve(true);
          
        } else if (res.statusCode === 404) {
          console.log('❌ ÉCHEC: Le preset n\'existe toujours pas.');
          console.log('');
          console.log('🔧 Actions à effectuer:');
          console.log('1. Connectez-vous à https://cloudinary.com/users/login');
          console.log('2. Allez dans Settings → Upload');
          console.log('3. Créez un preset nommé "africagnotte_media"');
          console.log('4. Assurez-vous qu\'il est en mode "Unsigned"');
          console.log('5. Relancez ce script pour vérifier');
          
          resolve(false);
          
        } else {
          console.log(`❌ Erreur inattendue: Status ${res.statusCode}`);
          console.log('Réponse:', data.substring(0, 200));
          resolve(false);
        }
      });
      
    }).on('error', (error) => {
      console.log('❌ Erreur de connexion:', error.message);
      reject(error);
    });
  });
}

// Test en boucle avec retry
async function testWithRetry(maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const success = await checkPreset();
      
      if (success) {
        return true;
      }
      
      if (i < maxRetries - 1) {
        console.log(`\n⏳ Nouvelle tentative dans 5 secondes... (${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      
    } catch (error) {
      console.log('Erreur lors du test:', error.message);
      
      if (i < maxRetries - 1) {
        console.log(`\n⏳ Nouvelle tentative dans 5 secondes... (${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
  
  console.log('\n❌ Échec après toutes les tentatives.');
  console.log('Consultez le guide de dépannage: docs/cloudinary-troubleshooting.md');
  return false;
}

// Exécution
testWithRetry().then(success => {
  if (success) {
    console.log('\n🚀 Votre configuration Cloudinary est maintenant opérationnelle!');
  }
}).catch(console.error);
