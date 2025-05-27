'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { FaChevronLeft, FaChevronRight, FaPlay, FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaPhone, FaSms, FaCopy, FaSortAmountDown } from 'react-icons/fa';

// Données fictives pour la cagnotte (dans un projet réel, ces données viendraient d'une API)
// Using valid UUID for consistency with database schema
const mockCagnotte = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  title: 'Soutien médical pour les enfants',
  description: 'Cette cagnotte a pour objectif de venir en aide aux enfants malades de la région de Dakar qui n\'ont pas les moyens de se soigner. Les fonds collectés serviront à acheter des médicaments, payer des consultations médicales et financer des opérations chirurgicales pour les cas les plus graves.',
  longDescription: `Il y a deux ans, nous avons découvert que de nombreux enfants de la région de Dakar n'avaient pas accès aux soins médicaux de base en raison de la pauvreté de leurs familles. Certains souffrent de maladies graves qui nécessitent des traitements coûteux, hors de portée pour la plupart des familles.

Notre association "Santé Pour Tous" a décidé de lancer cette initiative pour collecter des fonds et permettre à ces enfants de recevoir les soins dont ils ont besoin. Nous travaillons en collaboration avec plusieurs hôpitaux et cliniques de la région qui ont accepté de réduire leurs tarifs pour notre cause.

Depuis le début de notre action, nous avons déjà pu aider plus de 50 enfants, mais les besoins sont immenses et nous avons besoin de votre soutien pour continuer cette mission essentielle. Chaque don, même le plus modeste, peut faire une différence dans la vie d'un enfant.

L'intégralité des fonds collectés sera utilisée pour financer les soins médicaux des enfants. Notre association fonctionne entièrement grâce à des bénévoles, ce qui nous permet de garantir que votre argent ira directement aux bénéficiaires.

Ensemble, nous pouvons offrir un avenir meilleur à ces enfants et leur donner une chance de grandir en bonne santé. Merci pour votre générosité !`,
  images: [
    '/images/campaign-1.webp',
    '/images/campaign-2.jpg',
    '/images/campaign-3.jpeg'
  ],
  video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // URL fictive pour l'exemple
  category: 'Santé',
  createdAt: new Date('2023-09-15'),
  currentAmount: 7000000,
  targetAmount: 10000000,
  participants: 2899,
  author: {
    name: 'Association Santé Pour Tous',
    phone: '+221 77 123 45 67',
    socials: {
      facebook: 'https://facebook.com/santépourtous',
      twitter: 'https://twitter.com/santépourtous',
      instagram: 'https://instagram.com/santépourtous'
    }
  },
  isEnded: false,
  donations: [
    {
      id: 1,
      amount: 500000,
      name: 'Roland',
      date: new Date('2023-11-10'),
      comment: 'Bon courage pour cette belle initiative !'
    },
    {
      id: 2,
      amount: 25000,
      name: 'Marie',
      date: new Date('2023-11-08'),
      comment: 'J\'espère que cela aidera ces enfants.'
    },
    {
      id: 3,
      amount: 100000,
      name: 'Anonyme',
      date: new Date('2023-11-05'),
      comment: null
    },
    {
      id: 4,
      amount: 50000,
      name: 'Amadou',
      date: new Date('2023-11-02'),
      comment: 'Bravo pour votre engagement !'
    },
    {
      id: 5,
      amount: 200000,
      name: 'Fatou',
      date: new Date('2023-10-28'),
      comment: 'Que Dieu bénisse cette initiative'
    },
    {
      id: 6,
      amount: 20000,
      name: 'Anonyme',
      date: new Date('2023-10-25'),
      comment: 'Je souhaite rester anonyme mais je soutiens pleinement cette cause'
    },
    {
      id: 7,
      amount: 75000,
      name: 'Pierre',
      date: new Date('2023-10-20'),
      comment: null
    },
    {
      id: 8,
      amount: 30000,
      name: 'Aïssatou',
      date: new Date('2023-10-15'),
      comment: 'Pour le bien-être des enfants'
    },
    {
      id: 9,
      amount: 150000,
      name: 'Ibrahim',
      date: new Date('2023-10-10'),
      comment: 'Allah vous bénisse'
    },
    {
      id: 10,
      amount: 40000,
      name: 'Anonyme',
      date: new Date('2023-10-05'),
      comment: null
    }
  ],
  // Ajout des actualités
  actualites: [
    {
      id: 1,
      date: new Date('2023-09-20T21:47:00'),
      titre: 'Lancement de la cagnotte',
      contenu: `Nous venons de lancer cette cagnotte pour soutenir les enfants malades de la région de Dakar. Grâce à votre générosité, nous avons déjà récolté 1 500 000 XOF en seulement 5 jours ! Cet argent nous permettra de financer les premiers soins médicaux pour 10 enfants en situation d'urgence.

Nous vous tiendrons informés de l'avancement de nos actions. Merci à tous pour votre soutien !`,
      video: 'https://www.youtube.com/embed/abc123', // URL fictive pour l'exemple
      montantCollecte: 1500000
    },
    {
      id: 2,
      date: new Date('2023-12-09T09:39:00'),
      titre: 'Rencontre avec Mamadou !',
      contenu: `Nous avons eu la chance de rencontrer le petit Mamadou, 7 ans, qui a pu bénéficier d'une opération chirurgicale grâce à vos dons. Souffrant d'une malformation cardiaque depuis sa naissance, sa famille n'avait pas les moyens de financer cette intervention pourtant vitale.

Aujourd'hui, Mamadou va beaucoup mieux et peut enfin jouer avec ses camarades sans s'essouffler. Son sourire est la plus belle des récompenses pour notre travail.

Nous avons déjà pu aider 25 enfants comme Mamadou, mais beaucoup d'autres attendent encore notre aide. La cagnotte a atteint 4 200 000 XOF, soit 42% de notre objectif. Continuez à partager cette cagnotte autour de vous !`,
      images: ['/images/campaign-2.jpg'],
      montantCollecte: 4200000
    },
    {
      id: 3,
      date: new Date('2024-04-03T14:53:00'),
      titre: 'Bientôt la clôture de la cagnotte',
      contenu: `Après toutes ces manifestations de générosité incroyable, nous allons bientôt devoir clôturer cette cagnotte. Une nouvelle association prend le relais ! Parce que ces maladies infantiles nécessitent un suivi à long terme, nous cherchons des entreprises et particuliers prêts à soutenir notre cause financièrement, et/ou à mobiliser leurs réseaux.

Si vous pouvez aider, rendez-vous sur notre site web : www.santepourtoussenegal.org

Grâce à vos dons, nous avons récolté 7 000 000 XOF et aidé plus de 50 enfants. Chaque enfant a pu bénéficier de soins médicaux adaptés, et certains ont même pu être opérés. Nous vous remercions du fond du cœur pour votre générosité.

La cagnotte reste ouverte encore quelques semaines, n'hésitez pas à continuer à partager !`,
      montantCollecte: 7000000
    }
  ]
};

