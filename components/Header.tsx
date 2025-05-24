'use client';

import Link from 'next/link';
// import UserAuthStatus from './UserAuthStatus'; // Supprimé

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="font-bold text-2xl text-primary">
              AfriCagnotte
            </Link>
          </div>
          <nav className="hidden md:flex space-x-4">
            <Link href="/" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary">
              Accueil
            </Link>
            <Link href="/cagnotte" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary">
              Cagnottes
            </Link>
            <Link href="/creer" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary">
              Créer
            </Link>
            <Link href="/recherche" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary">
              Rechercher
            </Link>
          </nav>
          {/* Emplacement pour UserAuthStatus, à redéfinir si nécessaire */}
          {/* <div className="flex items-center">
            <UserAuthStatus />
          </div> */}
        </div>
      </div>
    </header>
  );
} 