import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // Pour manipuler les cookies

export async function POST() {
  try {
    // Supprimer le cookie 'token'
    // Pour supprimer un cookie, on le réécrit avec une date d'expiration passée
    // et une valeur vide, ou on utilise la méthode .delete() si disponible et appropriée.
    const cookieStore = cookies();
    cookieStore.set({
      name: 'token',
      value: '',
      path: '/',
      expires: new Date(0), // Date dans le passé
      httpOnly: true,
      sameSite: 'lax', // Doit correspondre aux options utilisées lors de la création
      // secure: process.env.NODE_ENV === 'production', // Décommentez en production si HTTPS
    });

    // Ou, plus simplement avec Next.js 13+ (si cookies().delete() fonctionne bien avec HttpOnly)
    // cookieStore.delete('token');
    // Pour être sûr, la méthode set avec expiration passée est plus robuste.

    return NextResponse.json({ message: 'Déconnexion réussie.' }, { status: 200 });
  } catch (error) {
    console.error('Signout error:', error);
    return NextResponse.json({ error: 'Erreur lors de la déconnexion.' }, { status: 500 });
  }
} 