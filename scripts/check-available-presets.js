// Script pour vérifier quels presets sont disponibles
const https = require('https');

const cloudName = 'dql2osqaj';
const presetsToTest = [
  'africagnotte_media',
  'africagnotte', 
  'ml_default',
  'default',
  'unsigned_default'
];

console.log('🔍 Vérification des presets Cloudinary disponibles...');
console.log(`Cloud Name: ${cloudName}`);
console.log('');

async function testPreset(presetName) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.cloudinary.com',
      port: 443,
      path: `/v1_1/${cloudName}/upload`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    };

    const postData = `file=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==&upload_preset=${presetName}`;

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ ${presetName}: DISPONIBLE`);
          try {
            const result = JSON.parse(data);
            console.log(`   📁 URL: ${result.secure_url}`);
          } catch (e) {
            console.log(`   📄 Réponse: ${data.substring(0, 100)}...`);
          }
        } else {
          console.log(`❌ ${presetName}: NON DISPONIBLE (${res.statusCode})`);
          try {
            const error = JSON.parse(data);
            console.log(`   📋 Erreur: ${error.error?.message || 'Erreur inconnue'}`);
          } catch (e) {
            console.log(`   📋 Réponse: ${data.substring(0, 100)}...`);
          }
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${presetName}: ERREUR DE CONNEXION`);
      console.log(`   📋 ${error.message}`);
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

async function testAllPresets() {
  for (const preset of presetsToTest) {
    await testPreset(preset);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Attendre 1 seconde entre les tests
  }
  
  console.log('');
  console.log('🎯 Recommandations:');
  console.log('1. Utilisez un preset marqué comme "DISPONIBLE"');
  console.log('2. Si aucun preset custom n\'est disponible, utilisez "ml_default"');
  console.log('3. Vérifiez que vos presets custom sont en mode "Unsigned"');
}

testAllPresets();
