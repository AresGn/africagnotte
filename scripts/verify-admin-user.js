const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function verifyAdminUser() {
  try {
    console.log('🔍 Vérification de l\'utilisateur admin...\n');
    
    // Vérifier dans auth.users
    const authResult = await pool.query(
      'SELECT id, email, created_at FROM auth.users WHERE email = $1',
      ['alex.gnimagnon@africagnotte.com']
    );
    
    if (authResult.rows.length === 0) {
      console.log('❌ Utilisateur admin non trouvé dans auth.users');
      return;
    }
    
    const authUser = authResult.rows[0];
    console.log('✅ Utilisateur trouvé dans auth.users:');
    console.log(`   - ID: ${authUser.id}`);
    console.log(`   - Email: ${authUser.email}`);
    console.log(`   - Créé le: ${authUser.created_at}\n`);
    
    // Vérifier dans profiles
    const profileResult = await pool.query(
      'SELECT id, first_name, last_name, username, role, phone_number, country FROM profiles WHERE id = $1',
      [authUser.id]
    );
    
    if (profileResult.rows.length === 0) {
      console.log('❌ Profil admin non trouvé dans profiles');
      return;
    }
    
    const profile = profileResult.rows[0];
    console.log('✅ Profil trouvé dans profiles:');
    console.log(`   - ID: ${profile.id}`);
    console.log(`   - Nom: ${profile.first_name} ${profile.last_name}`);
    console.log(`   - Username: ${profile.username}`);
    console.log(`   - Rôle: ${profile.role} ${profile.role === 'super_admin' ? '👑' : ''}`);
    console.log(`   - Téléphone: ${profile.phone_number}`);
    console.log(`   - Pays: ${profile.country}\n`);
    
    // Vérifier tous les rôles disponibles
    const rolesResult = await pool.query(
      'SELECT role, COUNT(*) as count FROM profiles GROUP BY role ORDER BY count DESC'
    );
    
    console.log('📊 Répartition des rôles:');
    rolesResult.rows.forEach(row => {
      const roleIcon = row.role === 'super_admin' ? '👑' : 
                      row.role === 'admin' ? '🛡️' : 
                      row.role === 'moderator' ? '⚖️' : '👤';
      console.log(`   ${roleIcon} ${row.role}: ${row.count} utilisateur(s)`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
  } finally {
    await pool.end();
  }
}

verifyAdminUser();
