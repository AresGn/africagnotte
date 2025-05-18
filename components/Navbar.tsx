'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

// Définir une interface pour le profil utilisateur
interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  phone_number?: string;
  country?: string;
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Fonction pour rafraîchir les données utilisateur
  const refreshUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setUserProfile(profile);
    } else {
      setUserProfile(null);
    }
  };

  // Récupérer l'état d'authentification à chaque rendu
  useEffect(() => {
    refreshUserData();
    
    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      refreshUserData();
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
    setProfileMenuOpen(false);
    window.location.href = '/';
  };

  return (
    <nav className="py-4 bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container-custom flex items-center justify-between">
        {/* Logo with Link to Home */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity" style={{ color: 'var(--primary-color)' }}>
            AfricaGnotte
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          <Link href="/recherche" className="font-medium hover:text-amber-500 transition-colors">
            Rechercher une cagnotte
          </Link>
          <Link href="/creer" className="font-medium hover:text-amber-500 transition-colors">
            Créer une cagnotte
          </Link>
          <Link href="/comment-ca-marche" className="font-medium hover:text-amber-500 transition-colors">
            Comment ça marche
          </Link>
        </div>
        
        {/* CTA Buttons or User Profile */}
        {!user ? (
          // Utilisateur non connecté: Afficher les boutons Connexion/Inscription
          <div className="hidden md:flex space-x-3">
            <Link href="/connexion" className="btn-secondary">
              Connexion
            </Link>
            <Link href="/inscription" className="btn-primary">
              Inscription
            </Link>
          </div>
        ) : (
          // Utilisateur connecté: Afficher le pseudo et le menu déroulant
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications (à implémenter plus tard) */}
            <button className="relative" aria-label="Notifications">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {/* Indicateur de notifications (cercle rouge) */}
              <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>
            
            {/* Menu profil utilisateur */}
            <div className="relative">
              <button 
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center space-x-2 font-medium focus:outline-none"
                aria-label="Menu profil"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white">
                  {userProfile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </div>
                <span>{userProfile?.username || "Utilisateur"}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Menu déroulant */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link href="/profil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Mon profil
                  </Link>
                  <Link href="/mes-cagnottes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Mes cagnottes
                  </Link>
                  <Link href="/parametres" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Paramètres
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Mobile Menu Button */}
        <div className="flex md:hidden space-x-3 items-center">
          {user ? (
            // Pour utilisateurs connectés sur mobile
            <button 
              className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {userProfile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
            </button>
          ) : (
            // Pour utilisateurs non connectés sur mobile
            <>
              <Link href="/connexion" className="btn-secondary text-sm px-2 py-1">
                Connexion
              </Link>
              <button 
                className="flex items-center justify-center" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-4 pb-6 bg-white shadow-lg fixed top-16 left-0 right-0 z-50">
          <div className="flex flex-col space-y-3">
            <Link 
              href="/recherche" 
              className="font-medium py-2 hover:text-amber-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Rechercher une cagnotte
            </Link>
            <Link 
              href="/creer" 
              className="font-medium py-2 hover:text-amber-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Créer une cagnotte
            </Link>
            <Link 
              href="/comment-ca-marche" 
              className="font-medium py-2 hover:text-amber-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Comment ça marche
            </Link>
          </div>
          
          {user ? (
            // Options supplémentaires pour l'utilisateur connecté
            <div className="flex flex-col mt-4 pt-4 space-y-3 border-t">
              <Link 
                href="/profil" 
                className="font-medium py-2 hover:text-amber-500 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mon profil
              </Link>
              <Link 
                href="/mes-cagnottes" 
                className="font-medium py-2 hover:text-amber-500 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mes cagnottes
              </Link>
              <Link 
                href="/parametres" 
                className="font-medium py-2 hover:text-amber-500 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Paramètres
              </Link>
              <button
                onClick={handleLogout}
                className="font-medium py-2 text-left text-red-500 hover:text-red-600 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            // Option d'inscription pour utilisateur non connecté
            <div className="flex flex-col mt-4 pt-4 space-y-3 border-t">
              <Link 
                href="/inscription" 
                className="btn-primary w-full text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inscription
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
} 