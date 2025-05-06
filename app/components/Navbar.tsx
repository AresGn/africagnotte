'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="py-4 bg-white shadow-md">
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-color)' }}>
            AfricaGnotte
          </h1>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="font-medium hover:text-amber-500 transition-colors">
            Accueil
          </Link>
          <Link href="/cagnottes" className="font-medium hover:text-amber-500 transition-colors">
            Découvrir
          </Link>
          <Link href="/creer" className="font-medium hover:text-amber-500 transition-colors">
            Créer une cagnotte
          </Link>
          <Link href="/comment-ca-marche" className="font-medium hover:text-amber-500 transition-colors">
            Comment ça marche
          </Link>
        </div>
        
        {/* CTA Buttons */}
        <div className="hidden md:flex space-x-3">
          <Link href="/connexion" className="btn-secondary">
            Connexion
          </Link>
          <Link href="/inscription" className="btn-primary">
            Inscription
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-4 pb-6 bg-white shadow-lg">
          <div className="flex flex-col space-y-3">
            <Link 
              href="/" 
              className="font-medium py-2 hover:text-amber-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link 
              href="/cagnottes" 
              className="font-medium py-2 hover:text-amber-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Découvrir
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
          
          <div className="flex flex-col mt-4 pt-4 space-y-3 border-t">
            <Link 
              href="/connexion" 
              className="btn-secondary w-full text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Connexion
            </Link>
            <Link 
              href="/inscription" 
              className="btn-primary w-full text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Inscription
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
} 