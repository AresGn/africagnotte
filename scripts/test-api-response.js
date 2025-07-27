const fetch = require('node-fetch');

async function testApiResponse() {
  console.log('🧪 Test de la réponse API...\n');
  
  const cagnotteId = '0f18dedd-4e06-4a25-8ae4-690dbd535f62';
  const apiUrl = `http://localhost:3000/api/cagnottes/detail/${cagnotteId}`;
  
  try {
    console.log(`📡 Appel API: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ Réponse API reçue');
    console.log('\n📋 Informations de base:');
    console.log(`   • Titre: ${data.title}`);
    console.log(`   • ID: ${data.id}`);
    console.log(`   • Catégorie: ${data.category}`);
    
    console.log('\n💰 Numéros de dépôt dans la réponse API:');
    console.log(`   • numero_moov: ${data.numero_moov || 'Non défini'}`);
    console.log(`   • numero_mtn: ${data.numero_mtn || 'Non défini'}`);
    console.log(`   • numero_orange: ${data.numero_orange || 'Non défini'}`);
    console.log(`   • numero_wave: ${data.numero_wave || 'Non défini'}`);
    console.log(`   • numero_airtel: ${data.numero_airtel || 'Non défini'}`);
    console.log(`   • numero_autres: ${data.numero_autres || 'Non défini'}`);
    
    // Compter les numéros disponibles
    const numerosDisponibles = [
      data.numero_moov,
      data.numero_mtn,
      data.numero_orange,
      data.numero_wave,
      data.numero_airtel,
      data.numero_autres
    ].filter(num => num && num.trim() !== '');
    
    console.log(`\n📊 Résumé: ${numerosDisponibles.length} numéro(s) de dépôt disponible(s)`);
    
    if (numerosDisponibles.length > 0) {
      console.log('✅ L\'API retourne bien les numéros de dépôt !');
      console.log('\n🎯 Le problème doit être dans la logique de filtrage côté client.');
      console.log('   Vérifiez la fonction obtenirNumeroBeneficiaire() dans la page de paiement.');
    } else {
      console.log('❌ Aucun numéro de dépôt trouvé dans la réponse API');
      console.log('   Le problème vient de l\'API ou de la base de données');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test API:', error.message);
  }
}

// Exécuter le test
testApiResponse();
