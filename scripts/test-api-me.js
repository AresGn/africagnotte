const fetch = require('node-fetch');

async function testApiMe() {
  try {
    console.log('🧪 Test de l\'API /api/me...\n');
    
    // Étape 1: Se connecter pour obtenir un token
    console.log('1️⃣ Connexion avec les identifiants admin...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'alex.gnimagnon@africagnotte.com',
        password: 'admin123'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('❌ Échec de la connexion');
      const errorData = await loginResponse.text();
      console.log('Erreur:', errorData);
      return;
    }
    
    console.log('✅ Connexion réussie');
    
    // Récupérer les cookies
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('🍪 Cookies reçus:', cookies);
    
    // Étape 2: Appeler /api/me avec le token
    console.log('\n2️⃣ Appel de /api/me...');
    const meResponse = await fetch('http://localhost:3000/api/me', {
      method: 'GET',
      headers: {
        'Cookie': cookies || ''
      }
    });
    
    if (!meResponse.ok) {
      console.log('❌ Échec de l\'appel /api/me');
      const errorData = await meResponse.text();
      console.log('Erreur:', errorData);
      return;
    }
    
    const userData = await meResponse.json();
    console.log('✅ Données utilisateur récupérées:');
    console.log(JSON.stringify(userData, null, 2));
    
    // Vérifier si le rôle est présent
    if (userData.user && userData.user.role) {
      console.log(`\n🎯 Rôle détecté: ${userData.user.role}`);
      if (userData.user.role === 'super_admin' || userData.user.role === 'admin' || userData.user.role === 'moderator') {
        console.log('✅ L\'utilisateur devrait être redirigé vers /admin');
      } else {
        console.log('ℹ️ L\'utilisateur devrait être redirigé vers /');
      }
    } else {
      console.log('❌ Aucun rôle trouvé dans les données utilisateur');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

testApiMe();
