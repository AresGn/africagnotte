import { jwtVerify } from 'jose';

interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * Vérifie et décode un token JWT
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const jwtSecretString = process.env.JWT_SECRET;
    
    if (!jwtSecretString) {
      console.error('JWT_SECRET is not defined');
      return null;
    }

    const secretKey = new TextEncoder().encode(jwtSecretString);
    const { payload } = await jwtVerify(token, secretKey);

    const userId = payload.userId as string;
    const email = payload.email as string;

    if (!userId || !email) {
      console.error('Token payload is missing userId or email:', payload);
      return null;
    }

    return {
      userId,
      email,
      iat: payload.iat as number,
      exp: payload.exp as number
    };

  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}
