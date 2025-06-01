'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import { supabase } from '../../lib/supabase'; // Supprimé
import { toast, Toaster } from 'react-hot-toast';

// Définir le type Cagnotte (identique à celui de la page de détail)
interface Cagnotte { // L'interface a été renommée pour éviter conflit avec le nom du composant
  id: string;
  title: string;
  custom_url: string | null;
  category: string;
  description: string;
  images: string[]; // API renvoie déjà un tableau
  video: string | null;
  is_private: boolean;
  show_target: boolean;
  target_amount: number | null;
  hide_amount: boolean;
  show_participants: boolean;
  current_amount: number;
  created_at: string;
  updated_at?: string;
}

export default function CagnottesPage() { // Nom du composant changé pour éviter conflit avec le type
  const [cagnottes, setCagnottes] = useState<Cagnotte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCagnottes() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/cagnottes/public'); // Appel à la nouvelle API
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Impossible de charger les cagnottes publiques');
        }
        
        const data: Cagnotte[] = await response.json();
        setCagnottes(data);

      } catch (err) {
        console.error('Erreur lors du chargement des cagnottes:', err);
        setError((err as Error).message || 'Impossible de charger les cagnottes');
        toast.error((err as Error).message || 'Erreur lors du chargement des cagnottes');
      } finally {
        setLoading(false);
      }
    }

    fetchCagnottes();
  }, []);

  if (loading) {
    return (
      <div className="py-10 text-center">
        <p className="text-xl">Chargement des cagnottes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <p className="text-xl text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-lime-500 text-white px-4 py-2 rounded"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <main className="py-6 sm:py-10 bg-gray-50">
      <Toaster position="top-center" />
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Toutes les cagnottes</h1>
          <Link href="/creer" className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-md">
            Créer une cagnotte
          </Link>
        </div>

        {cagnottes.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl">Aucune cagnotte n&apos;a encore été créée</p>
            <Link href="/creer" className="mt-4 inline-block bg-lime-500 hover:bg-lime-600 text-white px-6 py-3 rounded-md">
              Créer la première cagnotte
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cagnottes.map((cagnotte: Cagnotte) => (
              <Link
                href={cagnotte.custom_url ? `/c/${cagnotte.custom_url}` : `/c/${cagnotte.id}`}
                key={cagnotte.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={cagnotte.images[0]}
                    alt={cagnotte.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">
                    {cagnotte.category}
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2 line-clamp-2">{cagnotte.title}</h2>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{cagnotte.description}</p>
                  
                  {!cagnotte.hide_amount && (
                    <div className="mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-lime-500 h-2.5 rounded-full" 
                          style={{ 
                            width: `${cagnotte.show_target && cagnotte.target_amount ? Math.min(100, (cagnotte.current_amount / cagnotte.target_amount) * 100) : 100}%` 
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1 text-sm">
                        <span className="font-semibold">{cagnotte.current_amount}FCFA</span>
                        {cagnotte.show_target && cagnotte.target_amount && (
                          <span className="text-gray-600">Objectif: {cagnotte.target_amount}FCFA</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 