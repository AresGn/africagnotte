const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Utilisateurs de test à créer
const testUsers = [
  {
    firstName: 'Admin',
    lastName: 'Test',
    username: 'admin_test',
    phoneNumber: '+33123456789',
    country: 'France',
    role: 'super_admin'
  },
  {
    firstName: 'User',
    lastName: 'Simple',
    username: 'user_simple',
    phoneNumber: '+33987654321',
    country: 'France',
    role: 'user'
  }
];

async function createTestUsers() {
  console.log('👥 Création des utilisateurs de test...\n');

  try {
    for (const user of testUsers) {
      console.log(`📝 Création de l'utilisateur: ${user.firstName} ${user.lastName} (${user.username})`);
      
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await pool.query(
        'SELECT id, username FROM profiles WHERE username = $1',
        [user.username]
      );

      if (existingUser.rows.length > 0) {
        console.log(`⚠️  L'utilisateur ${user.username} existe déjà`);
        
        // Mettre à jour le rôle si nécessaire
        await pool.query(
          'UPDATE profiles SET role = $1 WHERE username = $2',
          [user.role, user.username]
        );
        console.log(`✅ Rôle mis à jour vers: ${user.role}\n`);
        continue;
      }

      // Créer le nouvel utilisateur
      const result = await pool.query(
        `INSERT INTO profiles (first_name, last_name, username, phone_number, country, role, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
         RETURNING id, username, role`,
        [user.firstName, user.lastName, user.username, user.phoneNumber, user.country, user.role]
      );

      const newUser = result.rows[0];
      console.log(`✅ Utilisateur créé avec succès:`);
      console.log(`   - ID: ${newUser.id}`);
      console.log(`   - Username: ${newUser.username}`);
      console.log(`   - Rôle: ${newUser.role}\n`);
    }

    // Afficher un résumé
    console.log('📊 Résumé des utilisateurs:');
    const allUsers = await pool.query(
      'SELECT username, first_name, last_name, role FROM profiles ORDER BY role DESC, username'
    );

    allUsers.rows.forEach(user => {
      const roleIcon = user.role === 'super_admin' ? '👑' : 
                      user.role === 'admin' ? '🛡️' : 
                      user.role === 'moderator' ? '⚖️' : '👤';
      console.log(`${roleIcon} ${user.first_name} ${user.last_name} (@${user.username}) - ${user.role}`);
    });

    console.log('\n🎯 Instructions pour tester:');
    console.log('1. Ces utilisateurs n\'ont pas de mot de passe dans votre système actuel');
    console.log('2. Vous devez soit:');
    console.log('   a) Créer des comptes via l\'interface web (/inscription)');
    console.log('   b) Adapter votre système d\'auth pour ces utilisateurs');
    console.log('3. Pour tester l\'admin: utilisez le compte avec le rôle super_admin');
    console.log('4. Dashboard admin: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Erreur lors de la création des utilisateurs:', error.message);
  } finally {
    await pool.end();
  }
}

// Fonction pour créer un utilisateur personnalisé
async function createCustomUser(firstName, lastName, username, phoneNumber, country, role = 'user') {
  console.log(`👤 Création de l'utilisateur personnalisé: ${firstName} ${lastName}`);
  
  try {
    const result = await pool.query(
      `INSERT INTO profiles (first_name, last_name, username, phone_number, country, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING id, username, role`,
      [firstName, lastName, username, phoneNumber, country, role]
    );

    const newUser = result.rows[0];
    console.log(`✅ Utilisateur créé:`);
    console.log(`   - ID: ${newUser.id}`);
    console.log(`   - Username: ${newUser.username}`);
    console.log(`   - Rôle: ${newUser.role}`);

    return newUser;
  } catch (error) {
    if (error.code === '23505') { // Violation de contrainte unique
      console.log(`⚠️  L'username '${username}' existe déjà`);
    } else {
      console.error('❌ Erreur:', error.message);
    }
  } finally {
    await pool.end();
  }
}

// Fonction principale
async function main() {
  const args = process.argv.slice(2);
  
  if (args[0] === 'custom') {
    // Usage: node create-test-users.js custom "Prénom" "Nom" "username" "+33123456789" "Pays" "role"
    const [, firstName, lastName, username, phoneNumber, country, role] = args;
    
    if (!firstName || !lastName || !username) {
      console.error('❌ Usage: node create-test-users.js custom "Prénom" "Nom" "username" "+33123456789" "Pays" "role"');
      process.exit(1);
    }
    
    await createCustomUser(
      firstName, 
      lastName, 
      username, 
      phoneNumber || '+33000000000', 
      country || 'France', 
      role || 'user'
    );
  } else {
    await createTestUsers();
  }
}

if (require.main === module) {
  main().catch(console.error);
}
