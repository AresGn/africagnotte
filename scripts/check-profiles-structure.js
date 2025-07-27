const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkProfilesStructure() {
  try {
    const client = await pool.connect();
    
    console.log('📋 Structure de la table profiles:');
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'profiles' 
      ORDER BY column_name
    `);
    
    result.rows.forEach(row => {
      console.log(`  • ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    console.log('\n📋 Structure de la table auth.users:');
    const authResult = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users' AND table_schema = 'auth'
      ORDER BY column_name
    `);
    
    if (authResult.rows.length > 0) {
      authResult.rows.forEach(row => {
        console.log(`  • ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
      });
    } else {
      console.log('  Table auth.users non trouvée');
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await pool.end();
  }
}

checkProfilesStructure();
