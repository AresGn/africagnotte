// Script de test pour toutes les APIs des cagnottes
// Exécuter avec : node test-apis.js
// Assurez-vous que votre serveur Next.js est démarré sur localhost:3000

const BASE_URL = 'http://localhost:3000';
const CAGNOTTE_ID = 'c6f60eb3-5f2c-425c-a686-08c752b51915';
const USER_ID = 'bf93c980-aab1-47ad-83c0-ab4e91e59cd3';

async function testAPI(name, url, options = {}) {
  console.log(`\n🧪 Test: ${name}`);
  console.log(`📡 ${options.method || 'GET'} ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': USER_ID,
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Succès (${response.status})`);
      if (options.showData !== false) {
        console.log('📄 Données:', JSON.stringify(data, null, 2).substring(0, 500) + '...');
      }
    } else {
      console.log(`❌ Erreur (${response.status}): ${data.error || 'Erreur inconnue'}`);
    }
    
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    console.log(`💥 Erreur réseau: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Démarrage des tests des APIs Cagnottes\n');
  console.log(`🎯 Cagnotte de test: ${CAGNOTTE_ID}`);
  console.log(`👤 Utilisateur de test: ${USER_ID}`);
  
  const results = [];

  // Test 1: Détail de la cagnotte
  const detailResult = await testAPI(
    'Détail de la cagnotte',
    `${BASE_URL}/api/cagnottes/detail/${CAGNOTTE_ID}`
  );
  results.push({ name: 'Détail cagnotte', ...detailResult });

  // Test 2: Liste des dons
  const donationsResult = await testAPI(
    'Liste des dons',
    `${BASE_URL}/api/cagnottes/${CAGNOTTE_ID}/donations?sortBy=amount&limit=5`
  );
  results.push({ name: 'Liste dons', ...donationsResult });

  // Test 3: Créer un don
  const createDonationResult = await testAPI(
    'Créer un don',
    `${BASE_URL}/api/cagnottes/${CAGNOTTE_ID}/donations`,
    {
      method: 'POST',
      body: JSON.stringify({
        donor_name: 'Test Donateur',
        amount: 25000,
        comment: 'Don de test via API',
        is_anonymous: false,
        payment_reference: `test_${Date.now()}`
      })
    }
  );
  results.push({ name: 'Créer don', ...createDonationResult });

  let donationId = null;
  if (createDonationResult.success) {
    donationId = createDonationResult.data.donation.id;
  }

  // Test 4: Confirmer le don (si créé avec succès)
  if (donationId) {
    const confirmDonationResult = await testAPI(
      'Confirmer le don',
      `${BASE_URL}/api/cagnottes/donations/${donationId}/confirm`,
      {
        method: 'PUT',
        body: JSON.stringify({
          payment_status: 'completed',
          payment_reference: `confirmed_${Date.now()}`
        })
      }
    );
    results.push({ name: 'Confirmer don', ...confirmDonationResult });

    // Test 5: Statut du don
    const donationStatusResult = await testAPI(
      'Statut du don',
      `${BASE_URL}/api/cagnottes/donations/${donationId}/confirm`
    );
    results.push({ name: 'Statut don', ...donationStatusResult });
  }

  // Test 6: Liste des actualités
  const actualitesResult = await testAPI(
    'Liste des actualités',
    `${BASE_URL}/api/cagnottes/${CAGNOTTE_ID}/actualites?limit=3`
  );
  results.push({ name: 'Liste actualités', ...actualitesResult });

  // Test 7: Créer une actualité
  const createActualiteResult = await testAPI(
    'Créer une actualité',
    `${BASE_URL}/api/cagnottes/${CAGNOTTE_ID}/actualites`,
    {
      method: 'POST',
      body: JSON.stringify({
        title: 'Actualité de test',
        content: 'Ceci est une actualité créée via l\'API de test. Elle contient du contenu de démonstration pour valider le bon fonctionnement de l\'endpoint.',
        images: ['https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800'],
        is_published: true
      })
    }
  );
  results.push({ name: 'Créer actualité', ...createActualiteResult });

  let actualiteId = null;
  if (createActualiteResult.success) {
    actualiteId = createActualiteResult.data.actualite.id;
  }

  // Test 8: Détail de l'actualité (si créée avec succès)
  if (actualiteId) {
    const actualiteDetailResult = await testAPI(
      'Détail de l\'actualité',
      `${BASE_URL}/api/cagnottes/actualites/${actualiteId}`
    );
    results.push({ name: 'Détail actualité', ...actualiteDetailResult });

    // Test 9: Modifier l'actualité
    const updateActualiteResult = await testAPI(
      'Modifier l\'actualité',
      `${BASE_URL}/api/cagnottes/actualites/${actualiteId}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          title: 'Actualité de test (modifiée)',
          content: 'Contenu modifié via l\'API de test.'
        })
      }
    );
    results.push({ name: 'Modifier actualité', ...updateActualiteResult });
  }

  // Test 10: Statistiques de la cagnotte
  const statsResult = await testAPI(
    'Statistiques de la cagnotte',
    `${BASE_URL}/api/cagnottes/${CAGNOTTE_ID}/stats`
  );
  results.push({ name: 'Statistiques', ...statsResult });

  // Test 11: Test avec URL personnalisée (si disponible)
  const customUrlResult = await testAPI(
    'Accès par URL personnalisée',
    `${BASE_URL}/api/cagnottes/detail/soins-enfants-dakar`,
    { showData: false, headers: {} }
  );
  results.push({ name: 'URL personnalisée', ...customUrlResult });

  // Test 12: Test d'erreur (cagnotte inexistante)
  const errorResult = await testAPI(
    'Cagnotte inexistante (test d\'erreur)',
    `${BASE_URL}/api/cagnottes/detail/inexistante`,
    { showData: false, headers: {} }
  );
  results.push({ name: 'Test erreur 404', ...errorResult });

  // Résumé des résultats
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSUMÉ DES TESTS');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.success).length;
  const total = results.length;

  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    const statusCode = result.status ? ` (${result.status})` : '';
    console.log(`${status} ${result.name}${statusCode}`);
  });

  console.log('\n' + '-'.repeat(60));
  console.log(`🎯 Résultat global: ${successful}/${total} tests réussis`);
  
  if (successful === total) {
    console.log('🎉 Tous les tests sont passés avec succès !');
  } else {
    console.log('⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus.');
  }

  console.log('\n📝 Prochaines étapes :');
  console.log('• Vérifiez que votre serveur Next.js est démarré');
  console.log('• Vérifiez que la base de données contient les données de test');
  console.log('• Testez les APIs dans votre interface utilisateur');
  console.log('• Implémentez la gestion des erreurs côté client');

  // Nettoyage optionnel
  if (actualiteId) {
    console.log('\n🧹 Nettoyage des données de test...');
    await testAPI(
      'Supprimer l\'actualité de test',
      `${BASE_URL}/api/cagnottes/actualites/${actualiteId}`,
      { method: 'DELETE', showData: false }
    );
  }
}

// Vérifier que fetch est disponible (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ fetch n\'est pas disponible. Utilisez Node.js 18+ ou installez node-fetch');
  process.exit(1);
}

// Exécuter les tests
runTests().catch(error => {
  console.error('💥 Erreur lors de l\'exécution des tests:', error);
  process.exit(1);
});
