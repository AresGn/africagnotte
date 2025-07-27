const http = require('http');

async function testDonationAPI() {
  console.log('🧪 Test de l\'API de création de don...\n');
  
  const cagnotteId = '0f18dedd-4e06-4a25-8ae4-690dbd535f62';
  const apiUrl = `http://localhost:3002/api/cagnottes/${cagnotteId}/donations`;
  
  const donationData = {
    donor_name: 'Test Donateur API',
    amount: 5000,
    comment: 'Test de don via API',
    is_anonymous: false,
    payment_reference: `test_${Date.now()}`,
    payment_method: 'moov_benin',
    payment_status: 'pending'
  };
  
  try {
    console.log(`📡 Appel API POST: ${apiUrl}`);
    console.log('📋 Données envoyées:', JSON.stringify(donationData, null, 2));
    
    const response = await new Promise((resolve, reject) => {
      const postData = JSON.stringify(donationData);
      
      const options = {
        hostname: 'localhost',
        port: 3002,
        path: `/api/cagnottes/${cagnotteId}/donations`,
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
    
    if (response.status === 201) {
      console.log('✅ Don créé avec succès !');
      console.log('📋 Réponse:', JSON.stringify(response.data, null, 2));
      
      // Nettoyer - supprimer le don de test
      if (response.data.donation && response.data.donation.id) {
        console.log('\n🧹 Nettoyage du don de test...');
        
        const { Pool } = require('pg');
        require('dotenv').config();
        
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }
        });
        
        try {
          const client = await pool.connect();
          await client.query('DELETE FROM cagnotte_donations WHERE id = $1', [response.data.donation.id]);
          client.release();
          console.log('✅ Don de test supprimé');
        } catch (cleanupError) {
          console.log('⚠️  Erreur lors du nettoyage:', cleanupError.message);
        } finally {
          await pool.end();
        }
      }
      
    } else {
      console.log('❌ Erreur lors de la création du don:');
      console.log('📋 Réponse:', JSON.stringify(response.data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test API:', error.message);
  }
}

// Exécuter le test
testDonationAPI();
