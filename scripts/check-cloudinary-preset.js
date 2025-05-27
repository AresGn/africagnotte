const https = require('https');

// Configuration Cloudinary depuis les variables d'environnement
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dql2osqaj';
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'africagnotte_media';

console.log('Vérification du preset Cloudinary...');
console.log('Cloud Name:', cloudName);
console.log('Upload Preset:', uploadPreset);

// URL pour vérifier les presets (API publique)
const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload/preset/${uploadPreset}`;

console.log('URL de vérification:', url);

// Faire une requête GET pour vérifier si le preset existe
const req = https.get(url, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', res.headers);
    
    if (res.statusCode === 200) {
      console.log('✅ Le preset existe et est accessible');
      try {
        const presetData = JSON.parse(data);
        console.log('Configuration du preset:', JSON.stringify(presetData, null, 2));
      } catch (e) {
        console.log('Réponse brute:', data);
      }
    } else if (res.statusCode === 404) {
      console.log('❌ Le preset n\'existe pas ou n\'est pas accessible');
      console.log('Réponse:', data);
    } else {
      console.log('⚠️  Statut inattendu:', res.statusCode);
      console.log('Réponse:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Erreur lors de la vérification:', error.message);
});

req.setTimeout(10000, () => {
  console.log('❌ Timeout lors de la vérification');
  req.destroy();
});
