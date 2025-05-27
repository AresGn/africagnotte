const https = require('https');
const querystring = require('querystring');

// Configuration Cloudinary
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dql2osqaj';
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '953753544822435';
const apiSecret = process.env.CLOUDINARY_API_SECRET; // Vous devez ajouter cette variable

console.log('🔧 Création du preset Cloudinary...');
console.log('Cloud Name:', cloudName);
console.log('API Key:', apiKey);

if (!apiSecret) {
  console.log('❌ ERREUR: CLOUDINARY_API_SECRET manquant!');
  console.log('');
  console.log('Pour créer automatiquement le preset, vous devez:');
  console.log('1. Aller sur votre tableau de bord Cloudinary');
  console.log('2. Aller dans Settings → Security');
  console.log('3. Copier votre API Secret');
  console.log('4. Ajouter CLOUDINARY_API_SECRET=votre_secret dans votre fichier .env.local');
  console.log('');
  console.log('Ou créez le preset manuellement en suivant les instructions sur la page de test.');
  process.exit(1);
}

// Configuration du preset
const presetConfig = {
  name: 'africagnotte_media',
  unsigned: true,
  resource_type: 'auto',
  allowed_formats: 'jpg,png,gif,mp4,mov,webp',
  max_file_size: 10485760, // 10MB
  quality: 'auto',
  format: 'auto',
  folder: 'africagnotte', // Organiser les uploads dans un dossier
  use_filename: true,
  unique_filename: true,
  overwrite: false,
  tags: 'africagnotte,user_upload'
};

const postData = querystring.stringify(presetConfig);

const options = {
  hostname: 'api.cloudinary.com',
  port: 443,
  path: `/v1_1/${cloudName}/upload_presets`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData),
    'Authorization': `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`
  }
};

console.log('📤 Envoi de la requête de création...');

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('✅ Preset créé avec succès!');
      try {
        const result = JSON.parse(data);
        console.log('Configuration du preset:', JSON.stringify(result, null, 2));
        console.log('');
        console.log('🎉 Le preset "africagnotte_media" est maintenant disponible!');
        console.log('Vous pouvez maintenant tester l\'upload sur votre application.');
      } catch (e) {
        console.log('Réponse brute:', data);
      }
    } else {
      console.log('❌ Erreur lors de la création du preset');
      console.log('Réponse:', data);
      
      if (res.statusCode === 400) {
        console.log('');
        console.log('💡 Le preset existe peut-être déjà. Vérifiez votre tableau de bord Cloudinary.');
      }
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Erreur lors de la création:', error.message);
});

req.setTimeout(10000, () => {
  console.log('❌ Timeout lors de la création');
  req.destroy();
});

req.write(postData);
req.end();
