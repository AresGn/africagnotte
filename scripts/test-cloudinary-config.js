const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('🔍 Test de configuration Cloudinary pour AfriCagnotte\n');

// Fonction pour lire les variables d'environnement depuis les fichiers
function loadEnvVars() {
  const envFiles = ['.env.local', '.env'];
  const envVars = {};
  
  envFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      content.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value && key.startsWith('NEXT_PUBLIC_CLOUDINARY')) {
          envVars[key.trim()] = value.trim();
        }
      });
    }
  });
  
  return envVars;
}

// Charger les variables
const envVars = loadEnvVars();
const cloudName = envVars.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = envVars.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const uploadPreset = envVars.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

console.log('📋 Configuration détectée:');
console.log('Cloud Name:', cloudName || '❌ MANQUANT');
console.log('API Key:', apiKey || '❌ MANQUANT');
console.log('Upload Preset:', uploadPreset || '❌ MANQUANT');
console.log('');

// Vérifications
const checks = [];

// 1. Vérifier que toutes les variables sont présentes
if (!cloudName || !apiKey || !uploadPreset) {
  checks.push({
    test: 'Variables d\'environnement',
    status: 'ÉCHEC',
    message: 'Variables manquantes. Vérifiez vos fichiers .env'
  });
} else {
  checks.push({
    test: 'Variables d\'environnement',
    status: 'OK',
    message: 'Toutes les variables sont présentes'
  });
}

// 2. Vérifier que le cloud name est valide
if (cloudName) {
  const cloudNameRegex = /^[a-zA-Z0-9_-]+$/;
  if (cloudNameRegex.test(cloudName)) {
    checks.push({
      test: 'Format Cloud Name',
      status: 'OK',
      message: 'Format valide'
    });
  } else {
    checks.push({
      test: 'Format Cloud Name',
      status: 'ÉCHEC',
      message: 'Format invalide'
    });
  }
}

// 3. Tester la connectivité à Cloudinary
function testCloudinaryConnection() {
  return new Promise((resolve) => {
    if (!cloudName) {
      resolve({
        test: 'Connectivité Cloudinary',
        status: 'ÉCHEC',
        message: 'Cloud name manquant'
      });
      return;
    }

    const url = `https://res.cloudinary.com/${cloudName}/image/upload/sample.jpg`;
    
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        resolve({
          test: 'Connectivité Cloudinary',
          status: 'OK',
          message: 'Connexion réussie'
        });
      } else {
        resolve({
          test: 'Connectivité Cloudinary',
          status: 'ÉCHEC',
          message: `Code de statut: ${res.statusCode}`
        });
      }
    }).on('error', () => {
      resolve({
        test: 'Connectivité Cloudinary',
        status: 'ÉCHEC',
        message: 'Erreur de connexion'
      });
    });
  });
}

// 4. Tester l'existence du preset
function testPresetExistence() {
  return new Promise((resolve) => {
    if (!cloudName || !uploadPreset) {
      resolve({
        test: 'Existence du preset',
        status: 'ÉCHEC',
        message: 'Configuration manquante'
      });
      return;
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload/preset/${uploadPreset}`;
    
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        resolve({
          test: 'Existence du preset',
          status: 'OK',
          message: 'Preset trouvé et accessible'
        });
      } else if (res.statusCode === 404) {
        resolve({
          test: 'Existence du preset',
          status: 'ÉCHEC',
          message: 'Preset non trouvé - doit être créé'
        });
      } else {
        resolve({
          test: 'Existence du preset',
          status: 'ÉCHEC',
          message: `Code de statut: ${res.statusCode}`
        });
      }
    }).on('error', () => {
      resolve({
        test: 'Existence du preset',
        status: 'ÉCHEC',
        message: 'Erreur de connexion'
      });
    });
  });
}

// Exécuter tous les tests
async function runAllTests() {
  console.log('🧪 Exécution des tests...\n');
  
  // Tests de connectivité
  const connectivityTest = await testCloudinaryConnection();
  checks.push(connectivityTest);
  
  const presetTest = await testPresetExistence();
  checks.push(presetTest);
  
  // Afficher les résultats
  console.log('📊 Résultats des tests:\n');
  checks.forEach(check => {
    const icon = check.status === 'OK' ? '✅' : '❌';
    console.log(`${icon} ${check.test}: ${check.status}`);
    console.log(`   ${check.message}\n`);
  });
  
  // Résumé
  const passed = checks.filter(c => c.status === 'OK').length;
  const total = checks.length;
  
  console.log(`📈 Résumé: ${passed}/${total} tests réussis\n`);
  
  if (passed === total) {
    console.log('🎉 Configuration Cloudinary OK! Vous pouvez utiliser l\'upload.');
  } else {
    console.log('⚠️  Configuration incomplète. Consultez le guide de dépannage:');
    console.log('   docs/cloudinary-troubleshooting.md');
  }
}

runAllTests().catch(console.error);
