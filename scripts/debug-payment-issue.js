const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function debugPaymentIssue() {
  console.log('🔍 Debug du problème de paiement...\n');
  
  try {
    const client = await pool.connect();
    
    // 1. Vérifier les cagnottes avec numéros de dépôt
    console.log('1️⃣ Vérification des cagnottes avec numéros de dépôt...');
    
    const cagnottesResult = await client.query(`
      SELECT 
        id, title, user_id,
        numero_moov, numero_mtn, numero_orange, 
        numero_wave, numero_airtel, numero_autres,
        created_at
      FROM cagnottes 
      WHERE numero_moov IS NOT NULL 
         OR numero_mtn IS NOT NULL 
         OR numero_orange IS NOT NULL 
         OR numero_wave IS NOT NULL 
         OR numero_airtel IS NOT NULL 
         OR numero_autres IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    if (cagnottesResult.rows.length > 0) {
      console.log('✅ Cagnottes avec numéros de dépôt trouvées:');
      cagnottesResult.rows.forEach(row => {
        console.log(`\n📦 ${row.title} (ID: ${row.id})`);
        console.log(`   • Moov: ${row.numero_moov || 'Non défini'}`);
        console.log(`   • MTN: ${row.numero_mtn || 'Non défini'}`);
        console.log(`   • Orange: ${row.numero_orange || 'Non défini'}`);
        console.log(`   • Wave: ${row.numero_wave || 'Non défini'}`);
        console.log(`   • Airtel: ${row.numero_airtel || 'Non défini'}`);
        console.log(`   • Autres: ${row.numero_autres || 'Non défini'}`);
      });
    } else {
      console.log('❌ Aucune cagnotte avec numéros de dépôt trouvée');
    }
    
    // 2. Vérifier la cagnotte de test spécifique
    console.log('\n2️⃣ Vérification de la cagnotte de test...');
    
    const testCagnotteResult = await client.query(`
      SELECT 
        c.id, c.title, c.user_id,
        c.numero_moov, c.numero_mtn, c.numero_orange, 
        c.numero_wave, c.numero_airtel, c.numero_autres,
        p.username, p.country
      FROM cagnottes c
      LEFT JOIN profiles p ON c.user_id = p.id
      WHERE c.title LIKE '%éducation%' OR c.title LIKE '%Test%'
      ORDER BY c.created_at DESC
      LIMIT 3
    `);
    
    if (testCagnotteResult.rows.length > 0) {
      console.log('✅ Cagnottes de test trouvées:');
      testCagnotteResult.rows.forEach(row => {
        console.log(`\n📦 ${row.title}`);
        console.log(`   • ID: ${row.id}`);
        console.log(`   • Créateur: ${row.username} (${row.country})`);
        console.log(`   • URL de test: http://localhost:3000/paiement/${row.id}`);
        console.log(`   • Numéros de dépôt:`);
        console.log(`     - Moov: ${row.numero_moov || 'Non défini'}`);
        console.log(`     - MTN: ${row.numero_mtn || 'Non défini'}`);
        console.log(`     - Orange: ${row.numero_orange || 'Non défini'}`);
        console.log(`     - Wave: ${row.numero_wave || 'Non défini'}`);
        console.log(`     - Airtel: ${row.numero_airtel || 'Non défini'}`);
        console.log(`     - Autres: ${row.numero_autres || 'Non défini'}`);
      });
    } else {
      console.log('❌ Aucune cagnotte de test trouvée');
    }
    
    // 3. Tester l'API de détail d'une cagnotte
    console.log('\n3️⃣ Test de l\'API de détail...');
    
    if (testCagnotteResult.rows.length > 0) {
      const testCagnotte = testCagnotteResult.rows[0];
      
      // Simuler l'appel API
      const apiResult = await client.query(`
        SELECT 
          id, user_id, title, custom_url, category, description, long_description, 
          images, video, is_private, show_target, target_amount, hide_amount, 
          show_participants, current_amount, participants_count, status, 
          author_name, author_phone, author_socials, created_at, updated_at,
          numero_moov, numero_mtn, numero_orange, numero_wave, numero_airtel, numero_autres
        FROM cagnottes 
        WHERE id = $1
      `, [testCagnotte.id]);
      
      if (apiResult.rows.length > 0) {
        const cagnotte = apiResult.rows[0];
        console.log('✅ API de détail fonctionne:');
        console.log(`   • Titre: ${cagnotte.title}`);
        console.log(`   • Numéros récupérés par l'API:`);
        console.log(`     - numero_moov: ${cagnotte.numero_moov}`);
        console.log(`     - numero_mtn: ${cagnotte.numero_mtn}`);
        console.log(`     - numero_orange: ${cagnotte.numero_orange}`);
        console.log(`     - numero_wave: ${cagnotte.numero_wave}`);
        console.log(`     - numero_airtel: ${cagnotte.numero_airtel}`);
        console.log(`     - numero_autres: ${cagnotte.numero_autres}`);
        
        // Simuler la logique de filtrage des opérateurs
        console.log('\n🔍 Simulation de la logique de filtrage:');
        
        const operateurMapping = {
          'moov_benin': cagnotte.numero_moov || '',
          'moov_burkina': cagnotte.numero_moov || '',
          'moov_togo': cagnotte.numero_moov || '',
          'moov_ci': cagnotte.numero_moov || '',
          'mtn_benin': cagnotte.numero_mtn || '',
          'mtn_cameroun': cagnotte.numero_mtn || '',
          'mtn_congo': cagnotte.numero_mtn || '',
          'mtn_ci': cagnotte.numero_mtn || '',
          'mtn_ghana': cagnotte.numero_mtn || '',
          'mtn_uganda': cagnotte.numero_mtn || '',
          'mtn_rwanda': cagnotte.numero_mtn || '',
          'mtn_zambia': cagnotte.numero_mtn || '',
        };
        
        const operateursAvecNumeros = [];
        Object.entries(operateurMapping).forEach(([operateur, numero]) => {
          if (numero && numero.trim() !== '') {
            operateursAvecNumeros.push(`${operateur}: ${numero}`);
          }
        });
        
        if (operateursAvecNumeros.length > 0) {
          console.log('✅ Opérateurs avec numéros:');
          operateursAvecNumeros.forEach(op => console.log(`   • ${op}`));
        } else {
          console.log('❌ Aucun opérateur avec numéro trouvé');
        }
        
      } else {
        console.log('❌ Erreur API: cagnotte non trouvée');
      }
    }
    
    // 4. Vérifier l'endpoint API réel
    console.log('\n4️⃣ Recommandations de debug...');
    
    console.log('🔧 Pour débugger le problème:');
    console.log('1. Vérifiez que l\'API /api/cagnottes/detail/[id] retourne les numéros');
    console.log('2. Ajoutez des console.log dans la page de paiement');
    console.log('3. Vérifiez que useCagnotte() récupère bien les numéros');
    console.log('4. Testez avec l\'ID de cagnotte ci-dessus');
    
    if (testCagnotteResult.rows.length > 0) {
      const testId = testCagnotteResult.rows[0].id;
      console.log(`\n🧪 URL de test: http://localhost:3000/paiement/${testId}`);
      console.log(`📋 ID à utiliser pour debug: ${testId}`);
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Erreur lors du debug:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Exécuter le debug si le script est appelé directement
if (require.main === module) {
  debugPaymentIssue()
    .then(() => {
      console.log('\n✅ Debug terminé');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Échec du debug:', error);
      process.exit(1);
    });
}

module.exports = { debugPaymentIssue };
