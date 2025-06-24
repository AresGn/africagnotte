const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuration de la base de données
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/africagnotte_db',
});

async function setupAdminDatabase() {
  console.log('🚀 Démarrage de la configuration du dashboard admin...');
  
  try {
    // Lire le script SQL
    const sqlPath = path.join(__dirname, 'setup-admin.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 Exécution du script SQL...');
    
    // Exécuter le script SQL
    await pool.query(sqlScript);
    
    console.log('✅ Configuration de la base de données terminée avec succès !');
    
    // Vérifier que les tables ont été créées
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('moderation_actions', 'reports')
    `;
    
    const tablesResult = await pool.query(tablesQuery);
    console.log('📋 Tables créées:', tablesResult.rows.map(row => row.table_name));
    
    // Vérifier les colonnes ajoutées à la table cagnottes
    const columnsQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'cagnottes' 
      AND column_name IN ('moderation_status', 'moderation_notes', 'moderated_by', 'moderated_at')
    `;
    
    const columnsResult = await pool.query(columnsQuery);
    console.log('🔧 Colonnes ajoutées à cagnottes:', columnsResult.rows.map(row => row.column_name));
    
    // Vérifier les rôles dans la table profiles
    const rolesQuery = `
      SELECT DISTINCT role 
      FROM profiles 
      WHERE role IS NOT NULL
    `;
    
    const rolesResult = await pool.query(rolesQuery);
    console.log('👥 Rôles disponibles:', rolesResult.rows.map(row => row.role));
    
    console.log('\n🎯 Prochaines étapes:');
    console.log('1. Attribuez un rôle admin à votre utilisateur:');
    console.log('   UPDATE profiles SET role = \'super_admin\' WHERE email = \'votre-email@example.com\';');
    console.log('2. Démarrez votre serveur Next.js: npm run dev');
    console.log('3. Accédez au dashboard admin: http://localhost:3000/admin');
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error);
    
    if (error.code === 'ENOENT') {
      console.error('Le fichier setup-admin.sql est introuvable.');
    } else if (error.code === '42P07') {
      console.log('⚠️  Certaines tables existent déjà. Ceci est normal si vous relancez le script.');
    } else if (error.code === '42701') {
      console.log('⚠️  Certaines colonnes existent déjà. Ceci est normal si vous relancez le script.');
    }
  } finally {
    await pool.end();
  }
}

// Fonction pour créer un utilisateur admin
async function createAdminUser(email, firstName = 'Admin', lastName = 'User') {
  try {
    console.log(`👤 Création de l'utilisateur admin: ${email}`);
    
    // Vérifier si l'utilisateur existe
    const userCheck = await pool.query(
      'SELECT id, role FROM profiles WHERE email = $1',
      [email]
    );
    
    if (userCheck.rows.length > 0) {
      // Mettre à jour le rôle
      await pool.query(
        'UPDATE profiles SET role = $1 WHERE email = $2',
        ['super_admin', email]
      );
      console.log(`✅ Rôle super_admin attribué à ${email}`);
    } else {
      console.log(`❌ Utilisateur ${email} non trouvé. Veuillez d'abord créer un compte sur la plateforme.`);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur admin:', error);
  }
}

// Fonction principale
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length > 0 && args[0] === 'create-admin') {
    const email = args[1];
    if (!email) {
      console.error('❌ Veuillez fournir un email: node setup-admin.js create-admin email@example.com');
      process.exit(1);
    }
    await createAdminUser(email);
  } else {
    await setupAdminDatabase();
  }
}

// Exécuter le script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { setupAdminDatabase, createAdminUser };
