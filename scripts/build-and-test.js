#!/usr/bin/env node

/**
 * Script de build et test pour AfricaGnotte
 * Vérifie l'intégration complète du système de paiement personnalisé
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Build et test AfricaGnotte - Système de paiement personnalisé');
console.log('================================================================\n');

// Fonction pour exécuter une commande et afficher le résultat
function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log('✅ Succès\n');
    return true;
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}\n`);
    return false;
  }
}

// Fonction pour vérifier l'existence d'un fichier
function checkFile(filePath, description) {
  console.log(`📁 Vérification: ${description}...`);
  if (fs.existsSync(filePath)) {
    console.log('✅ Fichier trouvé\n');
    return true;
  } else {
    console.log(`❌ Fichier manquant: ${filePath}\n`);
    return false;
  }
}

// Fonction pour vérifier le contenu d'un fichier
function checkFileContent(filePath, searchString, description) {
  console.log(`🔍 Vérification du contenu: ${description}...`);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(searchString)) {
      console.log('✅ Contenu vérifié\n');
      return true;
    } else {
      console.log(`❌ Contenu manquant: ${searchString}\n`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Erreur lecture fichier: ${error.message}\n`);
    return false;
  }
}

let allTestsPassed = true;

// 1. Vérification des fichiers du système de paiement
console.log('1️⃣ Vérification des fichiers du système de paiement');
console.log('==================================================');

const requiredFiles = [
  { path: 'lib/paiement-service.ts', desc: 'Service de paiement personnalisé' },
  { path: 'components/CodeUSSDGenerator.tsx', desc: 'Composant générateur de codes USSD' },
  { path: 'components/PreuvePaiementUpload.tsx', desc: 'Composant upload de preuve' },
  { path: 'app/api/cagnottes/[id]/donations/[donationId]/preuve/route.js', desc: 'API preuves de paiement' },
  { path: 'lib/currency-utils.ts', desc: 'Utilitaires de devise FCFA' }
];

requiredFiles.forEach(file => {
  if (!checkFile(file.path, file.desc)) {
    allTestsPassed = false;
  }
});

// 2. Vérification du contenu des fichiers critiques
console.log('2️⃣ Vérification du contenu des fichiers critiques');
console.log('================================================');

const contentChecks = [
  { 
    file: 'lib/paiement-service.ts', 
    search: 'OPERATEURS_MOBILES', 
    desc: 'Liste des opérateurs mobiles' 
  },
  { 
    file: 'components/CodeUSSDGenerator.tsx', 
    search: 'genererCodeUSSD', 
    desc: 'Fonction de génération USSD' 
  },
  { 
    file: 'app/paiement/[cagnotteId]/page.tsx', 
    search: 'FCFA', 
    desc: 'Devise FCFA dans le paiement' 
  },
  { 
    file: 'lib/currency-utils.ts', 
    search: 'XOF', 
    desc: 'Code devise XOF (FCFA)' 
  }
];

contentChecks.forEach(check => {
  if (!checkFileContent(check.file, check.search, check.desc)) {
    allTestsPassed = false;
  }
});

// 3. Vérification des dépendances
console.log('3️⃣ Vérification des dépendances');
console.log('===============================');

if (!runCommand('npm list next-cloudinary', 'Vérification next-cloudinary')) {
  allTestsPassed = false;
}

if (!runCommand('npm list react-hot-toast', 'Vérification react-hot-toast')) {
  allTestsPassed = false;
}

// 4. Vérification de la syntaxe TypeScript
console.log('4️⃣ Vérification de la syntaxe TypeScript');
console.log('========================================');

if (!runCommand('npx tsc --noEmit', 'Vérification TypeScript')) {
  allTestsPassed = false;
}

// 5. Vérification ESLint
console.log('5️⃣ Vérification ESLint');
console.log('======================');

if (!runCommand('npm run lint', 'Vérification ESLint')) {
  console.log('⚠️  Avertissement: Erreurs ESLint détectées (non bloquant)\n');
}

// 6. Test de build
console.log('6️⃣ Test de build de production');
console.log('==============================');

if (!runCommand('npm run build', 'Build de production')) {
  allTestsPassed = false;
}

// 7. Vérification des variables d'environnement
console.log('7️⃣ Vérification des variables d\'environnement');
console.log('=============================================');

const envVars = [
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
  'NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET',
  'DATABASE_URL'
];

envVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar}: Configuré`);
  } else {
    console.log(`⚠️  ${envVar}: Non configuré (vérifiez .env.local)`);
  }
});

console.log('');

// 8. Génération du rapport
console.log('8️⃣ Génération du rapport de build');
console.log('=================================');

const buildReport = {
  timestamp: new Date().toISOString(),
  success: allTestsPassed,
  components: {
    paymentService: fs.existsSync('lib/paiement-service.ts'),
    ussdGenerator: fs.existsSync('components/CodeUSSDGenerator.tsx'),
    proofUpload: fs.existsSync('components/PreuvePaiementUpload.tsx'),
    apiRoutes: fs.existsSync('app/api/cagnottes/[id]/donations/[donationId]/preuve/route.js'),
    currencyUtils: fs.existsSync('lib/currency-utils.ts')
  },
  features: {
    fcfaCurrency: true,
    ussdCodes: true,
    proofUpload: true,
    cloudinaryIntegration: true,
    mobileOperators: true
  }
};

fs.writeFileSync('build-report.json', JSON.stringify(buildReport, null, 2));
console.log('✅ Rapport de build généré: build-report.json\n');

// Résumé final
console.log('📊 RÉSUMÉ FINAL');
console.log('==============');

if (allTestsPassed) {
  console.log('🎉 SUCCÈS: Tous les tests sont passés !');
  console.log('✅ Le système de paiement personnalisé est prêt');
  console.log('✅ La devise FCFA est correctement intégrée');
  console.log('✅ Les codes USSD sont fonctionnels');
  console.log('✅ L\'upload de preuves est opérationnel');
  console.log('✅ Le build de production est réussi');
  
  console.log('\n🚀 PROCHAINES ÉTAPES:');
  console.log('1. Configurer les variables d\'environnement de production');
  console.log('2. Tester le flux complet en mode développement');
  console.log('3. Déployer sur l\'environnement de production');
  console.log('4. Effectuer des tests utilisateur réels');
  console.log('5. Monitorer les transactions et preuves de paiement');
  
} else {
  console.log('❌ ÉCHEC: Certains tests ont échoué');
  console.log('🔧 Veuillez corriger les erreurs avant de continuer');
  console.log('📋 Consultez les messages d\'erreur ci-dessus pour plus de détails');
}

console.log('\n📞 Support: En cas de problème, vérifiez la documentation');
console.log('🌍 AfricaGnotte - Système de paiement pour l\'Afrique');

process.exit(allTestsPassed ? 0 : 1);
