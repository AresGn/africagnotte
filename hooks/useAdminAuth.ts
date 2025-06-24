'use client';

import { useState, useEffect } from 'react';

// Types pour l'admin côté client (sans dépendances serveur)
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

// Hiérarchie des rôles pour vérifications côté client
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
 * Hook pour gérer l'authentification admin côté client
 */
export function useAdminAuth() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/me', {
        credentials: 'include'
      });

      if (response.ok) {
        const userData = await response.json();
        setAdminUser(userData);
      } else if (response.status === 401) {
        setError('Accès non autorisé');
        setAdminUser(null);
      } else {
        setError('Erreur lors de la vérification des permissions');
        setAdminUser(null);
      }
    } catch (err) {
      console.error('Erreur lors de la vérification admin:', err);
      setError('Erreur de connexion');
      setAdminUser(null);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (requiredRole: UserRole): boolean => {
    return checkUserRole(adminUser, requiredRole);
  };

  const hasPermissionCheck = (permission: string): boolean => {
    return checkUserPermission(adminUser, permission);
  };

  return {
    adminUser,
    loading,
    error,
    hasRole,
    hasPermission: hasPermissionCheck,
    checkAdminAccess
  };
}
