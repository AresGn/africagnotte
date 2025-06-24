const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Utilisateurs à créer avec mots de passe
const usersToCreate = [
  {
    // Compte Admin
    email: 'alex.gnimagnon@africagnotte.com',
    password: 'admin123',
    firstName: 'Alex',
    lastName: 'GNIMAGNON',
    username: 'RichePopo',
    phoneNumber: '+229 546789 01',
    country: 'Bénin',
    role: 'super_admin'
  },
  {
    // Compte Utilisateur Simple
    email: 'marc.zinzou@africagnotte.com',
    password: 'user123',
    firstName: 'Marc',
    lastName: 'ZINZOU',
    username: 'zidane',
    phoneNumber: '+229 67000712',
    country: 'Gabon',
    role: 'user'
  }
];

async function createCompleteUser(userData) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log(`👤 Création de l'utilisateur: ${userData.firstName} ${userData.lastName} (${userData.email})`);
    
    // 1. Vérifier si l'email existe déjà dans auth.users
    const existingAuthUser = await client.query(
      'SELECT id FROM auth.users WHERE email = $1',
      [userData.email]
    );
    
    if (existingAuthUser.rows.length > 0) {
      console.log(`⚠️  L'email ${userData.email} existe déjà dans auth.users`);
      await client.query('ROLLBACK');
      return null;
    }
    
    // 2. Vérifier si le username existe déjà dans profiles
    const existingProfile = await client.query(
      'SELECT id FROM profiles WHERE username = $1',
      [userData.username]
    );
    
    if (existingProfile.rows.length > 0) {
      console.log(`⚠️  L'username ${userData.username} existe déjà dans profiles`);
      await client.query('ROLLBACK');
      return null;
    }
    
    // 3. Hasher le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    
    // 4. Générer l'ID utilisateur
    const userId = uuidv4();
    
    // 5. Créer l'utilisateur dans auth.users
    const rawUserMetaData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      phone_number: userData.phoneNumber,
      country: userData.country,
      full_name: `${userData.firstName} ${userData.lastName}`
    };
    
    await client.query(
      `INSERT INTO auth.users (id, email, encrypted_password, raw_user_meta_data, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [userId, userData.email, hashedPassword, JSON.stringify(rawUserMetaData)]
    );
    
    console.log(`✅ Utilisateur créé dans auth.users`);
    
    // 6. Créer le profil dans public.profiles
    await client.query(
      `INSERT INTO profiles (id, first_name, last_name, username, phone_number, country, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
      [userId, userData.firstName, userData.lastName, userData.username, userData.phoneNumber, userData.country, userData.role]
    );
    
    console.log(`✅ Profil créé dans profiles`);
    
    await client.query('COMMIT');
    
    console.log(`🎉 Utilisateur ${userData.firstName} ${userData.lastName} créé avec succès !`);
    console.log(`   - Email: ${userData.email}`);
    console.log(`   - Username: ${userData.username}`);
    console.log(`   - Mot de passe: ${userData.password}`);
    console.log(`   - Rôle: ${userData.role}\n`);
    
    return {
      id: userId,
      email: userData.email,
      username: userData.username,
      role: userData.role
    };
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`❌ Erreur lors de la création de ${userData.email}:`, error.message);
    return null;
  } finally {
    client.release();
  }
}

async function createAllUsers() {
  console.log('🚀 Création des utilisateurs complets avec authentification...\n');
  
  const createdUsers = [];
  
  for (const userData of usersToCreate) {
    const result = await createCompleteUser(userData);
    if (result) {
      createdUsers.push(result);
    }
  }
  
  if (createdUsers.length > 0) {
    console.log('📊 Résumé des utilisateurs créés:');
    console.log('=====================================');
    
    for (const user of createdUsers) {
      const roleIcon = user.role === 'super_admin' ? '👑' : 
                      user.role === 'admin' ? '🛡️' : 
                      user.role === 'moderator' ? '⚖️' : '👤';
      console.log(`${roleIcon} ${user.username} (${user.email}) - ${user.role}`);
    }
    
    console.log('\n🎯 Instructions pour tester:');
    console.log('=====================================');
    console.log('1. Allez sur: http://localhost:3000/connexion');
    console.log('2. Connectez-vous avec:');
    console.log('   👑 ADMIN:');
    console.log('      Email: alex.gnimagnon@africagnotte.com');
    console.log('      Mot de passe: admin123');
    console.log('   👤 USER:');
    console.log('      Email: marc.zinzou@africagnotte.com');
    console.log('      Mot de passe: user123');
    console.log('3. Pour l\'admin, accédez au dashboard: http://localhost:3000/admin');
    console.log('\n✨ Tous les comptes sont prêts à utiliser !');
  } else {
    console.log('❌ Aucun utilisateur n\'a pu être créé');
  }
}

// Fonction pour créer un utilisateur personnalisé
async function createCustomCompleteUser(email, password, firstName, lastName, username, phoneNumber, country, role = 'user') {
  const userData = {
    email,
    password,
    firstName,
    lastName,
    username,
    phoneNumber,
    country,
    role
  };
  
  const result = await createCompleteUser(userData);
  
  if (result) {
    console.log('\n🎯 Utilisateur créé ! Vous pouvez maintenant vous connecter avec:');
    console.log(`   Email: ${email}`);
    console.log(`   Mot de passe: ${password}`);
    console.log(`   Rôle: ${role}`);
  }
}

// Fonction pour vérifier les tables
async function checkTables() {
  try {
    console.log('🔍 Vérification des tables...');
    
    // Vérifier auth.users
    const authUsersCheck = await pool.query("SELECT COUNT(*) FROM auth.users");
    console.log(`📊 auth.users: ${authUsersCheck.rows[0].count} utilisateurs`);
    
    // Vérifier profiles
    const profilesCheck = await pool.query("SELECT COUNT(*) FROM profiles");
    console.log(`📊 profiles: ${profilesCheck.rows[0].count} profils`);
    
    // Vérifier les rôles
    const rolesCheck = await pool.query("SELECT role, COUNT(*) FROM profiles GROUP BY role");
    console.log('📊 Répartition des rôles:');
    rolesCheck.rows.forEach(row => {
      const roleIcon = row.role === 'super_admin' ? '👑' : 
                      row.role === 'admin' ? '🛡️' : 
                      row.role === 'moderator' ? '⚖️' : '👤';
      console.log(`   ${roleIcon} ${row.role}: ${row.count}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
  }
}

// Fonction principale
async function main() {
  const args = process.argv.slice(2);
  
  if (args[0] === 'check') {
    await checkTables();
  } else if (args[0] === 'custom') {
    // Usage: node create-complete-users.js custom email password "Prénom" "Nom" "username" "+phone" "Pays" "role"
    const [, email, password, firstName, lastName, username, phoneNumber, country, role] = args;
    
    if (!email || !password || !firstName || !lastName || !username) {
      console.error('❌ Usage: node create-complete-users.js custom email password "Prénom" "Nom" "username" "+phone" "Pays" "role"');
      process.exit(1);
    }
    
    await createCustomCompleteUser(
      email, 
      password, 
      firstName, 
      lastName, 
      username, 
      phoneNumber || '+33000000000', 
      country || 'France', 
      role || 'user'
    );
  } else {
    await createAllUsers();
  }
  
  await pool.end();
}

if (require.main === module) {
  main().catch(console.error);
}
