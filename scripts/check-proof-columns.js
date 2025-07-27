const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkProofColumns() {
  console.log('🔍 Vérification des colonnes de preuve...\n');
  
  try {
    const client = await pool.connect();
    
    // Vérifier les colonnes de preuve
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'cagnotte_donations' 
        AND column_name IN ('proof_image_url', 'proof_uploaded_at', 'verified_at', 'admin_notes')
      ORDER BY column_name
    `);
    
    console.log('📋 Colonnes de preuve trouvées:');
    if (result.rows.length > 0) {
      result.rows.forEach(row => {
        console.log(`   ✅ ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
      });
    } else {
      console.log('   ❌ Aucune colonne de preuve trouvée');
    }
    
    // Vérifier toutes les colonnes de la table
    console.log('\n📋 Toutes les colonnes de la table cagnotte_donations:');
    const allColumns = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns 
      WHERE table_name = 'cagnotte_donations'
      ORDER BY column_name
    `);
    
    allColumns.rows.forEach(row => {
      const hasProof = ['proof_image_url', 'proof_uploaded_at', 'verified_at', 'admin_notes'].includes(row.column_name);
      const icon = hasProof ? '🔍' : '  ';
      console.log(`   ${icon} ${row.column_name}: ${row.data_type}`);
    });
    
    // Créer les colonnes manquantes si nécessaire
    const missingColumns = ['proof_image_url', 'proof_uploaded_at', 'verified_at', 'admin_notes']
      .filter(col => !result.rows.some(row => row.column_name === col));
    
    if (missingColumns.length > 0) {
      console.log('\n🔧 Ajout des colonnes manquantes...');
      
      for (const column of missingColumns) {
        let columnDef;
        switch (column) {
          case 'proof_image_url':
            columnDef = 'TEXT';
            break;
          case 'proof_uploaded_at':
          case 'verified_at':
            columnDef = 'TIMESTAMP WITH TIME ZONE';
            break;
          case 'admin_notes':
            columnDef = 'TEXT';
            break;
        }
        
        try {
          await client.query(`ALTER TABLE cagnotte_donations ADD COLUMN IF NOT EXISTS ${column} ${columnDef}`);
          console.log(`   ✅ Colonne ${column} ajoutée`);
        } catch (error) {
          console.log(`   ❌ Erreur lors de l'ajout de ${column}:`, error.message);
        }
      }
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await pool.end();
  }
}

checkProofColumns();
