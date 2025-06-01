'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight, FaPlay, FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaPhone, FaSms, FaCopy, FaSortAmountDown, FaHeart, FaUsers, FaLock } from 'react-icons/fa';

// Types pour les données de cagnotte
export interface CagnotteAuthor {
  name: string;
  phone?: string;
  socials?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
}

export interface CagnotteDonation {
  id: string;
  amount: number;
  donor_name: string;
  created_at: string;
  comment?: string | null;
}

export interface CagnotteActualite {
  id: string;
  created_at: string;
  title: string;
  content: string;
  video_url?: string;
  images?: string[];
  amount_at_time?: number;
}

export interface CagnotteDetailData {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  images: string[];
  video?: string | null;
  category: string;
  created_at?: string;
  createdAt?: Date;
  current_amount?: number;
  currentAmount?: number;
  target_amount?: number | null;
  targetAmount?: number | null;
  show_target?: boolean;
  hide_amount?: boolean;
  participants?: number;
  author?: CagnotteAuthor;
  isEnded?: boolean;
  status?: string;
  donations?: CagnotteDonation[];
  actualites?: CagnotteActualite[];
  custom_url?: string | null;
}

interface CagnotteDetailViewProps {
  cagnotte: CagnotteDetailData;
  cagnotteId: string;
}

