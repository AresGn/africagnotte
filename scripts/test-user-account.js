const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Données du compte de test
const testAccount = {
  email: 'test.paiement@africagnotte.com',
  password: 'TestPaiement123!',
  firstName: 'Test',
  lastName: 'Paiement',
  username: 'testpaiement',
  phoneNumber: '+229 97123456',
  country: 'Bénin'
};

async function createTestAccount() {
  console.log('👤 Création du compte de test...\n');
  
  try {
    const client = await pool.connect();
    
    // Vérifier si le compte existe déjà
    const existingUser = await client.query(
      'SELECT id FROM profiles WHERE username = $1 OR email = $2',
      [testAccount.username, testAccount.email]
    );
    
    if (existingUser.rows.length > 0) {
      console.log('⚠️  Le compte de test existe déjà');
      const userId = existingUser.rows[0].id;
      client.release();
      return userId;
    }
    
    // Hasher le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(testAccount.password, saltRounds);
    
    // Générer l'ID utilisateur
    const userId = uuidv4();
    
    // Créer l'utilisateur dans auth.users
    const rawUserMetaData = {
      firstName: testAccount.firstName,
      lastName: testAccount.lastName,
      username: testAccount.username,
      phone_number: testAccount.phoneNumber,
      country: testAccount.country,
      full_name: `${testAccount.firstName} ${testAccount.lastName}`
    };
    
    await client.query(
      `INSERT INTO auth.users (id, email, encrypted_password, raw_user_meta_data, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [userId, testAccount.email, hashedPassword, JSON.stringify(rawUserMetaData)]
    );
    
    // Créer le profil dans public.profiles
    await client.query(
      `INSERT INTO profiles (id, first_name, last_name, username, phone_number, country, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
      [userId, testAccount.firstName, testAccount.lastName, testAccount.username, testAccount.phoneNumber, testAccount.country, 'user']
    );
    
    console.log('✅ Compte de test créé avec succès:');
    console.log(`   • Email: ${testAccount.email}`);
    console.log(`   • Mot de passe: ${testAccount.password}`);
    console.log(`   • Username: ${testAccount.username}`);
    console.log(`   • Pays: ${testAccount.country}`);
    console.log(`   • ID: ${userId}`);
    
    client.release();
    return userId;
    
  } catch (error) {
    console.error('❌ Erreur lors de la création du compte:', error);
    throw error;
  }
}

async function createTestCagnotte(userId) {
  console.log('\n📦 Création d\'une cagnotte de test...');
  
  try {
    const client = await pool.connect();
    
    // Données de la cagnotte de test
    const cagnotteData = {
      user_id: userId,
      title: 'Aide pour l\'éducation des enfants au Bénin',
      category: 'Éducation',
      description: 'Cette cagnotte vise à collecter des fonds pour l\'achat de fournitures scolaires et le paiement des frais de scolarité pour des enfants défavorisés au Bénin.',
      long_description: 'Description détaillée de la cagnotte de test avec tous les détails nécessaires...',
      author_name: 'Test Paiement',
      author_phone: '+229 97123456',
      images: JSON.stringify(['https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=500']),
      is_private: false,
      show_target: true,
      target_amount: 500000, // 500,000 FCFA
      hide_amount: false,
      show_participants: true,
      // Numéros de dépôt spécifiques au Bénin
      numero_moov: '97123456',
      numero_mtn: '67123456',
      numero_orange: null, // Pas disponible au Bénin
      numero_wave: null,   // Pas disponible au Bénin
      numero_airtel: null, // Pas disponible au Bénin
      numero_autres: '90123456', // Pour autres opérateurs
      status: 'active',
      moderation_status: 'approved'
    };
    
    const result = await client.query(`
      INSERT INTO cagnottes (
        user_id, title, category, description, long_description, author_name, author_phone,
        images, is_private, show_target, target_amount, hide_amount, show_participants,
        numero_moov, numero_mtn, numero_orange, numero_wave, numero_airtel, numero_autres,
        status, moderation_status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, NOW(), NOW())
      RETURNING id, title, custom_url
    `, [
      cagnotteData.user_id,
      cagnotteData.title,
      cagnotteData.category,
      cagnotteData.description,
      cagnotteData.long_description,
      cagnotteData.author_name,
      cagnotteData.author_phone,
      cagnotteData.images,
      cagnotteData.is_private,
      cagnotteData.show_target,
      cagnotteData.target_amount,
      cagnotteData.hide_amount,
      cagnotteData.show_participants,
      cagnotteData.numero_moov,
      cagnotteData.numero_mtn,
      cagnotteData.numero_orange,
      cagnotteData.numero_wave,
      cagnotteData.numero_airtel,
      cagnotteData.numero_autres,
      cagnotteData.status,
      cagnotteData.moderation_status
    ]);
    
    const cagnotte = result.rows[0];
    
    console.log('✅ Cagnotte de test créée:');
    console.log(`   • Titre: ${cagnotte.title}`);
    console.log(`   • ID: ${cagnotte.id}`);
    console.log(`   • URL: /cagnotte/${cagnotte.id}`);
    console.log(`   • Numéros de dépôt configurés pour le Bénin:`);
    console.log(`     - Moov Money: ${cagnotteData.numero_moov}`);
    console.log(`     - MTN Mobile Money: ${cagnotteData.numero_mtn}`);
    console.log(`     - Autres: ${cagnotteData.numero_autres}`);
    
    client.release();
    return cagnotte.id;
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de la cagnotte:', error);
    throw error;
  }
}

async function testUserAccount() {
  console.log('🧪 Test complet du système avec compte utilisateur...\n');
  
  try {
    // 1. Créer le compte de test
    const userId = await createTestAccount();
    
    // 2. Créer une cagnotte de test
    const cagnotteId = await createTestCagnotte(userId);
    
    // 3. Afficher les instructions de test
    console.log('\n📋 Instructions de test:');
    console.log('\n1️⃣ Connexion:');
    console.log(`   • Allez sur: http://localhost:3000/connexion`);
    console.log(`   • Email: ${testAccount.email}`);
    console.log(`   • Mot de passe: ${testAccount.password}`);
    
    console.log('\n2️⃣ Test de modification de cagnotte:');
    console.log(`   • Allez sur: http://localhost:3000/mes-cagnottes/${cagnotteId}/modifier`);
    console.log('   • Vérifiez que les champs de numéros de dépôt sont visibles');
    console.log('   • Modifiez les numéros et sauvegardez');
    
    console.log('\n3️⃣ Test de création de nouvelle cagnotte:');
    console.log('   • Allez sur: http://localhost:3000/creer');
    console.log('   • Créez une nouvelle cagnotte avec les numéros de dépôt');
    
    console.log('\n4️⃣ Test de paiement:');
    console.log(`   • Allez sur: http://localhost:3000/cagnotte/${cagnotteId}`);
    console.log('   • Testez le processus de don');
    console.log('   • Vérifiez que les opérateurs disponibles correspondent au pays (Bénin)');
    
    console.log('\n🎯 Points à vérifier:');
    console.log('   ✓ Les champs de numéros de dépôt sont visibles dans le formulaire de modification');
    console.log('   ✓ Les numéros existants sont pré-remplis correctement');
    console.log('   ✓ La validation fonctionne (au moins un numéro requis)');
    console.log('   ✓ Les opérateurs affichés correspondent au pays de l\'utilisateur');
    console.log('   ✓ La sauvegarde des modifications fonctionne');
    
    console.log('\n🚀 Le système est prêt pour les tests utilisateur !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Exécuter le test si le script est appelé directement
if (require.main === module) {
  testUserAccount()
    .then(() => {
      console.log('\n✅ Configuration de test terminée avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Échec de la configuration de test:', error);
      process.exit(1);
    });
}

module.exports = { createTestAccount, createTestCagnotte, testUserAccount };
