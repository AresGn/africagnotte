import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('[SignOut Route] Déconnexion demandée');

    // Créer la réponse
    const response = NextResponse.json({ message: 'Déconnexion réussie.' }, { status: 200 });

    // Supprimer le cookie 'token' en définissant une date d'expiration passée
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(0), // Date dans le passé pour supprimer le cookie
      path: '/',
      sameSite: 'lax',
    });

    console.log('[SignOut Route] Cookie token supprimé');
    return response;

  } catch (error) {
    console.error('[SignOut Route] Erreur lors de la déconnexion:', error);
    return NextResponse.json({ error: 'Erreur lors de la déconnexion.' }, { status: 500 });
  }
}