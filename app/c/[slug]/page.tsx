'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import CagnotteDetailView from '../../../components/CagnotteDetailView';
import { useCagnotte } from '../../../hooks/useCagnotte';
import ApiTestPanel from '../../../components/ApiTestPanel';

export default function CagnottePage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);

  // Résoudre les paramètres de manière asynchrone
  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    }
    resolveParams();
  }, [params]);

  // Utiliser le hook personnalisé pour charger la cagnotte
  const { cagnotte, loading, error } = useCagnotte(slug || '');

  // Afficher les erreurs avec toast
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  
  if (loading) {
    return (
      <div className="py-10 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de la cagnotte...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !cagnotte) {
    return (
      <div className="py-10 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Cagnotte introuvable</h1>
            <p className="text-gray-600 mb-6">{error || 'Cette cagnotte n\'existe pas ou n\'est plus disponible.'}</p>
            <Link
              href="/cagnottes"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-md transition-colors"
            >
              Voir toutes les cagnottes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <CagnotteDetailView cagnotte={cagnotte} cagnotteId={cagnotte.id} />
      <ApiTestPanel cagnotteId={cagnotte.id} />
    </>
  );
}