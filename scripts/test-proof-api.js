const http = require('http');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testProofAPI() {
  console.log('🧪 Test de l\'API de preuve de paiement...\n');
  
  const cagnotteId = '0f18dedd-4e06-4a25-8ae4-690dbd535f62';
  let donationId = null;
  
  try {
    // 1. Créer d'abord un don de test
    console.log('1️⃣ Création d\'un don de test...');
    
    const client = await pool.connect();
    
    const donationResult = await client.query(`
      INSERT INTO cagnotte_donations 
      (cagnotte_id, donor_name, amount, comment, is_anonymous, payment_reference, payment_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, donor_name, amount
    `, [
      cagnotteId,
      'Test Donateur Preuve',
      5000,
      'Test de preuve de paiement',
      false,
      `test_proof_${Date.now()}`,
      'pending'
    ]);
    
    donationId = donationResult.rows[0].id;
    console.log(`✅ Don créé: ${donationId}`);
    
    client.release();
    
    // 2. Tester l'API de preuve
    console.log('\n2️⃣ Test de l\'API de preuve...');
    
    const apiUrl = `http://localhost:3002/api/cagnottes/${cagnotteId}/donations/${donationId}/preuve`;
    
    const proofData = {
      proof_image_url: 'https://res.cloudinary.com/test/image/upload/v123456789/test_proof.jpg',
      payment_status: 'pending'
    };
    
    console.log(`📡 Appel API POST: ${apiUrl}`);
    console.log('📋 Données envoyées:', JSON.stringify(proofData, null, 2));
    
    const response = await new Promise((resolve, reject) => {
      const postData = JSON.stringify(proofData);
      
      const options = {
        hostname: 'localhost',
        port: 3002,
        path: `/api/cagnottes/${cagnotteId}/donations/${donationId}/preuve`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };
      
      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const data = JSON.parse(body);
            resolve({ status: res.statusCode, data });
          } catch (e) {
            resolve({ status: res.statusCode, data: body });
          }
        });
      });
      
      req.on('error', reject);
      req.setTimeout(10000, () => reject(new Error('Request timeout')));
      
      req.write(postData);
      req.end();
    });
    
    console.log(`📊 Status: ${response.status}`);
    
    if (response.status === 200) {
      console.log('✅ Preuve enregistrée avec succès !');
      console.log('📋 Réponse:', JSON.stringify(response.data, null, 2));
    } else {
      console.log('❌ Erreur lors de l\'enregistrement de la preuve:');
      console.log('📋 Réponse:', JSON.stringify(response.data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  } finally {
    // Nettoyage
    if (donationId) {
      console.log('\n🧹 Nettoyage...');
      try {
        const client = await pool.connect();
        await client.query('DELETE FROM cagnotte_donations WHERE id = $1', [donationId]);
        client.release();
        console.log('✅ Don de test supprimé');
      } catch (cleanupError) {
        console.log('⚠️  Erreur lors du nettoyage:', cleanupError.message);
      }
    }
    
    await pool.end();
  }
}

// Exécuter le test
testProofAPI();
