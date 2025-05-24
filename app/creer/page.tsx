'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaBold, FaUnderline, FaImage, FaLink, FaVideo } from 'react-icons/fa';
import MediaUpload from '../../components/MediaUpload';
import { useAuth } from '../../contexts/AuthContext';
import { toast, Toaster } from 'react-hot-toast';

// Utilisation des mêmes catégories que sur la page d'accueil
const categories = [
  { name: 'Santé', emoji: '🏥' },
  { name: 'Famille', emoji: '👪' },
  { name: 'Orphelins', emoji: '👶' },
  { name: 'Urgences', emoji: '🚨' }
];

export default function CreerCagnotte() {
  const { user, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const [title, setTitle] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [category, setCategory] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [showTarget, setShowTarget] = useState(false);
  const [targetAmount, setTargetAmount] = useState<number | null>(null);
  const [hideAmount, setHideAmount] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [description, setDescription] = useState('Quel que soit le montant, chacun peut participer à cette cagnotte. Pas besoin de créer un compte ou de s&apos;inscrire, c&apos;est rapide et les paiements par Carte Bancaire sont 100% sécurisés.\n\nSi vous ne pouvez pas participer financièrement, partagez cette cagnotte autour de vous au maximum. MERCI !');
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      toast.error('Vous devez vous connecter pour créer une cagnotte');
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
      
      const response = await fetch('/api/cagnottes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cagnotteData),
      });
      
      const responseData = await response.json();

      if (!response.ok) {
        console.error('Erreur lors de la création de la cagnotte (API):', responseData);
        toast.error(responseData.error || 'Erreur lors de la création de la cagnotte');
        return;
      }
      
      toast.success('Votre cagnotte a été créée avec succès');
      
      if (responseData.custom_url) {
        router.push(`/c/${responseData.custom_url}`);
      } else {
        router.push(`/c/${responseData.id}`);
      }
      
    } catch (error) {
      console.error('Erreur inattendue lors de la création:', error);
      toast.error('Une erreur inattendue est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="py-6 sm:py-10 bg-gray-50">
      <div className="container mx-auto max-w-3xl px-4">
        <Toaster position="top-center" />
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10">Créer une cagnotte</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          {/* Upload de médias (images/vidéo) */}
          <MediaUpload 
            images={images}
            video={video}
            onImagesUpload={handleImagesUpload}
            onVideoUpload={handleVideoUpload}
          />
          
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
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="custom-url" className="block text-base sm:text-lg font-semibold">Personnalisez le lien</label>
              <span className="text-gray-500 text-xs sm:text-sm">30 max</span>
            </div>
            <div className="flex items-center w-full bg-gray-100 rounded-md">
              <span className="px-2 sm:px-3 text-gray-500 font-medium text-xs sm:text-sm">africagnotte.com/</span>
              <input 
                type="text" 
                id="custom-url" 
                placeholder="pour-alex" 
                className="flex-1 p-2 sm:p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
                maxLength={30}
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mb-5 sm:mb-6">
            <label htmlFor="category" className="block text-base sm:text-lg font-semibold mb-2">Choisissez une catégorie</label>
            <div className="relative">
              <select 
                id="category" 
                className="appearance-none w-full p-2 sm:p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10 text-sm sm:text-base"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>Sélectionnez une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>{cat.emoji} {cat.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="mb-5 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Paramètres</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="private" 
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-amber-500 focus:ring-amber-500"
                  checked={isPrivate}
                  onChange={() => setIsPrivate(!isPrivate)} 
                />
                <label htmlFor="private" className="text-gray-700 text-sm sm:text-base">Cagnotte privée</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="target" 
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-amber-500 focus:ring-amber-500"
                  checked={showTarget}
                  onChange={() => setShowTarget(!showTarget)} 
                />
                <label htmlFor="target" className="text-gray-700 text-sm sm:text-base">Indiquer un montant à atteindre</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="hide-amount" 
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-amber-500 focus:ring-amber-500"
                  checked={hideAmount}
                  onChange={() => setHideAmount(!hideAmount)} 
                />
                <label htmlFor="hide-amount" className="text-gray-700 text-sm sm:text-base">Masquer le montant collecté</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="show-participants" 
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-amber-500 focus:ring-amber-500" 
                  checked={showParticipants}
                  onChange={() => setShowParticipants(!showParticipants)}
                />
                <label htmlFor="show-participants" className="text-gray-700 text-sm sm:text-base">Afficher les participants (recommandé)</label>
              </div>
            </div>
          </div>
          
          {showTarget && (
            <div className="mb-5 sm:mb-6">
              <label htmlFor="targetAmount" className="block text-base sm:text-lg font-semibold mb-2">Montant à atteindre</label>
              <div className="flex items-center w-full">
                <input 
                  type="number" 
                  id="targetAmount" 
                  placeholder="1000" 
                  min="1"
                  className="flex-1 p-2 sm:p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
                  value={targetAmount || ''}
                  onChange={(e) => setTargetAmount(parseInt(e.target.value) || null)}
                  required={showTarget}
                />
                <span className="ml-2 text-gray-700 font-medium">€</span>
              </div>
            </div>
          )}
          
          <div className="mb-5 sm:mb-6">
            <label htmlFor="description" className="block text-base sm:text-lg font-semibold mb-2">Description</label>
            <div className="mb-2 flex space-x-2 border-b pb-2">
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
              className="bg-lime-500 hover:bg-lime-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-md text-base sm:text-xl transition-colors"
              disabled={loading}
            >
              {loading ? 'Création en cours...' : 'Lancer ma cagnotte'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
} 