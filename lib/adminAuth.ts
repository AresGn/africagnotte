import { NextRequest } from 'next/server';
import { verifyToken } from './auth';
import pool from './db';

// Note: Ce fichier est uniquement pour le serveur
// Pour les composants client, utilisez hooks/useAdminAuth.ts

// Types pour les rôles et permissions
export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export interface AdminUser {
  id: string;
  username: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
}

export interface AdminAuthResult {
  authorized: boolean;
  user?: AdminUser;
  error?: string;
}

// Hiérarchie des rôles (index plus élevé = plus de permissions)
const ROLE_HIERARCHY: UserRole[] = [
  UserRole.USER,
  UserRole.MODERATOR,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN
];

// Permissions par rôle
export const PERMISSIONS = {
  [UserRole.USER]: [
    'create_cagnotte',
    'edit_own_cagnotte',
    'view_own_cagnotte'
  ],
  [UserRole.MODERATOR]: [
    'view_admin_dashboard',
    'moderate_cagnottes',
    'view_reports',
    'manage_reports'
  ],
  [UserRole.ADMIN]: [
    'manage_users',
    'manage_transactions',
    'view_analytics',
    'export_data'
  ],
  [UserRole.SUPER_ADMIN]: [
    'all_permissions',
    'manage_admins',
    'system_settings'
  ]
};

/**
 * Vérifie si un utilisateur a un rôle suffisant
 */
export function hasRequiredRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole);
  const requiredRoleIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  return userRoleIndex >= requiredRoleIndex;
}

/**
 * Vérifie si un utilisateur a une permission spécifique
 */
export function hasPermission(userRole: UserRole, permission: string): boolean {
  // Super admin a toutes les permissions
  if (userRole === UserRole.SUPER_ADMIN) {
    return true;
  }

  // Vérifier les permissions du rôle et des rôles inférieurs
  for (let i = ROLE_HIERARCHY.indexOf(userRole); i >= 0; i--) {
    const role = ROLE_HIERARCHY[i];
    if (PERMISSIONS[role]?.includes(permission)) {
      return true;
    }
  }

  return false;
}

/**
 * Vérifie l'authentification et les permissions admin
 */
export async function verifyAdminRole(
  request: NextRequest, 
  requiredRole: UserRole = UserRole.MODERATOR
): Promise<AdminAuthResult> {
  try {
    // Récupérer le token
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return { authorized: false, error: 'Token manquant' };
    }

    // Vérifier le token
    const decoded = await verifyToken(token);
    if (!decoded) {
      return { authorized: false, error: 'Token invalide' };
    }

    // Récupérer les informations utilisateur avec le rôle
    const result = await pool.query(
      `SELECT id, username, role, first_name, last_name
       FROM profiles
       WHERE id = $1`,
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return { authorized: false, error: 'Utilisateur non trouvé' };
    }

    const userData = result.rows[0];
    const userRole = userData.role as UserRole;

    // Vérifier si l'utilisateur a le rôle requis
    if (!hasRequiredRole(userRole, requiredRole)) {
      return {
        authorized: false,
        error: `Permissions insuffisantes. Rôle requis: ${requiredRole}, rôle actuel: ${userRole}`
      };
    }

    // Retourner les informations utilisateur
    const adminUser: AdminUser = {
      id: userData.id,
      username: userData.username,
      role: userRole,
      firstName: userData.first_name,
      lastName: userData.last_name
    };

    return { 
      authorized: true, 
      user: adminUser
    };

  } catch (error) {
    console.error('Erreur lors de la vérification admin:', error);
    return { authorized: false, error: 'Erreur de vérification' };
  }
}

/**
 * Middleware pour les routes API admin
 */
export async function withAdminAuth(
  request: NextRequest,
  requiredRole: UserRole = UserRole.MODERATOR
) {
  const authResult = await verifyAdminRole(request, requiredRole);
  
  if (!authResult.authorized) {
    return {
      success: false,
      error: authResult.error,
      status: 401
    };
  }

  return {
    success: true,
    user: authResult.user
  };
}

/**
 * Utilitaire pour vérifier les permissions dans les composants
 */
export function checkUserPermission(user: AdminUser | null, permission: string): boolean {
  if (!user) return false;
  return hasPermission(user.role, permission);
}

/**
 * Utilitaire pour vérifier les rôles dans les composants
 */
export function checkUserRole(user: AdminUser | null, requiredRole: UserRole): boolean {
  if (!user) return false;
  return hasRequiredRole(user.role, requiredRole);
}

/**
 * Hook pour récupérer les informations admin de l'utilisateur connecté
 */
export async function getCurrentAdminUser(request: NextRequest): Promise<AdminUser | null> {
  const authResult = await verifyAdminRole(request, UserRole.USER);
  return authResult.authorized ? authResult.user! : null;
}
