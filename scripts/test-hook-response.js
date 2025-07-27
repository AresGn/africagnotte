// Test de la réponse du hook useCagnotte
const http = require('http');

async function testHookResponse() {
  console.log('🧪 Test de la réponse du hook useCagnotte...\n');
  
  const cagnotteId = '0f18dedd-4e06-4a25-8ae4-690dbd535f62';
  const apiUrl = `http://localhost:3000/api/cagnottes/detail/${cagnotteId}`;
  
  try {
    console.log(`📡 Appel API: ${apiUrl}`);
    
    const data = await new Promise((resolve, reject) => {
      const req = http.get(apiUrl, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(new Error('Invalid JSON response'));
          }
        });
      });
      req.on('error', reject);
      req.setTimeout(10000, () => reject(new Error('Request timeout')));
    });
    
    console.log('✅ Réponse API reçue');
    
    // Simuler la transformation du hook useCagnotte
    console.log('\n🔄 Simulation de la transformation du hook...');
    
    const transformedData = {
      ...data,
      longDescription: data.longDescription || data.long_description,
      currentAmount: data.current_amount,
      targetAmount: data.target_amount,
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
      participants: data.participants_count,
      isEnded: data.status === 'closed',
      // Numéros de dépôt pour les différents opérateurs
      numero_moov: data.numero_moov,
      numero_mtn: data.numero_mtn,
      numero_orange: data.numero_orange,
      numero_wave: data.numero_wave,
      numero_airtel: data.numero_airtel,
      numero_autres: data.numero_autres,
      // Transformer les donations pour correspondre au format attendu
      donations: (data.donations || []).map((donation) => ({
        ...donation,
        name: donation.donor_name,
        date: new Date(donation.created_at)
      })),
      // Transformer les actualités
      actualites: (data.actualites || []).map((actualite) => ({
        ...actualite,
        titre: actualite.title,
        contenu: actualite.content,
        date: new Date(actualite.created_at),
        video: actualite.video_url,
        montantCollecte: actualite.amount_at_time
      }))
    };
    
    console.log('✅ Transformation terminée');
    
    console.log('\n📋 Informations de base après transformation:');
    console.log(`   • Titre: ${transformedData.title}`);
    console.log(`   • ID: ${transformedData.id}`);
    console.log(`   • Catégorie: ${transformedData.category}`);
    
    console.log('\n💰 Numéros de dépôt après transformation:');
    console.log(`   • numero_moov: ${transformedData.numero_moov || 'Non défini'}`);
    console.log(`   • numero_mtn: ${transformedData.numero_mtn || 'Non défini'}`);
    console.log(`   • numero_orange: ${transformedData.numero_orange || 'Non défini'}`);
    console.log(`   • numero_wave: ${transformedData.numero_wave || 'Non défini'}`);
    console.log(`   • numero_airtel: ${transformedData.numero_airtel || 'Non défini'}`);
    console.log(`   • numero_autres: ${transformedData.numero_autres || 'Non défini'}`);
    
    // Simuler la fonction obtenirNumeroBeneficiaire avec les données transformées
    console.log('\n🔍 Test de la fonction obtenirNumeroBeneficiaire:');
    
    const obtenirNumeroBeneficiaire = (operateurId) => {
      const operateurMapping = {
        'moov_benin': transformedData.numero_moov || '',
        'mtn_benin': transformedData.numero_mtn || '',
        'orange_ci': transformedData.numero_orange || '',
        'wave_senegal': transformedData.numero_wave || '',
        'free_senegal': transformedData.numero_autres || '',
      };
      
      return operateurMapping[operateurId] || '';
    };
    
    const testOperators = ['moov_benin', 'mtn_benin', 'orange_ci', 'wave_senegal', 'free_senegal'];
    
    testOperators.forEach(operatorId => {
      const numero = obtenirNumeroBeneficiaire(operatorId);
      const isAvailable = numero && numero.trim() !== '';
      console.log(`   • ${operatorId}: "${numero}" ${isAvailable ? '✅' : '❌'}`);
    });
    
    // Compter les opérateurs disponibles
    const operateursDisponibles = testOperators.filter(operatorId => {
      const numero = obtenirNumeroBeneficiaire(operatorId);
      return numero && numero.trim() !== '';
    });
    
    console.log(`\n📊 Résumé: ${operateursDisponibles.length} opérateur(s) disponible(s)`);
    
    if (operateursDisponibles.length > 0) {
      console.log('✅ Le hook devrait fonctionner correctement !');
      console.log('\n🎯 Si le problème persiste, vérifiez:');
      console.log('   1. Les logs de debug dans la console du navigateur');
      console.log('   2. Que l\'objet cagnotte contient bien les numéros');
      console.log('   3. Que la fonction obtenirNumeroBeneficiaire utilise les bons champs');
    } else {
      console.log('❌ Problème détecté dans la transformation des données');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

// Exécuter le test
testHookResponse();
