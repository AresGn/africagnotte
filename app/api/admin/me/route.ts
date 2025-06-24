import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRole, UserRole } from '../../../../lib/adminAuth';

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification admin (minimum moderator)
    const authResult = await verifyAdminRole(request, UserRole.MODERATOR);
    
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error || 'Accès non autorisé' },
        { status: 401 }
      );
    }

    // Retourner les informations de l'utilisateur admin
    return NextResponse.json(authResult.user);

  } catch (error) {
    console.error('Erreur lors de la récupération des informations admin:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
