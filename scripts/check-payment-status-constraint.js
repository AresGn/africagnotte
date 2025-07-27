const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkPaymentStatusConstraint() {
  console.log('🔍 Vérification de la contrainte payment_status...\n');
  
  try {
    const client = await pool.connect();
    
    // Vérifier la contrainte
    const result = await client.query(`
      SELECT conname, consrc 
      FROM pg_constraint 
      WHERE conname = 'cagnotte_donations_payment_status_check'
    `);
    
    if (result.rows.length > 0) {
      console.log('📋 Contrainte payment_status trouvée:');
      console.log(`   • Nom: ${result.rows[0].conname}`);
      console.log(`   • Définition: ${result.rows[0].consrc}`);
    } else {
      console.log('❌ Contrainte payment_status non trouvée');
    }
    
    // Vérifier toutes les contraintes de la table
    console.log('\n📋 Toutes les contraintes de cagnotte_donations:');
    const allConstraints = await client.query(`
      SELECT conname, consrc, contype
      FROM pg_constraint 
      WHERE conrelid = (SELECT oid FROM pg_class WHERE relname = 'cagnotte_donations')
    `);
    
    allConstraints.rows.forEach(row => {
      const type = row.contype === 'c' ? 'CHECK' : row.contype === 'f' ? 'FOREIGN KEY' : row.contype;
      console.log(`   • ${row.conname} (${type}): ${row.consrc || 'N/A'}`);
    });
    
    // Tester les valeurs possibles
    console.log('\n🧪 Test des valeurs payment_status...');
    
    const testValues = ['pending', 'completed', 'failed', 'cancelled', 'verified', 'proof_uploaded'];
    
    for (const status of testValues) {
      try {
        // Tester avec une insertion fictive (qui sera annulée)
        await client.query('BEGIN');
        
        await client.query(`
          INSERT INTO cagnotte_donations 
          (cagnotte_id, donor_name, amount, payment_status)
          VALUES ($1, $2, $3, $4)
        `, [
          '0f18dedd-4e06-4a25-8ae4-690dbd535f62',
          'Test Status',
          1000,
          status
        ]);
        
        await client.query('ROLLBACK');
        console.log(`   ✅ "${status}" - Valide`);
        
      } catch (error) {
        await client.query('ROLLBACK');
        console.log(`   ❌ "${status}" - Invalide: ${error.message.split('\n')[0]}`);
      }
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await pool.end();
  }
}

checkPaymentStatusConstraint();
