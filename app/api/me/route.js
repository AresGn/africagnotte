import { NextResponse } from 'next/server';
// import { headers } from 'next/headers'; // Supprimé
import pool from '@/lib/db'; // Importer pool

export async function GET(request) {
  try {
    const headersList = request.headers;
    const userId = headersList.get('x-user-id');
    const userEmail = headersList.get('x-user-email');

    if (!userId || !userEmail) {
      // Cela ne devrait pas arriver si le middleware fonctionne correctement
      // et que la route est bien protégée par le matcher du middleware.
      console.error('/api/me: Missing user information in headers after middleware processing.');
      return NextResponse.json({ error: 'User information not found in request headers.' }, { status: 500 });
    }

    let userProfile = {};
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT id, first_name, last_name, username, phone_number, country FROM profiles WHERE id = $1', [userId]);
      if (result.rows.length > 0) {
        userProfile = result.rows[0];
      }
      client.release();
    } catch (dbError) {
      console.error('Error fetching user profile from DB:', dbError);
      // Ne pas bloquer la réponse si le profil n'est pas trouvé, renvoyer au moins id/email
    }

    return NextResponse.json({
      message: 'Successfully accessed protected user information.',
      user: {
        id: userId,
        email: userEmail,
        ...userProfile, // Fusionner les informations du profil
      }
    }, { status: 200 });

  } catch (error) {
    console.error('/api/me error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 