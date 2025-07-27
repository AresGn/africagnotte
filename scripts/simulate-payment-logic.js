// Simulation de la logique de paiement pour debug
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Simulation des opérateurs mobiles (copié de la page de paiement)
const OPERATEURS_MOBILES = [
  // Bénin
  { id: 'moov_benin', nom: 'Moov Money Bénin', pays: 'Bénin', couleur: '#FF6B35' },
  { id: 'mtn_benin', nom: 'MTN Mobile Money Bénin', pays: 'Bénin', couleur: '#FFCC02' },
  
  // Côte d'Ivoire
  { id: 'moov_ci', nom: 'Moov Money CI', pays: 'Côte d\'Ivoire', couleur: '#FF6B35' },
  { id: 'orange_ci', nom: 'Orange Money CI', pays: 'Côte d\'Ivoire', couleur: '#FF7900' },
  { id: 'wave_ci', nom: 'Wave CI', pays: 'Côte d\'Ivoire', couleur: '#1E40AF' },
  
  // Sénégal
  { id: 'orange_senegal', nom: 'Orange Money Sénégal', pays: 'Sénégal', couleur: '#FF7900' },
  { id: 'wave_senegal', nom: 'Wave Sénégal', pays: 'Sénégal', couleur: '#1E40AF' },
  { id: 'free_senegal', nom: 'Free Money Sénégal', pays: 'Sénégal', couleur: '#DC2626' },
];

async function simulatePaymentLogic() {
  console.log('🔍 Simulation de la logique de paiement...\n');
  
  try {
    const client = await pool.connect();
    
    // 1. Récupérer la cagnotte de test
    const cagnotteId = '0f18dedd-4e06-4a25-8ae4-690dbd535f62';
    console.log(`📦 Récupération de la cagnotte ${cagnotteId}...`);
    
    const result = await client.query(`
      SELECT 
        id, title, numero_moov, numero_mtn, numero_orange, 
        numero_wave, numero_airtel, numero_autres
      FROM cagnottes 
      WHERE id = $1
    `, [cagnotteId]);
    
    if (result.rows.length === 0) {
      console.log('❌ Cagnotte non trouvée');
      return;
    }
    
    const cagnotte = result.rows[0];
    console.log('✅ Cagnotte trouvée:', cagnotte.title);
    
    // 2. Afficher les numéros de dépôt disponibles
    console.log('\n💰 Numéros de dépôt dans la base de données:');
    console.log(`   • numero_moov: "${cagnotte.numero_moov || 'Non défini'}"`);
    console.log(`   • numero_mtn: "${cagnotte.numero_mtn || 'Non défini'}"`);
    console.log(`   • numero_orange: "${cagnotte.numero_orange || 'Non défini'}"`);
    console.log(`   • numero_wave: "${cagnotte.numero_wave || 'Non défini'}"`);
    console.log(`   • numero_airtel: "${cagnotte.numero_airtel || 'Non défini'}"`);
    console.log(`   • numero_autres: "${cagnotte.numero_autres || 'Non défini'}"`);
    
    // 3. Simuler la fonction obtenirNumeroBeneficiaire
    const obtenirNumeroBeneficiaire = (operateurId) => {
      const operateurMapping = {
        // Moov Money
        'moov_benin': cagnotte.numero_moov || '',
        'moov_burkina': cagnotte.numero_moov || '',
        'moov_togo': cagnotte.numero_moov || '',
        'moov_ci': cagnotte.numero_moov || '',
        
        // MTN Mobile Money
        'mtn_benin': cagnotte.numero_mtn || '',
        'mtn_cameroun': cagnotte.numero_mtn || '',
        'mtn_congo': cagnotte.numero_mtn || '',
        'mtn_ci': cagnotte.numero_mtn || '',
        
        // Orange Money
        'orange_senegal': cagnotte.numero_orange || '',
        'orange_mali': cagnotte.numero_orange || '',
        'orange_ci': cagnotte.numero_orange || '',
        'orange_cameroun': cagnotte.numero_orange || '',
        
        // Wave
        'wave_senegal': cagnotte.numero_wave || '',
        'wave_ci': cagnotte.numero_wave || '',
        
        // Autres
        'free_senegal': cagnotte.numero_autres || '',
      };
      
      return operateurMapping[operateurId] || '';
    };
    
    // 4. Tester chaque opérateur
    console.log('\n🔍 Test de chaque opérateur:');
    
    const operateursDisponibles = [];
    
    OPERATEURS_MOBILES.forEach(operateur => {
      const numero = obtenirNumeroBeneficiaire(operateur.id);
      const isAvailable = numero && numero.trim() !== '';
      
      console.log(`   • ${operateur.nom} (${operateur.id})`);
      console.log(`     - Numéro: "${numero}"`);
      console.log(`     - Disponible: ${isAvailable ? '✅' : '❌'}`);
      
      if (isAvailable) {
        operateursDisponibles.push(operateur);
      }
    });
    
    // 5. Résumé
    console.log(`\n📊 Résumé:`);
    console.log(`   • Total opérateurs testés: ${OPERATEURS_MOBILES.length}`);
    console.log(`   • Opérateurs disponibles: ${operateursDisponibles.length}`);
    
    if (operateursDisponibles.length > 0) {
      console.log('\n✅ Opérateurs disponibles:');
      operateursDisponibles.forEach(op => {
        console.log(`   • ${op.nom} (${op.pays})`);
      });
    } else {
      console.log('\n❌ Aucun opérateur disponible !');
      console.log('\n🔧 Causes possibles:');
      console.log('   1. Les numéros de dépôt sont null ou vides');
      console.log('   2. Le mapping des opérateurs ne correspond pas');
      console.log('   3. Les IDs des opérateurs ont changé');
    }
    
    // 6. Test spécifique pour le Bénin
    console.log('\n🇧🇯 Test spécifique pour le Bénin:');
    const beninOperators = ['moov_benin', 'mtn_benin'];
    
    beninOperators.forEach(operatorId => {
      const numero = obtenirNumeroBeneficiaire(operatorId);
      console.log(`   • ${operatorId}: "${numero}" ${numero ? '✅' : '❌'}`);
    });
    
    client.release();
    
  } catch (error) {
    console.error('❌ Erreur lors de la simulation:', error);
  } finally {
    await pool.end();
  }
}

// Exécuter la simulation
simulatePaymentLogic();
