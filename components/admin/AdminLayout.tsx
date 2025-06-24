'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiHome,
  FiFileText,
  FiUsers,
  FiDollarSign,
  FiBarChart,
  FiShield,
  FiMenu,
  FiX,
  FiLogOut,
  FiSettings
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminAuth, UserRole, AdminUser, hasRequiredRole } from '../../hooks/useAdminAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRole: UserRole;
  badge?: number;
}

const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: FiHome,
    requiredRole: UserRole.MODERATOR
  },
  {
    name: 'Cagnottes',
    href: '/admin/cagnottes',
    icon: FiFileText,
    requiredRole: UserRole.MODERATOR
  },
  {
    name: 'Modération',
    href: '/admin/moderation',
    icon: FiShield,
    requiredRole: UserRole.MODERATOR
  },
  {
    name: 'Utilisateurs',
    href: '/admin/utilisateurs',
    icon: FiUsers,
    requiredRole: UserRole.ADMIN
  },
  {
    name: 'Transactions',
    href: '/admin/transactions',
    icon: FiDollarSign,
    requiredRole: UserRole.ADMIN
  },
  {
    name: 'Rapports',
    href: '/admin/rapports',
    icon: FiBarChart,
    requiredRole: UserRole.ADMIN
  },
  {
    name: 'Paramètres',
    href: '/admin/parametres',
    icon: FiSettings,
    requiredRole: UserRole.SUPER_ADMIN
  }
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { adminUser, loading, error } = useAdminAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // Rediriger si pas d'utilisateur connecté
  if (!user && !loading) {
    router.push('/connexion?redirect=/admin');
    return null;
  }

  // Rediriger si erreur d'autorisation
  if (error && !loading) {
    router.push('/connexion?redirect=/admin');
    return null;
  }

  // Filtrer les éléments du menu selon les permissions
  const visibleMenuItems = menuItems.filter(item =>
    adminUser && hasRequiredRole(adminUser.role, item.requiredRole)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!adminUser) {
    return null; // Redirection en cours
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center">
                <span className="text-white font-medium">
                  {adminUser.firstName?.[0] || adminUser.username[0].toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {adminUser.firstName && adminUser.lastName
                  ? `${adminUser.firstName} ${adminUser.lastName}`
                  : adminUser.username
                }
              </p>
              <p className="text-xs text-gray-500 capitalize">{adminUser.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-2">
          {visibleMenuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md mb-1
                  ${isActive 
                    ? 'bg-amber-100 text-amber-900' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={`
                  mr-3 h-5 w-5 flex-shrink-0
                  ${isActive ? 'text-amber-500' : 'text-gray-400 group-hover:text-gray-500'}
                `} />
                {item.name}
                {item.badge && (
                  <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
          >
            <FiLogOut className="mr-3 h-5 w-5 text-gray-400" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Retour au site
              </Link>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
