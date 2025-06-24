'use client';

import { useState, useEffect } from 'react';
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
  FiSettings,
  FiAlertTriangle
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface AdminUser {
  id: string;
  username: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: FiHome
  },
  {
    name: 'Cagnottes',
    href: '/admin/cagnottes',
    icon: FiFileText
  },
  {
    name: 'Modération',
    href: '/admin/moderation',
    icon: FiShield
  },
  {
    name: 'Utilisateurs',
    href: '/admin/utilisateurs',
    icon: FiUsers
  },
  {
    name: 'Transactions',
    href: '/admin/transactions',
    icon: FiDollarSign
  },
  {
    name: 'Rapports',
    href: '/admin/rapports',
    icon: FiBarChart
  },
  {
    name: 'Paramètres',
    href: '/admin/parametres',
    icon: FiSettings
  }
];

export default function SimpleAdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  // Vérifier les permissions admin au chargement
  useEffect(() => {
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
          router.push('/connexion?redirect=/admin');
        } else {
          setError('Erreur lors de la vérification des permissions');
          router.push('/connexion?redirect=/admin');
        }
      } catch (err) {
        console.error('Erreur lors de la vérification admin:', err);
        setError('Erreur de connexion');
        router.push('/connexion?redirect=/admin');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      checkAdminAccess();
    } else {
      router.push('/connexion?redirect=/admin');
    }
  }, [user, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification des permissions admin...</p>
        </div>
      </div>
    );
  }

  if (error || !adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <FiAlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-red-800 mb-2">Accès Refusé</h2>
            <p className="text-red-600 mb-4">{error || 'Vous n\'avez pas les permissions pour accéder à cette page.'}</p>
            <Link
              href="/connexion?redirect=/admin"
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        </div>
      )}

      {/* Sidebar - Complètement fixe */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative lg:z-auto
      `}>
        {/* Header de la sidebar */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-gradient-to-r from-amber-500 to-orange-500">
          <h1 className="text-xl font-bold text-white">🛡️ Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-white hover:bg-white hover:bg-opacity-20"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 bg-amber-50">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-amber-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {adminUser.firstName?.[0] || adminUser.username[0].toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-gray-900">
                {adminUser.firstName && adminUser.lastName
                  ? `${adminUser.firstName} ${adminUser.lastName}`
                  : adminUser.username
                }
              </p>
              <p className="text-xs text-amber-600 font-semibold capitalize">👑 {adminUser.role}</p>
              <p className="text-xs text-gray-500">Dashboard Administrateur</p>
            </div>
          </div>
        </div>

        {/* Navigation - Avec défilement interne si nécessaire */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                  ${isActive
                    ? 'bg-amber-100 text-amber-900 border-l-4 border-amber-500 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
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
                  <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button - Fixe en bas */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-3 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
          >
            <FiLogOut className="mr-3 h-5 w-5 text-gray-400" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content - Zone défilable */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Top Bar - Fixe */}
        <div className="flex-shrink-0 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <FiMenu className="h-6 w-6" />
              </button>
              <div className="lg:hidden ml-2">
                <h1 className="text-lg font-semibold text-gray-900">Dashboard Admin</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center space-x-2">
                <span className="text-sm text-amber-600 font-medium">🛡️ Mode Administrateur</span>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-600">
                  Connecté en tant que {adminUser.firstName || adminUser.username}
                </span>
              </div>
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md transition-colors"
              >
                ← Retour au site
              </Link>
            </div>
          </div>
        </div>

        {/* Page Content - Seule zone défilable */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