export default function CagnotteDetail() {
  const params = useParams();
  const cagnotteId = params.id;
  const [activeTab, setActiveTab] = useState('pourquoi');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAllDonations, setShowAllDonations] = useState(false);
  const [sortByAmount, setSortByAmount] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);

  // États pour les données réelles
  const [cagnotte, setCagnotte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les données de la cagnotte
  useEffect(() => {
    const fetchCagnotte = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/cagnottes/detail/${cagnotteId}`);

        if (!response.ok) {
          throw new Error('Cagnotte non trouvée');
        }

        const data = await response.json();
        setCagnotte(data);
      } catch (err) {
        setError(err.message);
        // En cas d'erreur, utiliser les données fictives pour le développement
        setCagnotte(mockCagnotte);
      } finally {
        setLoading(false);
      }
    };

    if (cagnotteId) {
      fetchCagnotte();
    }
  }, [cagnotteId]);

  // Utiliser les données réelles ou fictives
  const currentCagnotte: any = cagnotte || mockCagnotte;
  const slideCount = (currentCagnotte.images?.length || 0) + (currentCagnotte.video ? 1 : 0);

  // Affichage de chargement
  if (loading) {
    return (
      <main className="py-10 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de la cagnotte...</p>
          </div>
        </div>
      </main>
    );
  }

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
    navigator.clipboard.writeText(`https://africagnotte.com/cagnotte/${cagnotteId}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Trier les dons (utiliser des données fictives pour les dons pour l'instant)
  const donations = currentCagnotte.donations || mockCagnotte.donations;
  const sortedDonations = [...donations].sort((a, b) => {
    if (sortByAmount) {
      return b.amount - a.amount;
    } else {
      return b.date.getTime() - a.date.getTime();
    }
  });

  // Donations à afficher
  const visibleDonations = showAllDonations ? sortedDonations : sortedDonations.slice(0, 5);

  // Démarrer la vidéo
  const playVideo = () => {
    setIsVideoPlaying(true);
  };

  return (
    <main className="py-10 bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Titre de la cagnotte */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">{currentCagnotte.title}</h1>

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
                  {(currentCagnotte.images || []).map((image, index) => (
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

                  {currentCagnotte.video && (
                    <div
                      className={`absolute inset-0 transition-opacity duration-500 ${currentSlide === (currentCagnotte.images?.length || 0) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                      {isVideoPlaying ? (
                        <iframe
                          ref={videoRef}
                          src={`${currentCagnotte.video}?autoplay=1`}
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
              </div>

              {/* Description longue */}
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-xl font-medium mb-4">{currentCagnotte.description}</p>
                <div className="whitespace-pre-line">{currentCagnotte.longDescription || currentCagnotte.description}</div>
              </div>

              {/* Réseaux sociaux et contact */}
              <div className="border-t border-gray-200 pt-6 mb-10">
                <h3 className="text-xl font-semibold mb-4">Contacter l&apos;organisateur</h3>
                <div className="flex flex-wrap gap-2 sm:gap-4">
                  {/* Pour l'instant, utiliser les données fictives pour les réseaux sociaux */}
                  {/* TODO: Ajouter les champs réseaux sociaux à la base de données */}
                  <a href={mockCagnotte.author.socials.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base">
                    <FaFacebook /> <span className="hidden xs:inline">Facebook</span>
                  </a>
                  <a href={mockCagnotte.author.socials.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition-colors text-sm sm:text-base">
                    <FaTwitter /> <span className="hidden xs:inline">Twitter</span>
                  </a>
                  <a href={mockCagnotte.author.socials.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 transition-colors text-sm sm:text-base">
                    <FaInstagram /> <span className="hidden xs:inline">Instagram</span>
                  </a>
                  <a href={`tel:${mockCagnotte.author.phone}`} className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base">
                    <FaPhone /> <span className="hidden xs:inline">Appeler</span>
                  </a>
                </div>
              </div>
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
                      <p className="font-medium">{currentCagnotte.author?.name || 'Utilisateur'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Catégorie</p>
                      <p className="font-medium">{currentCagnotte.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Date de création</p>
                      <p className="font-medium">{formatDate(new Date(currentCagnotte.created_at || currentCagnotte.createdAt || Date.now()))}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Statut</p>
                      <p className="font-medium">{(currentCagnotte as any).status === 'closed' || currentCagnotte.isEnded ? 'Clôturée' : 'En cours'}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-gray-600 mb-2">Progression</p>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{formatAmount(currentCagnotte.current_amount || currentCagnotte.currentAmount || 0)}</span>
                        {(currentCagnotte.show_target !== false && (currentCagnotte.target_amount || currentCagnotte.targetAmount)) && (
                          <span className="text-gray-600">Objectif: {formatAmount(currentCagnotte.target_amount || currentCagnotte.targetAmount)}</span>
                        )}
                      </div>
                      {(currentCagnotte.show_target !== false && (currentCagnotte.target_amount || currentCagnotte.targetAmount)) && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-amber-500 h-2.5 rounded-full"
                            style={{ width: `${Math.min(100, ((currentCagnotte.current_amount || currentCagnotte.currentAmount || 0) / (currentCagnotte.target_amount || currentCagnotte.targetAmount || 1)) * 100)}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                    {(currentCagnotte.show_target !== false && (currentCagnotte.target_amount || currentCagnotte.targetAmount)) && (
                      <p className="text-gray-600">
                        <span className="font-medium">{(((currentCagnotte.current_amount || currentCagnotte.currentAmount || 0) / (currentCagnotte.target_amount || currentCagnotte.targetAmount || 1)) * 100).toFixed(0)}%</span> de l&apos;objectif atteint
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Actualités de la cagnotte */}
              <h3 className="text-2xl font-bold mb-6">Actualités de la cagnotte</h3>
              <div className="space-y-8 mb-8">
                {mockCagnotte.actualites.map((actu) => (
                  <div key={actu.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                      <p className="text-gray-500 text-sm">
                        Posté le {actu.date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })},
                        {actu.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <h4 className="text-xl font-bold mt-1">{actu.titre}</h4>
                    </div>

                    <div className="p-6">
                      {actu.video && (
                        <div className="mb-6 aspect-video rounded-lg overflow-hidden">
                          <iframe
                            src={actu.video}
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
                            alt={actu.titre}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      )}

                      <div className="prose prose-lg max-w-none mb-4 whitespace-pre-line">
                        {actu.contenu}
                      </div>

                      {actu.montantCollecte && (
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <p className="text-gray-700 mb-2">
                            <span className="font-medium">Montant collecté à cette date :</span> {formatAmount(actu.montantCollecte)}
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-amber-500 h-2 rounded-full"
                              style={{ width: `${Math.min(100, (actu.montantCollecte / mockCagnotte.targetAmount) * 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {((actu.montantCollecte / mockCagnotte.targetAmount) * 100).toFixed(0)}% de l&apos;objectif atteint
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Comment les fonds seront utilisés</h3>
                <p className="text-gray-700 mb-4">
                  L&apos;intégralité des fonds collectés sera utilisée pour financer les soins médicaux des enfants
                  dans la région de Dakar. Notre association fonctionne entièrement grâce à des bénévoles,
                  ce qui nous permet de garantir que votre argent ira directement aux bénéficiaires.
                </p>
                <p className="text-gray-700">
                  Les fonds seront répartis comme suit:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-700">
                  <li>70% pour les opérations chirurgicales et traitements médicaux</li>
                  <li>20% pour l&apos;achat de médicaments</li>
                  <li>10% pour les consultations et examens médicaux</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Section des dons */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {currentCagnotte.status === 'closed' || currentCagnotte.isEnded
                ? `Cagnotte clôturée avec ${currentCagnotte.participants || 0} participants`
                : `Cagnotte en cours avec ${currentCagnotte.participants || 0} participants`}
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
                          {donation.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{donation.name}</p>
                          <p className="text-sm text-gray-500">{formatDate(donation.date)}</p>
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

            {!showAllDonations && mockCagnotte.donations.length > 5 && (
              <div className="mt-6 text-center">
                <button
                  className="px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
                  onClick={() => setShowAllDonations(true)}
                >
                  Voir tous les participants ({mockCagnotte.participants})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section de partage */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">Mobilisez du monde ! Votre soutien passe aussi par le partage :</h3>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=https://africagnotte.com/cagnotte/${cagnotteId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 sm:px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-md flex items-center gap-1 sm:gap-2 hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <FaFacebook className="text-xl" /> <span className="hidden xs:inline">Facebook</span>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=https://africagnotte.com/cagnotte/${cagnotteId}&text=${encodeURIComponent(`Soutenez la cagnotte: ${mockCagnotte.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 sm:px-4 py-2 sm:py-3 bg-blue-400 text-white rounded-md flex items-center gap-1 sm:gap-2 hover:bg-blue-500 transition-colors text-sm sm:text-base"
            >
              <FaTwitter className="text-xl" /> <span className="hidden xs:inline">Twitter</span>
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Soutenez la cagnotte: ${mockCagnotte.title} https://africagnotte.com/cagnotte/${cagnotteId}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 sm:px-4 py-2 sm:py-3 bg-green-500 text-white rounded-md flex items-center gap-1 sm:gap-2 hover:bg-green-600 transition-colors text-sm sm:text-base"
            >
              <FaWhatsapp className="text-xl" /> <span className="hidden xs:inline">WhatsApp</span>
            </a>
            <a
              href={`sms:&body=${encodeURIComponent(`Soutenez la cagnotte: ${mockCagnotte.title} https://africagnotte.com/cagnotte/${cagnotteId}`)}`}
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
              value={`https://africagnotte.com/cagnotte/${cagnotteId}`}
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