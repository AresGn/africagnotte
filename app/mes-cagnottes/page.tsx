'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';

export default function MesCagnottesPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté et charger ses cagnottes
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/connexion';
      }
      setLoading(false);
    };
    
    checkUser();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container-custom pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-8">Mes Cagnottes</h1>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" style={{ color: 'var(--primary-color)' }}></div>
            <p className="mt-4">Chargement de vos cagnottes...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Affichage des cagnottes (à implémenter) */}
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <p className="text-lg">Vous n&apos;avez pas encore créé de cagnotte.</p>
              <div className="mt-4">
                <a 
                  href="/creer" 
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ backgroundColor: 'var(--primary-color)', '--tw-ring-color': 'var(--primary-color)' } as React.CSSProperties}>
                  Créer ma première cagnotte
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 