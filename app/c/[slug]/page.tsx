'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import { useRouter } from 'next/navigation'; // useRouter n'est plus utilisé ici directement
// import { supabase } from '../../../lib/supabase'; // Supprimé
import { toast, Toaster } from 'react-hot-toast';

type CagnotteDetails = {
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
  updated_at?: string; // Ajouté car présent dans la requête API
};

export default function CagnottePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  // const router = useRouter(); // Non utilisé ici
  const [cagnotte, setCagnotte] = useState<CagnotteDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchCagnotteDetails() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/cagnottes/detail/${slug}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Cagnotte introuvable');
        }
        
        const data: CagnotteDetails = await response.json();
        setCagnotte(data);

      } catch (err) {
        console.error('Erreur lors du chargement des détails:', err);
        setError((err as Error).message || 'Impossible de charger cette cagnotte');
        toast.error((err as Error).message || 'Cette cagnotte est introuvable ou n\'existe pas');
      } finally {
        setLoading(false);
      }
    }
    
    if (slug) { // S'assurer que slug est défini avant de fetcher
        fetchCagnotteDetails();
    }
  }, [slug]);
  
  if (loading) {
    return (
      <div className="py-10 text-center">
        <p className="text-xl">Chargement de la cagnotte...</p>
      </div>
    );
  }
  
  if (error || !cagnotte) {
    return (
      <div className="py-10 text-center">
        <p className="text-xl text-red-500">{error || 'Cagnotte introuvable'}</p>
        <Link
          href="/cagnottes"
          className="mt-4 inline-block bg-lime-500 text-white px-4 py-2 rounded"
        >
          Voir toutes les cagnottes
        </Link>
      </div>
    );
  }
  
  return (
    <main className="py-6 sm:py-10 bg-gray-50">
      <Toaster position="top-center" />
      <div className="container mx-auto max-w-4xl px-4">
        {/* Images carrousel */}
        <div className="mb-6 relative h-64 sm:h-96 bg-gray-200 rounded-lg overflow-hidden">
          <Image
            src={cagnotte.images[0]}
            alt={cagnotte.title}
            fill
            className="object-cover"
          />
        </div>
        
        {/* En-tête de la cagnotte */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {cagnotte.category}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{cagnotte.title}</h1>
        </div>
        
        {/* Barre de progression */}
        {!cagnotte.hide_amount && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <div className="mb-2">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-lime-500 h-3 rounded-full"
                  style={{
                    width: `${cagnotte.show_target && cagnotte.target_amount ? Math.min(100, (cagnotte.current_amount / cagnotte.target_amount) * 100) : 100}%`
                  }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between mb-1">
              <div>
                <p className="text-2xl font-bold">{cagnotte.current_amount} €</p>
                <p className="text-gray-500 text-sm">collectés</p>
              </div>
              {cagnotte.show_target && cagnotte.target_amount && (
                <div className="text-right">
                  <p className="text-lg font-semibold">{cagnotte.target_amount} €</p>
                  <p className="text-gray-500 text-sm">objectif</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Bouton pour contribuer */}
        <div className="mb-8 text-center">
          <button className="bg-lime-500 hover:bg-lime-600 text-white font-bold py-3 px-8 rounded-md text-xl transition-colors">
            Je participe à cette cagnotte
          </button>
        </div>
        
        {/* Description */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">À propos de cette cagnotte</h2>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: cagnotte.description.replace(/\n/g, '<br/>') }}></div>
        </div>
        
        {/* Vidéo (si disponible) */}
        {cagnotte.video && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Vidéo</h2>
            <video
              src={cagnotte.video}
              controls
              className="w-full rounded"
            ></video>
          </div>
        )}
      </div>
    </main>
  );
} 