export default function CagnotteDetailView({ cagnotte, cagnotteId }: CagnotteDetailViewProps) {
  const [activeTab, setActiveTab] = useState('pourquoi');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAllDonations, setShowAllDonations] = useState(false);
  const [sortByAmount, setSortByAmount] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);

  const slideCount = (cagnotte.images?.length || 0) + (cagnotte.video ? 1 : 0);

  // Gestion des onglets
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Navigation dans le slider
  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slideCount - 1 : prev - 1));
    if (isVideoPlaying) setIsVideoPlaying(false);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slideCount - 1 ? 0 : prev + 1));
    if (isVideoPlaying) setIsVideoPlaying(false);
  };

  // Formatage des dates et montants
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0
    });
  };

  // Copier le lien de partage
  const handleCopyLink = () => {
    const url = cagnotte.custom_url 
      ? `https://africagnotte.com/c/${cagnotte.custom_url}`
      : `https://africagnotte.com/cagnotte/${cagnotteId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Trier les dons
  const donations = cagnotte.donations || [];
  const sortedDonations = [...donations].sort((a, b) => {
    if (sortByAmount) {
      return b.amount - a.amount;
    } else {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // Donations à afficher
  const visibleDonations = showAllDonations ? sortedDonations : sortedDonations.slice(0, 5);

  // Démarrer la vidéo
  const playVideo = () => {
    setIsVideoPlaying(true);
  };

  const currentAmount = cagnotte.current_amount || cagnotte.currentAmount || 0;
  const targetAmount = cagnotte.target_amount || cagnotte.targetAmount;
  const createdDate = cagnotte.created_at ? new Date(cagnotte.created_at) : cagnotte.createdAt || new Date();

  return (
    <main className="py-10 bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Titre de la cagnotte */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">{cagnotte.title}</h1>

        {/* Badge de confiance */}
        <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-8 flex items-center">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-green-800 font-medium">
            Participez en toute confiance<br />
            <span className="text-sm">Cette cagnotte a été contrôlée et vérifiée par les équipes de AfricaGnotte.</span>
          </p>
        </div>

        {/* Section de participation */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-md mx-auto">
          <div className="text-center">
            {/* Montant collecté */}
            <div className="mb-4">
              <div className="text-4xl font-bold text-gray-800 mb-1">
                {formatAmount(currentAmount)}
              </div>
              {targetAmount && cagnotte.show_target && (
                <div className="text-gray-600">
                  collectés sur <span className="font-semibold">{formatAmount(targetAmount)}</span>
                </div>
              )}
            </div>

            {/* Barre de progression */}
            {targetAmount && cagnotte.show_target && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-gradient-to-r from-lime-400 to-lime-500 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((currentAmount / targetAmount) * 100, 100)}%`
                    }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600">
                  {Math.round((currentAmount / targetAmount) * 100)}% atteint avec{' '}
                  <span className="font-semibold">{cagnotte.participants || donations.length} participants</span>
                </div>
              </div>
            )}

            {!targetAmount || !cagnotte.show_target ? (
              <div className="mb-4 text-sm text-gray-600">
                <FaUsers className="inline mr-2" />
                {cagnotte.participants || donations.length} participants
              </div>
            ) : null}

            {/* Bouton de participation */}
            <Link
              href={`/paiement/${cagnotteId}`}
              className="w-full bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 mb-4"
            >
              <FaHeart className="text-lg" />
              JE PARTICIPE
            </Link>

            {/* Sécurité */}
            <div className="flex items-center justify-center text-sm text-gray-500">
              <FaLock className="mr-2" />
              Plateforme 100% sécurisée
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex">
            <button
              className={`py-3 px-6 font-medium text-lg ${activeTab === 'pourquoi' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => handleTabChange('pourquoi')}
            >
              Pourquoi ?
            </button>
            <button
              className={`py-3 px-6 font-medium text-lg ${activeTab === 'infos' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => handleTabChange('infos')}
            >
              Infos
            </button>
          </div>
        </div>

        {/* Contenu de l'onglet */}
        <div className="mb-12">
          {activeTab === 'pourquoi' ? (
            <div>
              {/* Slider */}
              <div className="relative mb-8 aspect-video bg-gray-800 rounded-lg overflow-hidden">
                {/* Images et vidéo */}
                <div className="relative w-full h-full">
                  {(cagnotte.images || []).map((image, index) => (
                    <div
                      key={`image-${index}`}
                      className={`absolute inset-0 transition-opacity duration-500 ${currentSlide === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                      <Image
                        src={image}
                        alt={`Image ${index+1} de la cagnotte`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ))}

                  {cagnotte.video && (
                    <div
                      className={`absolute inset-0 transition-opacity duration-500 ${currentSlide === (cagnotte.images?.length || 0) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                      {isVideoPlaying ? (
                        <iframe
                          ref={videoRef}
                          src={`${cagnotte.video}?autoplay=1`}
                          className="w-full h-full"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        ></iframe>
                      ) : (
                        <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
                          <button
                            onClick={playVideo}
                            className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                          >
                            <FaPlay className="text-white text-3xl ml-2" />
                          </button>
                          <div className="absolute inset-0 -z-10 flex items-center justify-center text-white/50 text-lg font-medium">
                            Cliquez pour lire la vidéo
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Contrôles du slider */}
                {slideCount > 1 && (
                  <>
                    <button
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                      onClick={goToPrevSlide}
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                      onClick={goToNextSlide}
                    >
                      <FaChevronRight />
                    </button>

                    {/* Indicateurs */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {Array.from({ length: slideCount }).map((_, index) => (
                        <button
                          key={index}
                          className={`w-2.5 h-2.5 rounded-full ${currentSlide === index ? 'bg-white' : 'bg-white/50'}`}
                          onClick={() => {
                            setCurrentSlide(index);
                            if (isVideoPlaying) setIsVideoPlaying(false);
                          }}
                        ></button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Description longue */}
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-xl font-medium mb-4">{cagnotte.description}</p>
                <div className="whitespace-pre-line">{cagnotte.longDescription || cagnotte.description}</div>
              </div>

              {/* Réseaux sociaux et contact */}
              {cagnotte.author && (
                <div className="border-t border-gray-200 pt-6 mb-10">
                  <h3 className="text-xl font-semibold mb-4">Contacter l&apos;organisateur</h3>
                  <div className="flex flex-wrap gap-2 sm:gap-4">
                    {cagnotte.author.socials?.facebook && (
                      <a href={cagnotte.author.socials.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base">
                        <FaFacebook /> <span className="hidden xs:inline">Facebook</span>
                      </a>
                    )}
                    {cagnotte.author.socials?.twitter && (
                      <a href={cagnotte.author.socials.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition-colors text-sm sm:text-base">
                        <FaTwitter /> <span className="hidden xs:inline">Twitter</span>
                      </a>
                    )}
                    {cagnotte.author.socials?.instagram && (
                      <a href={cagnotte.author.socials.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 transition-colors text-sm sm:text-base">
                        <FaInstagram /> <span className="hidden xs:inline">Instagram</span>
                      </a>
                    )}
                    {cagnotte.author.phone && (
                      <a href={`tel:${cagnotte.author.phone}`} className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base">
                        <FaPhone /> <span className="hidden xs:inline">Appeler</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Informations sur la cagnotte */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4">Détails de la cagnotte</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 mb-1">Organisateur</p>
                      <p className="font-medium">{cagnotte.author?.name || 'Utilisateur'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Catégorie</p>
                      <p className="font-medium">{cagnotte.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Date de création</p>
                      <p className="font-medium">{formatDate(createdDate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Statut</p>
                      <p className="font-medium">{cagnotte.status === 'closed' || cagnotte.isEnded ? 'Clôturée' : 'En cours'}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-gray-600 mb-2">Progression</p>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{formatAmount(currentAmount)}</span>
                        {(cagnotte.show_target !== false && targetAmount) && (
                          <span className="text-gray-600">Objectif: {formatAmount(targetAmount)}</span>
                        )}
                      </div>
                      {(cagnotte.show_target !== false && targetAmount) && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-amber-500 h-2.5 rounded-full"
                            style={{ width: `${Math.min(100, (currentAmount / targetAmount) * 100)}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                    {(cagnotte.show_target !== false && targetAmount) && (
                      <p className="text-gray-600">
                        <span className="font-medium">{((currentAmount / targetAmount) * 100).toFixed(0)}%</span> de l&apos;objectif atteint
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Actualités de la cagnotte */}
              {cagnotte.actualites && cagnotte.actualites.length > 0 && (
                <>
                  <h3 className="text-2xl font-bold mb-6">Actualités de la cagnotte</h3>
                  <div className="space-y-8 mb-8">
                    {cagnotte.actualites.map((actu) => (
                      <div key={actu.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                          <p className="text-gray-500 text-sm">
                            Posté le {new Date(actu.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })},
                            {new Date(actu.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <h4 className="text-xl font-bold mt-1">{actu.title}</h4>
                        </div>

                        <div className="p-6">
                          {actu.video_url && (
                            <div className="mb-6 aspect-video rounded-lg overflow-hidden">
                              <iframe
                                src={actu.video_url}
                                className="w-full h-full"
                                allowFullScreen
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              ></iframe>
                            </div>
                          )}

                          {actu.images && actu.images.length > 0 && (
                            <div className="mb-6 aspect-video relative rounded-lg overflow-hidden">
                              <Image
                                src={actu.images[0]}
                                alt={actu.title}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                          )}

                          <div className="prose prose-lg max-w-none mb-4 whitespace-pre-line">
                            {actu.content}
                          </div>

                          {actu.amount_at_time && targetAmount && (
                            <div className="mt-6 pt-4 border-t border-gray-200">
                              <p className="text-gray-700 mb-2">
                                <span className="font-medium">Montant collecté à cette date :</span> {formatAmount(actu.amount_at_time)}
                              </p>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-amber-500 h-2 rounded-full"
                                  style={{ width: `${Math.min(100, (actu.amount_at_time / targetAmount) * 100)}%` }}
                                ></div>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {((actu.amount_at_time / targetAmount) * 100).toFixed(0)}% de l&apos;objectif atteint
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Comment les fonds seront utilisés</h3>
                <p className="text-gray-700 mb-4">
                  L&apos;intégralité des fonds collectés sera utilisée pour financer les objectifs de cette cagnotte.
                  Nous nous engageons à utiliser les fonds de manière transparente et responsable.
                </p>
                <p className="text-gray-700">
                  Pour plus d&apos;informations sur l&apos;utilisation des fonds, n&apos;hésitez pas à contacter l&apos;organisateur.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section des dons */}
        {donations.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {cagnotte.status === 'closed' || cagnotte.isEnded
                  ? `Cagnotte clôturée avec ${cagnotte.participants || donations.length} participants`
                  : `Cagnotte en cours avec ${cagnotte.participants || donations.length} participants`}
              </h2>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                onClick={() => setSortByAmount(!sortByAmount)}
              >
                <FaSortAmountDown />
                {sortByAmount ? 'Montant' : 'Date'}
              </button>
            </div>

            {/* Liste des dons */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              {visibleDonations.length > 0 ? (
                <div className="space-y-6">
                  {visibleDonations.map((donation) => (
                    <div key={donation.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 font-bold mr-3">
                            {donation.donor_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{donation.donor_name}</p>
                            <p className="text-sm text-gray-500">{formatDate(new Date(donation.created_at))}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{formatAmount(donation.amount)}</p>
                        </div>
                      </div>
                      {donation.comment && (
                        <p className="text-gray-700 ml-13 pl-3 border-l-2 border-gray-200">{donation.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">Aucun don pour le moment. Soyez le premier à contribuer !</p>
              )}

              {!showAllDonations && donations.length > 5 && (
                <div className="mt-6 text-center">
                  <button
                    className="px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
                    onClick={() => setShowAllDonations(true)}
                  >
                    Voir tous les participants ({cagnotte.participants || donations.length})
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section de partage */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">Mobilisez du monde ! Votre soutien passe aussi par le partage :</h3>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cagnotte.custom_url ? `https://africagnotte.com/c/${cagnotte.custom_url}` : `https://africagnotte.com/cagnotte/${cagnotteId}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 sm:px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-md flex items-center gap-1 sm:gap-2 hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <FaFacebook className="text-xl" /> <span className="hidden xs:inline">Facebook</span>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(cagnotte.custom_url ? `https://africagnotte.com/c/${cagnotte.custom_url}` : `https://africagnotte.com/cagnotte/${cagnotteId}`)}&text=${encodeURIComponent(`Soutenez la cagnotte: ${cagnotte.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 sm:px-4 py-2 sm:py-3 bg-blue-400 text-white rounded-md flex items-center gap-1 sm:gap-2 hover:bg-blue-500 transition-colors text-sm sm:text-base"
            >
              <FaTwitter className="text-xl" /> <span className="hidden xs:inline">Twitter</span>
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Soutenez la cagnotte: ${cagnotte.title} ${cagnotte.custom_url ? `https://africagnotte.com/c/${cagnotte.custom_url}` : `https://africagnotte.com/cagnotte/${cagnotteId}`}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 sm:px-4 py-2 sm:py-3 bg-green-500 text-white rounded-md flex items-center gap-1 sm:gap-2 hover:bg-green-600 transition-colors text-sm sm:text-base"
            >
              <FaWhatsapp className="text-xl" /> <span className="hidden xs:inline">WhatsApp</span>
            </a>
            <a
              href={`sms:&body=${encodeURIComponent(`Soutenez la cagnotte: ${cagnotte.title} ${cagnotte.custom_url ? `https://africagnotte.com/c/${cagnotte.custom_url}` : `https://africagnotte.com/cagnotte/${cagnotteId}`}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-600 text-white rounded-md flex items-center gap-1 sm:gap-2 hover:bg-gray-700 transition-colors text-sm sm:text-base"
            >
              <FaSms className="text-xl" /> <span className="hidden xs:inline">SMS</span>
            </a>
          </div>

          <div className="flex">
            <input
              type="text"
              value={cagnotte.custom_url ? `https://africagnotte.com/c/${cagnotte.custom_url}` : `https://africagnotte.com/cagnotte/${cagnotteId}`}
              readOnly
              className="flex-1 p-3 bg-gray-100 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-3 bg-amber-500 text-white rounded-r-md hover:bg-amber-600 transition-colors flex items-center gap-2"
            >
              <FaCopy /> {copiedLink ? 'Copié !' : 'Copier'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
