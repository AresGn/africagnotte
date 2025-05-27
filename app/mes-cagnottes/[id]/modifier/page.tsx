'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaBold, FaUnderline, FaImage, FaLink, FaVideo } from 'react-icons/fa';
import MediaUpload from '../../../../components/MediaUpload';
import { useAuth } from '../../../../contexts/AuthContext';
import { toast, Toaster } from 'react-hot-toast';

// Utilisation des mêmes catégories que sur la page de création
const categories = [
  { name: 'Santé', emoji: '🏥' },
  { name: 'Famille', emoji: '👪' },
  { name: 'Orphelins', emoji: '👶' },
  { name: 'Urgences', emoji: '🚨' }
];

interface Cagnotte {
  id: string;
  title: string;
  custom_url: string | null;
  category: string;
  description: string;
  images: string[];
  video: string | null;
  is_private: boolean;
  show_target: boolean;
  target_amount: number | null;
  hide_amount: boolean;
  show_participants: boolean;
  current_amount: number;
  status: string;
  created_at: string;
  updated_at?: string;
}

export default function ModifierCagnotte() {
  const { user, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const cagnotteId = params.id as string;

  // États du formulaire
  const [title, setTitle] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [category, setCategory] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [showTarget, setShowTarget] = useState(false);
  const [targetAmount, setTargetAmount] = useState<number | null>(null);
  const [hideAmount, setHideAmount] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<string | null>(null);

  // États de l'interface
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [cagnotte, setCagnotte] = useState<Cagnotte | null>(null);

  // Charger les données de la cagnotte
  useEffect(() => {
    if (authIsLoading) {
      return;
    }

    if (!isAuthenticated || !user) {
      router.push('/connexion');
      return;
    }

    const fetchCagnotte = async () => {
      try {
        setPageLoading(true);
        const response = await fetch(`/api/cagnottes/${cagnotteId}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Impossible de charger la cagnotte');
        }

        const data: Cagnotte = await response.json();
        setCagnotte(data);

        // Remplir le formulaire avec les données existantes
        setTitle(data.title);
        setCustomUrl(data.custom_url || '');
        setCategory(data.category);
        setIsPrivate(data.is_private);
        setShowTarget(data.show_target);
        setTargetAmount(data.target_amount);
        setHideAmount(data.hide_amount);
        setShowParticipants(data.show_participants);
        setDescription(data.description);
        setImages(Array.isArray(data.images) ? data.images : []);
        setVideo(data.video);

      } catch (error) {
        console.error('Erreur lors du chargement de la cagnotte:', error);
        toast.error((error as Error).message);
        router.push('/mes-cagnottes');
      } finally {
        setPageLoading(false);
      }
    };

    if (cagnotteId) {
      fetchCagnotte();
    }
  }, [authIsLoading, isAuthenticated, user, cagnotteId, router]);

  const handleImagesUpload = (uploadedImages: string[]) => {
    setImages(uploadedImages);
  };

  const handleVideoUpload = (uploadedVideo: string) => {
    setVideo(uploadedVideo);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authIsLoading) {
      toast.error('Veuillez patienter, vérification de l\'authentification...');
      return;
    }

    if (!isAuthenticated || !user) {
      toast.error('Vous devez vous connecter pour modifier une cagnotte');
      router.push('/connexion');
      return;
    }

    if (!title || !category) {
      toast.error('Veuillez remplir les champs Titre et Catégorie');
      return;
    }
    if (images.length === 0) {
      toast.error('Veuillez ajouter au moins une image');
      return;
    }
    if (showTarget && (!targetAmount || targetAmount <= 0)) {
      toast.error('Veuillez définir un montant à atteindre valide');
      return;
    }

    try {
      setLoading(true);

      const cagnotteData = {
        title,
        custom_url: customUrl || null,
        category,
        description,
        images: JSON.stringify(images),
        video: video || null,
        is_private: isPrivate,
        show_target: showTarget,
        target_amount: showTarget ? targetAmount : null,
        hide_amount: hideAmount,
        show_participants: showParticipants,
      };

      const response = await fetch(`/api/cagnottes/${cagnotteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(cagnotteData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Erreur lors de la modification de la cagnotte (API):', responseData);
        toast.error(responseData.error || 'Erreur lors de la modification de la cagnotte');
        return;
      }

      toast.success('Votre cagnotte a été modifiée avec succès');

      // Rediriger vers la page de détail ou la liste des cagnottes
      if (responseData.custom_url) {
        router.push(`/c/${responseData.custom_url}`);
      } else {
        router.push(`/c/${responseData.id}`);
      }

    } catch (error) {
      console.error('Erreur inattendue lors de la modification:', error);
      toast.error('Une erreur inattendue est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <main className="py-6 sm:py-10 bg-gray-50">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-lime-500"></div>
            <p className="mt-4">Chargement de la cagnotte...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!cagnotte) {
    return (
      <main className="py-6 sm:py-10 bg-gray-50">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="text-center py-12">
            <p className="text-xl text-red-600">Cagnotte introuvable</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-6 sm:py-10 bg-gray-50">
      <div className="container mx-auto max-w-3xl px-4">
        <Toaster position="top-center" />
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10">Modifier la cagnotte</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 sm:p-8">

          <div className="mb-5 sm:mb-6">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="title" className="block text-base sm:text-lg font-semibold">Titre de la cagnotte</label>
              <span className="text-gray-500 text-xs sm:text-sm">50 max</span>
            </div>
            <input
              type="text"
              id="title"
              placeholder="Ex : Un nouveau véhicule pour Alex"
              className="w-full p-2 sm:p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
              maxLength={50}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-5 sm:mb-6">
            <label htmlFor="customUrl" className="block text-base sm:text-lg font-semibold mb-2">URL personnalisée (optionnel)</label>
            <div className="flex items-center">
              <span className="text-gray-500 text-sm sm:text-base">africagnotte.com/c/</span>
              <input
                type="text"
                id="customUrl"
                placeholder="mon-url-personnalisee"
                className="flex-1 p-2 sm:p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base ml-1"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-5 sm:mb-6">
            <label className="block text-base sm:text-lg font-semibold mb-2">Catégorie</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`p-2 sm:p-3 rounded-md border-2 transition-colors text-sm sm:text-base ${
                    category === cat.name
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg sm:text-xl">{cat.emoji}</span>
                  <div className="font-medium">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5 sm:mb-6">
            <label className="block text-base sm:text-lg font-semibold mb-3">Options de confidentialité et d'affichage</label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="mr-2 h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded"
                />
                <span className="text-sm sm:text-base">Cagnotte privée (non visible publiquement)</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showTarget}
                  onChange={(e) => setShowTarget(e.target.checked)}
                  className="mr-2 h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded"
                />
                <span className="text-sm sm:text-base">Afficher l'objectif de collecte</span>
              </label>

              {showTarget && (
                <div className="ml-6">
                  <label htmlFor="targetAmount" className="block text-sm font-medium mb-1">Montant à atteindre (€)</label>
                  <input
                    type="number"
                    id="targetAmount"
                    placeholder="Ex: 5000"
                    className="w-full p-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    min="1"
                    value={targetAmount || ''}
                    onChange={(e) => setTargetAmount(e.target.value ? parseInt(e.target.value) : null)}
                  />
                </div>
              )}

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={hideAmount}
                  onChange={(e) => setHideAmount(e.target.checked)}
                  className="mr-2 h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded"
                />
                <span className="text-sm sm:text-base">Masquer le montant collecté</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showParticipants}
                  onChange={(e) => setShowParticipants(e.target.checked)}
                  className="mr-2 h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded"
                />
                <span className="text-sm sm:text-base">Afficher la liste des participants</span>
              </label>
            </div>
          </div>

          <div className="mb-5 sm:mb-6">
            <label className="block text-base sm:text-lg font-semibold mb-2">Images et vidéo</label>
            <MediaUpload
              onImagesUpload={handleImagesUpload}
              onVideoUpload={handleVideoUpload}
              images={images}
              video={video}
            />
          </div>

          <div className="mb-6 sm:mb-8">
            <label htmlFor="description" className="block text-base sm:text-lg font-semibold mb-2">Description</label>
            <div className="mb-2 flex gap-1 sm:gap-2">
              <button type="button" className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded">
                <FaBold className="text-xs sm:text-sm" />
              </button>
              <button type="button" className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded">
                <FaUnderline className="text-xs sm:text-sm" />
              </button>
              <button type="button" className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded">
                <FaImage className="text-xs sm:text-sm" />
              </button>
              <button type="button" className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded">
                <FaLink className="text-xs sm:text-sm" />
              </button>
              <button type="button" className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded">
                <FaVideo className="text-xs sm:text-sm" />
              </button>
            </div>
            <textarea
              id="description"
              className="w-full p-2 sm:p-3 bg-gray-100 rounded-md min-h-[150px] sm:min-h-[200px] focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-lime-500 hover:bg-lime-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-md text-base sm:text-xl transition-colors mr-4"
              disabled={loading}
            >
              {loading ? 'Modification en cours...' : 'Modifier ma cagnotte'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-md text-base sm:text-xl transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
