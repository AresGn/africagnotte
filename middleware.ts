import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify, errors as JoseErrors } from 'jose'; // Import de jwtVerify et des types d'erreur
// import { TextEncoder } from 'util'; // Supprimé: TextEncoder est global dans l'Edge runtime

// const JWT_SECRET = process.env.JWT_SECRET; // Commenté pour utiliser process.env directement

// Définissez ici les chemins que vous souhaitez protéger.
// Vous pouvez utiliser des expressions régulières.
// Par exemple, pour protéger toutes les routes sous /api/secure/:
// const protectedPaths = ['/api/secure/:path*'];
// Ou des routes spécifiques :
// const protectedPaths = ['/dashboard', '/profile'];

// Pour l'instant, nous allons créer une route de test /api/me
// et le matcher la ciblera pour la démonstration.
export const config = {
  matcher: ['/api/me/:path*', '/api/cagnottes/:path*', '/api/profile/:path*'], // Exemple: protège /api/me et tout ce qui suit, et ajoute /api/cagnottes et /api/profile
};

async function getKey(secret: string) {
  return new TextEncoder().encode(secret); // Devrait maintenant utiliser le TextEncoder global
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const jwtSecretString = process.env.JWT_SECRET;

  if (!jwtSecretString) {
    console.error('[Middleware] JWT_SECRET is not defined in .env file');
    return NextResponse.json({ error: 'Internal Server Error - JWT configuration missing' }, { status: 500 });
  }

  const authHeader = request.headers.get('Authorization');
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  // If token is not in Authorization header, try to get it from cookies
  if (!token) {
    token = request.cookies.get('token')?.value;
    if (token) { // Check if token was actually found and assigned
      console.log('[Middleware] Token found in cookie');
    }
  }

  if (!token) {
    console.log(`[Middleware] No token found for path ${pathname}`);
    return NextResponse.json({ error: 'Authentication required: No token provided.' }, { status: 401 });
  }

  try {
    const secretKey = await getKey(jwtSecretString);
    const { payload } = await jwtVerify(token, secretKey, {
      // Si vous avez utilisé des algorithmes spécifiques ou un "issuer" lors de la signature
      // avec jsonwebtoken (ce que nous n'avons pas fait explicitement, donc HS256 par défaut),
      // vous pourriez avoir besoin de les spécifier ici.
      // Pour l'instant, laissons les valeurs par défaut de jose, qui devraient correspondre.
      // algorithms: ['HS256'] // Optionnel si vous voulez être explicite
    });

    const userId = payload.userId as string;
    const userEmail = payload.email as string;

    if (!userId || !userEmail) {
        console.error('[Middleware] Token payload is missing userId or email:', payload);
        return NextResponse.json({ error: 'Authentication failed: Invalid token payload.' }, { status: 401 });
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', userId);
    requestHeaders.set('x-user-email', userEmail);

    console.log(`[Middleware] Token valid for ${userEmail} accessing ${pathname}`);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    let errorMessage = 'Invalid token.';
    if (error instanceof JoseErrors.JWTExpired) {
        errorMessage = 'Token expired.';
    } else if (error instanceof JoseErrors.JWTClaimValidationFailed) {
        errorMessage = 'Token claim validation failed.';
    } else if (error instanceof JoseErrors.JWSInvalid) { // Erreur générique pour signature invalide avec jose
        errorMessage = 'Invalid token signature.';
    } else {
        // Pour d'autres erreurs jose ou des erreurs inattendues
        console.error(`[Middleware] Token verification error for path ${pathname}:`, error);
    }
    return NextResponse.json({ error: `Authentication failed: ${errorMessage}` }, { status: 401 });
  }
} 