'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaBold, FaUnderline, FaImage, FaLink, FaVideo } from 'react-icons/fa';
import MediaUpload from '../../../../components/MediaUpload';
// import CountryPaymentFields from '../../../../components/CountryPaymentFields'; // Non utilisé pour le moment
import { useAuth } from '../../../../contexts/AuthContext';
import { toast, Toaster } from 'react-hot-toast';

// Catégories étendues pour couvrir plus de besoins sociaux
const categories = [
  { name: 'Santé', emoji: '🏥' },
  { name: 'Famille', emoji: '👪' },
  { name: 'Orphelins', emoji: '👶' },
  { name: 'Urgences', emoji: '🚨' },
  { name: 'Éducation', emoji: '📚' },
  { name: 'Entrepreneuriat Social', emoji: '💼' },
  { name: 'Accès à l\'eau', emoji: '💧' },
  { name: 'Sécurité Alimentaire', emoji: '🌾' },
  { name: 'Logement Décent', emoji: '🏠' },
  { name: 'Handicap & Inclusion', emoji: '♿' },
  { name: 'Femmes & Autonomisation', emoji: '👩' },
  { name: 'Environnement', emoji: '🌱' }
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
  // Numéros de dépôt pour les différents opérateurs
  numero_moov?: string | null;
  numero_mtn?: string | null;
  numero_orange?: string | null;
  numero_wave?: string | null;
  numero_airtel?: string | null;
  numero_autres?: string | null;
}

export default function ModifierCagnotte() {
  const { user, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const cagnotteId = params?.id as string;

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

  // Numéros de dépôt pour les différents opérateurs
  const [numeroMoov, setNumeroMoov] = useState('');
  const [numeroMtn, setNumeroMtn] = useState('');
  const [numeroOrange, setNumeroOrange] = useState('');
  const [numeroWave, setNumeroWave] = useState('');
  const [numeroAirtel, setNumeroAirtel] = useState('');
  const [numeroAutres, setNumeroAutres] = useState('');

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

        // Remplir les numéros de dépôt
        setNumeroMoov(data.numero_moov || '');
        setNumeroMtn(data.numero_mtn || '');
        setNumeroOrange(data.numero_orange || '');
        setNumeroWave(data.numero_wave || '');
        setNumeroAirtel(data.numero_airtel || '');
        setNumeroAutres(data.numero_autres || '');

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

    // Validation des numéros de dépôt (au moins un requis)
    const numerosDepot = [numeroMoov, numeroMtn, numeroOrange, numeroWave, numeroAirtel, numeroAutres].filter(num => num.trim());
    if (numerosDepot.length === 0) {
      toast.error('Veuillez renseigner au moins un numéro de dépôt pour recevoir les dons');
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
        // Numéros de dépôt pour les différents opérateurs
        numero_moov: numeroMoov.trim() || null,
        numero_mtn: numeroMtn.trim() || null,
        numero_orange: numeroOrange.trim() || null,
        numero_wave: numeroWave.trim() || null,
        numero_airtel: numeroAirtel.trim() || null,
        numero_autres: numeroAutres.trim() || null,
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
      <main className="pt-20 pb-6 sm:pb-10 bg-gray-50">
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
      <main className="pt-20 pb-6 sm:pb-10 bg-gray-50">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="text-center py-12">
            <p className="text-xl text-red-600">Cagnotte introuvable</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 pb-6 sm:pb-10 bg-gray-50">
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
            <label className="block text-base sm:text-lg font-semibold mb-3">Options de confidentialité et d&apos;affichage</label>
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
                <span className="text-sm sm:text-base">Afficher l&apos;objectif de collecte</span>
              </label>

              {showTarget && (
                <div className="ml-6">
                  <label htmlFor="targetAmount" className="block text-sm font-medium mb-1">Montant à atteindre (FCFA)</label>
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

          {/* Numéros de dépôt pour les paiements */}
          <div className="mb-5 sm:mb-6">
            <label className="block text-base sm:text-lg font-semibold mb-3">Numéros de dépôt pour recevoir les dons</label>
            <p className="text-sm text-gray-600 mb-4">
              Renseignez vos numéros de téléphone pour les différents opérateurs mobiles.
              <strong> Au moins un numéro est requis.</strong>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="numeroMoov" className="block text-sm font-medium mb-1">🟠 Moov Money</label>
                <input
                  type="tel"
                  id="numeroMoov"
                  placeholder="Ex: 97123456"
                  className="w-full p-2 sm:p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
                  value={numeroMoov}
                  onChange={(e) => setNumeroMoov(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="numeroMtn" className="block text-sm font-medium mb-1">🟡 MTN Mobile Money</label>
                <input
                  type="tel"
                  id="numeroMtn"
                  placeholder="Ex: 67123456"
                  className="w-full p-2 sm:p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
                  value={numeroMtn}
                  onChange={(e) => setNumeroMtn(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="numeroOrange" className="block text-sm font-medium mb-1">🟠 Orange Money</label>
                <input
                  type="tel"
                  id="numeroOrange"
                  placeholder="Ex: 07123456"
                  className="w-full p-2 sm:p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
                  value={numeroOrange}
                  onChange={(e) => setNumeroOrange(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="numeroWave" className="block text-sm font-medium mb-1">🔵 Wave</label>
                <input
                  type="tel"
                  id="numeroWave"
                  placeholder="Ex: 77123456"
                  className="w-full p-2 sm:p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
                  value={numeroWave}
                  onChange={(e) => setNumeroWave(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="numeroAirtel" className="block text-sm font-medium mb-1">🔴 Airtel Money</label>
                <input
                  type="tel"
                  id="numeroAirtel"
                  placeholder="Ex: 78123456"
                  className="w-full p-2 sm:p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
                  value={numeroAirtel}
                  onChange={(e) => setNumeroAirtel(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="numeroAutres" className="block text-sm font-medium mb-1">📱 Autres opérateurs</label>
                <input
                  type="tel"
                  id="numeroAutres"
                  placeholder="Ex: 90123456"
                  className="w-full p-2 sm:p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
                  value={numeroAutres}
                  onChange={(e) => setNumeroAutres(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-700">
                <strong>💡 Conseil :</strong> Renseignez plusieurs numéros pour permettre aux donateurs
                d&apos;utiliser leur opérateur préféré. Les numéros peuvent être au format local ou international.
              </p>
            </div>
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
