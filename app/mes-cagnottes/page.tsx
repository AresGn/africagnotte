'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/navigation';

interface Cagnotte {
  id: string;
  title: string;
  description?: string;
  target_amount?: number;
  current_amount?: number;
  created_at?: string;
  category?: string;
  status?: string;
  custom_url?: string;
  images?: string | string[];
  // Ajoutez d'autres champs si nécessaire
}

export default function MesCagnottesPage() {
  const { user, isLoading: authIsLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [cagnottes, setCagnottes] = useState<Cagnotte[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authIsLoading) {
      // Attendre que l'authentification soit chargée
      setPageLoading(true);
      return;
    }

    if (!isAuthenticated) {
      router.push('/connexion');
      return;
    }

    // Si authentifié, charger les cagnottes
    if (user) {
      const fetchCagnottes = async () => {
        setPageLoading(true);
        setError(null);
        try {
          const response = await fetch('/api/cagnottes', { credentials: 'include' });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Échec du chargement des cagnottes');
          }
          const data: Cagnotte[] = await response.json();
          setCagnottes(data);
        } catch (err) {
          console.error("Erreur lors du chargement des cagnottes:", err);
          setError((err as Error).message || 'Une erreur est survenue.');
        } finally {
          setPageLoading(false);
        }
      };
      fetchCagnottes();
    } else {
      // Cas improbable si isAuthenticated est true mais user est null, mais gérons-le.
      setPageLoading(false);
    }
  }, [user, authIsLoading, isAuthenticated, router]);

  return (
    <>
      <Navbar />
      <div className="container-custom pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-8">Mes Cagnottes</h1>
        
        {pageLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" style={{ color: 'var(--primary-color)' }}></div>
            <p className="mt-4">Chargement de vos cagnottes...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Erreur: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : cagnottes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cagnottes.map((cagnotte) => (
              <div key={cagnotte.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                {cagnotte.images && (
                  <img 
                    src={Array.isArray(cagnotte.images) ? cagnotte.images[0] : cagnotte.images} 
                    alt={cagnotte.title} 
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold">{cagnotte.title}</h2>
                    {cagnotte.status && (
                      <span 
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          cagnotte.status === 'active' ? 'bg-green-100 text-green-800' : 
                          cagnotte.status === 'ended' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {cagnotte.status}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm mb-1 truncate">
                    {cagnotte.description || 'Pas de description'}
                  </p>
                  {cagnotte.category && (
                    <p className="text-xs text-gray-500 mb-3"><span className="font-semibold">Catégorie:</span> {cagnotte.category}</p>
                  )}
                  <div className="text-sm text-gray-600 mb-1">
                    Objectif: {cagnotte.target_amount ? `${cagnotte.target_amount} €` : 'N/A'}
                  </div>
                  <div className="text-sm text-amber-600 font-semibold mb-4">
                    Collecté: {cagnotte.current_amount ? `${cagnotte.current_amount} €` : '0 €'}
                  </div>
                  {cagnotte.custom_url && (
                    <a href={`/c/${cagnotte.custom_url}`} className="text-blue-600 hover:underline text-sm block mt-2">Voir la cagnotte</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
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
        )}
      </div>
    </>
  );
} 