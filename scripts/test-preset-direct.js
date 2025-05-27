const https = require('https');

const cloudName = 'dql2osqaj';
const presetName = 'africagnotte_media';

console.log('🔍 Test direct de l\'API Cloudinary...');
console.log(`Cloud Name: ${cloudName}`);
console.log(`Preset Name: ${presetName}`);
console.log('');

// Test 1: Vérifier si le preset existe via l'API publique
const testUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload/preset/${presetName}`;
console.log(`🌐 Test URL: ${testUrl}`);

const options = {
  hostname: 'api.cloudinary.com',
  port: 443,
  path: `/v1_1/${cloudName}/upload/preset/${presetName}`,
  method: 'GET',
  headers: {
    'User-Agent': 'AfriCagnotte-Test/1.0'
  }
};

const req = https.request(options, (res) => {
  console.log(`📊 Status Code: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📄 Response Body:', data);
    
    if (res.statusCode === 200) {
      console.log('✅ SUCCESS: Le preset existe et est accessible !');
    } else if (res.statusCode === 404) {
      console.log('❌ ERREUR: Le preset n\'existe pas ou n\'est pas en mode "Unsigned"');
      console.log('');
      console.log('🔧 Actions à effectuer:');
      console.log('1. Connectez-vous à https://cloudinary.com/users/login');
      console.log('2. Allez dans Settings → Upload');
      console.log('3. Vérifiez que le preset "africagnotte_media" existe');
      console.log('4. Assurez-vous qu\'il est en mode "Unsigned"');
      console.log('5. Sauvegardez le preset');
    } else {
      console.log(`⚠️  RÉPONSE INATTENDUE: ${res.statusCode}`);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ ERREUR DE REQUÊTE:', error);
});

req.end();

// Test 2: Essayer un upload de test (simulation)
console.log('');
console.log('🧪 Test d\'upload simulé...');

const FormData = require('form-data');
const form = new FormData();

// Créer un petit fichier de test en base64
const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

form.append('file', testImageBase64);
form.append('upload_preset', presetName);

const uploadOptions = {
  hostname: 'api.cloudinary.com',
  port: 443,
  path: `/v1_1/${cloudName}/upload`,
  method: 'POST',
  headers: form.getHeaders()
};

setTimeout(() => {
  console.log('🚀 Tentative d\'upload de test...');
  
  const uploadReq = https.request(uploadOptions, (res) => {
    console.log(`📊 Upload Status Code: ${res.statusCode}`);
    
    let uploadData = '';
    res.on('data', (chunk) => {
      uploadData += chunk;
    });
    
    res.on('end', () => {
      console.log('📄 Upload Response:', uploadData);
      
      if (res.statusCode === 200) {
        console.log('✅ SUCCESS: Upload de test réussi !');
      } else {
        console.log('❌ ERREUR: Upload de test échoué');
        try {
          const errorData = JSON.parse(uploadData);
          console.log('📋 Détails de l\'erreur:', errorData);
        } catch (e) {
          console.log('📋 Réponse brute:', uploadData);
        }
      }
    });
  });
  
  uploadReq.on('error', (error) => {
    console.error('❌ ERREUR D\'UPLOAD:', error);
  });
  
  form.pipe(uploadReq);
}, 2000);
