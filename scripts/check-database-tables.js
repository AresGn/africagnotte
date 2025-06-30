const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

async function checkDatabaseTables() {
  try {
    console.log('🔍 Vérification des tables existantes dans la base de données...\n');
    
    // Vérifier toutes les tables publiques
    const tablesResult = await pool.query(`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 Tables existantes:');
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name} (${row.table_type})`);
    });
    
    // Vérifier les tables spécifiques pour l'admin
    const adminTables = ['moderation_actions', 'reports'];
    console.log('\n🛡️ Tables admin spécifiques:');
    
    for (const tableName of adminTables) {
      const tableExists = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )
      `, [tableName]);
      
      const exists = tableExists.rows[0].exists;
      console.log(`   ${exists ? '✅' : '❌'} ${tableName}: ${exists ? 'Existe' : 'Manquante'}`);
      
      if (exists) {
        // Vérifier la structure de la table
        const columnsResult = await pool.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = $1 
          ORDER BY ordinal_position
        `, [tableName]);
        
        console.log(`      Colonnes:`);
        columnsResult.rows.forEach(col => {
          console.log(`        - ${col.column_name} (${col.data_type}${col.is_nullable === 'NO' ? ', NOT NULL' : ''})`);
        });
      }
    }
    
    // Vérifier les colonnes de modération dans cagnottes
    console.log('\n📝 Colonnes de modération dans cagnottes:');
    const moderationColumns = ['moderation_status', 'moderation_notes', 'moderated_by', 'moderated_at'];
    
    for (const columnName of moderationColumns) {
      const columnExists = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'cagnottes' 
          AND column_name = $1
        )
      `, [columnName]);
      
      const exists = columnExists.rows[0].exists;
      console.log(`   ${exists ? '✅' : '❌'} ${columnName}: ${exists ? 'Existe' : 'Manquante'}`);
    }
    
    // Vérifier les fonctions et vues
    console.log('\n🔧 Fonctions et vues:');
    
    const functionsResult = await pool.query(`
      SELECT routine_name 
      FROM information_schema.routines 
      WHERE routine_schema = 'public' 
      AND routine_name = 'get_admin_stats'
    `);
    
    console.log(`   ${functionsResult.rows.length > 0 ? '✅' : '❌'} get_admin_stats: ${functionsResult.rows.length > 0 ? 'Existe' : 'Manquante'}`);
    
    const viewsResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.views 
      WHERE table_schema = 'public' 
      AND table_name = 'admin_cagnottes_view'
    `);
    
    console.log(`   ${viewsResult.rows.length > 0 ? '✅' : '❌'} admin_cagnottes_view: ${viewsResult.rows.length > 0 ? 'Existe' : 'Manquante'}`);
    
    // Vérifier les types enum
    console.log('\n🏷️ Types enum:');
    const enumsResult = await pool.query(`
      SELECT typname 
      FROM pg_type 
      WHERE typtype = 'e' 
      AND typname IN ('user_role', 'moderation_status')
    `);
    
    const enumNames = enumsResult.rows.map(row => row.typname);
    console.log(`   ${enumNames.includes('user_role') ? '✅' : '❌'} user_role: ${enumNames.includes('user_role') ? 'Existe' : 'Manquant'}`);
    console.log(`   ${enumNames.includes('moderation_status') ? '✅' : '❌'} moderation_status: ${enumNames.includes('moderation_status') ? 'Existe' : 'Manquant'}`);
    
    // Compter les données existantes
    console.log('\n📊 Données existantes:');
    
    const cagnotteCount = await pool.query('SELECT COUNT(*) FROM cagnottes');
    console.log(`   - Cagnottes: ${cagnotteCount.rows[0].count}`);
    
    const profileCount = await pool.query('SELECT COUNT(*) FROM profiles');
    console.log(`   - Profils: ${profileCount.rows[0].count}`);
    
    if (tablesResult.rows.some(row => row.table_name === 'reports')) {
      const reportCount = await pool.query('SELECT COUNT(*) FROM reports');
      console.log(`   - Signalements: ${reportCount.rows[0].count}`);
    }
    
    if (tablesResult.rows.some(row => row.table_name === 'moderation_actions')) {
      const actionCount = await pool.query('SELECT COUNT(*) FROM moderation_actions');
      console.log(`   - Actions de modération: ${actionCount.rows[0].count}`);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
  } finally {
    await pool.end();
  }
}

checkDatabaseTables();
