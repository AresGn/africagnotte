const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkDonationsTable() {
  console.log('🔍 Vérification de la table cagnotte_donations...\n');
  
  try {
    const client = await pool.connect();
    
    // Vérifier la structure de la table
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'cagnotte_donations' 
      ORDER BY column_name
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Table cagnotte_donations trouvée:');
      result.rows.forEach(row => {
        console.log(`   • ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
      });
    } else {
      console.log('❌ Table cagnotte_donations non trouvée');
    }
    
    // Tester une insertion simple
    console.log('\n🧪 Test d\'insertion simple...');
    
    const testData = {
      cagnotte_id: '0f18dedd-4e06-4a25-8ae4-690dbd535f62',
      donor_name: 'Test Donateur',
      amount: 5000,
      comment: 'Test de don',
      is_anonymous: false,
      payment_reference: 'test_ref_123',
      payment_method: 'moov_benin',
      payment_status: 'pending'
    };
    
    try {
      // Essayer l'insertion avec les champs de base seulement
      const insertResult = await client.query(`
        INSERT INTO cagnotte_donations 
        (cagnotte_id, donor_name, amount, comment, is_anonymous, payment_reference, payment_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, donor_name, amount, created_at
      `, [
        testData.cagnotte_id,
        testData.donor_name,
        testData.amount,
        testData.comment,
        testData.is_anonymous,
        testData.payment_reference,
        testData.payment_status
      ]);
      
      console.log('✅ Insertion simple réussie:');
      console.log(`   • ID: ${insertResult.rows[0].id}`);
      console.log(`   • Donateur: ${insertResult.rows[0].donor_name}`);
      console.log(`   • Montant: ${insertResult.rows[0].amount}`);
      
      // Supprimer le don de test
      await client.query('DELETE FROM cagnotte_donations WHERE id = $1', [insertResult.rows[0].id]);
      console.log('✅ Don de test supprimé');
      
    } catch (insertError) {
      console.log('❌ Erreur lors de l\'insertion simple:');
      console.log(`   ${insertError.message}`);
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await pool.end();
  }
}

checkDonationsTable();
