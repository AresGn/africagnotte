const http = require('http');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testCompletePaymentFlow() {
  console.log('🎯 Test complet du flux de paiement...\n');
  
  const cagnotteId = '0f18dedd-4e06-4a25-8ae4-690dbd535f62';
  let donationId = null;
  
  try {
    // 1. Créer un don
    console.log('1️⃣ Création d\'un don...');
    
    const donationData = {
      donor_name: 'Test Donateur Complet',
      amount: 10000,
      comment: 'Test du flux complet de paiement',
      is_anonymous: false,
      payment_reference: `test_complete_${Date.now()}`,
      payment_method: 'moov_benin',
      payment_status: 'pending'
    };
    
    const donationResponse = await new Promise((resolve, reject) => {
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
    
    if (donationResponse.status === 201) {
      donationId = donationResponse.data.donation.id;
      console.log(`✅ Don créé: ${donationId}`);
      console.log(`   • Montant: ${donationResponse.data.donation.amount} FCFA`);
      console.log(`   • Donateur: ${donationResponse.data.donation.donor_name}`);
    } else {
      throw new Error(`Erreur création don: ${JSON.stringify(donationResponse.data)}`);
    }
    
    // 2. Uploader une preuve de paiement
    console.log('\n2️⃣ Upload de la preuve de paiement...');
    
    const proofData = {
      proof_image_url: 'https://res.cloudinary.com/africagnotte/image/upload/v1753614500/preuve_paiement_test.jpg',
      payment_status: 'pending'
    };
    
    const proofResponse = await new Promise((resolve, reject) => {
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
    
    if (proofResponse.status === 200) {
      console.log('✅ Preuve uploadée avec succès');
      console.log(`   • URL: ${proofResponse.data.donation.proof_image_url}`);
      console.log(`   • Date: ${proofResponse.data.donation.proof_uploaded_at}`);
    } else {
      throw new Error(`Erreur upload preuve: ${JSON.stringify(proofResponse.data)}`);
    }
    
    // 3. Vérifier les données en base
    console.log('\n3️⃣ Vérification en base de données...');
    
    const client = await pool.connect();
    
    const dbResult = await client.query(`
      SELECT 
        id, donor_name, amount, comment, payment_status,
        proof_image_url, proof_uploaded_at, created_at
      FROM cagnotte_donations 
      WHERE id = $1
    `, [donationId]);
    
    if (dbResult.rows.length > 0) {
      const donation = dbResult.rows[0];
      console.log('✅ Don trouvé en base:');
      console.log(`   • ID: ${donation.id}`);
      console.log(`   • Donateur: ${donation.donor_name}`);
      console.log(`   • Montant: ${donation.amount} FCFA`);
      console.log(`   • Status: ${donation.payment_status}`);
      console.log(`   • Preuve: ${donation.proof_image_url ? 'Oui' : 'Non'}`);
      console.log(`   • Date preuve: ${donation.proof_uploaded_at || 'N/A'}`);
    } else {
      throw new Error('Don non trouvé en base de données');
    }
    
    client.release();
    
    console.log('\n🎉 Test complet réussi !');
    console.log('\n📋 Résumé:');
    console.log('   ✅ Création de don');
    console.log('   ✅ Upload de preuve');
    console.log('   ✅ Sauvegarde en base');
    console.log('   ✅ Toutes les APIs fonctionnent');
    
    console.log('\n🚀 Le système de paiement est entièrement fonctionnel !');
    
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
testCompletePaymentFlow();
