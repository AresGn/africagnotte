'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlay, FaHeart, FaUsers, FaCalendarAlt, FaArrowLeft, FaFacebook, FaTwitter, FaWhatsapp, FaSpinner, FaVideo } from 'react-icons/fa';
import { ImageComparison, ImageComparisonImage, ImageComparisonSlider } from '../../../components/ui/image-comparison';
import VideoPlayer from '../../../components/VideoPlayer';
import TestimonialReactions from '../../../components/TestimonialReactions';

// Interface pour les témoignages (même que dans la page principale)
interface Testimonial {
  id: string;
  name: string;
  age?: number;
  location: string;
  story: string;
  shortDescription: string;
  image: string;
  video?: string;
  amountRaised: number;
  donorsCount: number;
  category: string;
  date: string;
  impact: string[];
  beforeImage?: string;
  afterImage?: string;
  additionalImages?: string[];
}

// Données des témoignages de fallback (utilisées uniquement si l'API échoue)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fallbackTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Aminata Diallo',
    age: 8,
    location: 'Dakar, Sénégal',
    story: `Aminata était née avec une malformation cardiaque qui nécessitait une intervention chirurgicale urgente. Sa famille, sans moyens financiers suffisants, s'est tournée vers AfricaGnotte pour lancer une cagnotte.

Grâce à la générosité de 127 donateurs, nous avons pu réunir les fonds nécessaires pour son opération. Aujourd'hui, Aminata court, joue et va à l'école comme tous les enfants de son âge.

"Je peux maintenant courir avec mes amis et je rêve de devenir médecin pour aider d'autres enfants comme moi", dit-elle avec un grand sourire.

L'opération s'est déroulée avec succès à l'hôpital Aristide Le Dantec de Dakar. Les médecins ont confirmé que son cœur fonctionne parfaitement maintenant.

Sa famille exprime une gratitude immense envers tous les donateurs qui ont rendu ce miracle possible. Aminata peut maintenant envisager un avenir brillant et en bonne santé.`,
    shortDescription: 'Opération cardiaque réussie grâce à votre solidarité',
    image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop',
    beforeImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop',
    video: 'https://res.cloudinary.com/africagnotte/video/upload/v1/testimonials/aminata_story.mp4',
    amountRaised: 2500000,
    donorsCount: 127,
    category: 'Santé',
    date: '2024-03-15',
    impact: [
      'Opération cardiaque réussie',
      'Retour à l\'école normal',
      'Qualité de vie considérablement améliorée',
      'Famille soulagée et reconnaissante'
    ],
    additionalImages: [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop'
    ]
  },
  {
    id: '2',
    name: 'Mamadou Keita',
    age: 45,
    location: 'Bamako, Mali',
    story: `Mamadou était un père de famille qui avait perdu son emploi et sa maison dans un incendie. Avec ses 4 enfants, il se retrouvait dans une situation très difficile.

La communauté s'est mobilisée autour de sa cagnotte pour l'aider à reconstruire sa vie. En plus des fonds collectés, plusieurs donateurs ont proposé des opportunités d'emploi.

Aujourd'hui, Mamadou a un nouveau travail stable, ses enfants sont scolarisés et la famille a pu emménager dans un nouveau logement décent.

"AfricaGnotte m'a redonné espoir. Ce n'est pas seulement l'argent, c'est toute cette solidarité qui m'a permis de me relever", témoigne-t-il avec émotion.

La reconstruction n'a pas été facile, mais avec le soutien de la communauté, Mamadou a pu surmonter cette épreuve et offrir un nouveau départ à sa famille.`,
    shortDescription: 'Une famille reconstruite après un incendie',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    beforeImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    amountRaised: 1800000,
    donorsCount: 89,
    category: 'Urgence',
    date: '2024-02-20',
    impact: [
      'Nouveau logement sécurisé',
      'Emploi stable retrouvé',
      'Enfants rescolarisés',
      'Dignité familiale restaurée'
    ]
  },
  {
    id: '3',
    name: 'Fatou Sow',
    age: 23,
    location: 'Abidjan, Côte d\'Ivoire',
    story: `Fatou rêvait de devenir infirmière mais sa famille n'avait pas les moyens de financer ses études. Déterminée, elle a créé une cagnotte pour financer sa formation.

Sa détermination et son projet de formation ont touché de nombreuses personnes. Non seulement elle a atteint son objectif financier, mais plusieurs professionnels de santé l'ont également mentorée.

Aujourd'hui diplômée, Fatou travaille dans un centre de santé communautaire et aide à son tour d'autres jeunes à réaliser leurs rêves.

"Grâce à AfricaGnotte, j'ai pu réaliser mon rêve et maintenant j'aide d'autres personnes. C'est un cercle vertueux de solidarité", explique-t-elle fièrement.

Son parcours inspire maintenant d'autres jeunes femmes de sa communauté à poursuivre leurs études et leurs rêves professionnels.`,
    shortDescription: 'De rêve à réalité : devenir infirmière',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=600&fit=crop',
    beforeImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=600&fit=crop',
    video: 'https://res.cloudinary.com/africagnotte/video/upload/v1/testimonials/fatou_graduation.mp4',
    amountRaised: 950000,
    donorsCount: 156,
    category: 'Éducation',
    date: '2024-01-10',
    impact: [
      'Diplôme d\'infirmière obtenu',
      'Emploi dans le secteur de la santé',
      'Mentorat d\'autres jeunes',
      'Contribution au système de santé'
    ]
  }
];

export default function TestimonialDetailPage() {
  const params = useParams();
  const testimonialId = params?.id as string;
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const fetchTestimonial = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/testimonials/${testimonialId}`);
      const data = await response.json();

      if (data.success) {
        setTestimonial(data.data);
      } else {
        setError(data.error || 'Témoignage non trouvé');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Erreur lors du chargement du témoignage:', err);
    } finally {
      setLoading(false);
    }
  }, [testimonialId]);

  useEffect(() => {
    if (testimonialId) {
      fetchTestimonial();
    }
  }, [testimonialId, fetchTestimonial]);



  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = testimonial ? `Découvrez l'histoire inspirante de ${testimonial.name} sur AfricaGnotte` : '';

  if (loading) {
    return (
      <main className="pt-20 pb-10 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-amber-500 mx-auto mb-4" />
              <p className="text-gray-600">Chargement du témoignage...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !testimonial) {
    return (
      <main className="pt-20 pb-10 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-3xl font-bold mb-4">Témoignage introuvable</h1>
          <p className="text-gray-600 mb-8">{error || 'Ce témoignage n\'existe pas ou n\'est plus disponible.'}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={fetchTestimonial}
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Réessayer
            </button>
            <Link
              href="/temoignages"
              className="inline-flex items-center px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Retour aux témoignages
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 pb-10 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/temoignages"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Retour aux témoignages
          </Link>
        </div>

        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{testimonial.name}</h1>
          <p className="text-xl text-gray-600 mb-2">
            {testimonial.age && `${testimonial.age} ans, `}{testimonial.location}
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <FaCalendarAlt className="mr-1" />
              {formatDate(testimonial.date)}
            </span>
            <span className="flex items-center">
              <FaHeart className="mr-1" />
              {formatAmount(testimonial.amountRaised)}
            </span>
            <span className="flex items-center">
              <FaUsers className="mr-1" />
              {testimonial.donorsCount} donateurs
            </span>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Vidéo ou image principale */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {isVideoPlaying && testimonial.video ? (
                <VideoPlayer
                  src={testimonial.video}
                  poster={testimonial.image}
                  title={`Témoignage de ${testimonial.name}`}
                  className="aspect-video w-full"
                  autoPlay={true}
                />
              ) : (
                <div className="aspect-video relative">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                  {testimonial.video && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => setIsVideoPlaying(true)}
                        className="w-20 h-20 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all group"
                      >
                        <FaPlay className="text-white text-2xl ml-1 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Bouton pour basculer entre vidéo et image */}
              {testimonial.video && (
                <div className="p-4 bg-gray-50 border-t">
                  <button
                    onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                    className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors"
                  >
                    <FaVideo className="mr-2" />
                    {isVideoPlaying ? 'Voir la photo' : 'Voir la vidéo'}
                  </button>
                </div>
              )}
            </div>

            {/* Comparaison avant/après */}
            {testimonial.beforeImage && testimonial.afterImage && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold mb-6 text-center">Transformation</h3>
                <ImageComparison
                  className="aspect-video w-full rounded-lg border border-gray-200"
                  enableHover
                  springOptions={{ bounce: 0.3 }}
                >
                  <ImageComparisonImage
                    src={testimonial.beforeImage}
                    alt={`${testimonial.name} - Avant`}
                    position="left"
                  />
                  <ImageComparisonImage
                    src={testimonial.afterImage}
                    alt={`${testimonial.name} - Après`}
                    position="right"
                  />
                  <ImageComparisonSlider className="w-1 bg-white/80 backdrop-blur-sm">
                    <div className="absolute left-1/2 top-1/2 h-8 w-6 -translate-x-1/2 -translate-y-1/2 rounded bg-white shadow-lg" />
                  </ImageComparisonSlider>
                </ImageComparison>
                <div className="flex justify-between mt-4 text-sm text-gray-600">
                  <span>Avant</span>
                  <span>Après</span>
                </div>
              </div>
            )}

            {/* Histoire complète */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Son histoire</h3>
              <div className="prose max-w-none">
                {testimonial.story.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistiques */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Résultats</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {formatAmount(testimonial.amountRaised)}
                  </div>
                  <div className="text-sm text-gray-600">Montant collecté</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {testimonial.donorsCount}
                  </div>
                  <div className="text-sm text-gray-600">Donateurs généreux</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-amber-600">
                    {testimonial.category}
                  </div>
                  <div className="text-sm text-gray-600">Catégorie</div>
                </div>
              </div>
            </div>

            {/* Système de réactions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Votre réaction</h3>
              <TestimonialReactions testimonialId={testimonial.id} />
            </div>

            {/* Impact */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Impact réalisé</h3>
              <ul className="space-y-3">
                {testimonial.impact.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <FaHeart className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Partage */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Partager cette histoire</h3>
              <div className="flex space-x-3">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <FaFacebook />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-400 text-white p-3 rounded-lg hover:bg-blue-500 transition-colors flex items-center justify-center"
                >
                  <FaTwitter />
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                >
                  <FaWhatsapp />
                </a>
              </div>
            </div>

            {/* Call to action */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg p-6 text-white text-center">
              <h3 className="text-xl font-bold mb-4">Vous aussi, faites la différence</h3>
              <p className="mb-6 opacity-90">
                Chaque don peut transformer une vie. Rejoignez notre communauté.
              </p>
              <div className="space-y-3">
                <Link
                  href="/cagnottes"
                  className="block w-full bg-white text-amber-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Découvrir les cagnottes
                </Link>
                <Link
                  href="/creer"
                  className="block w-full border-2 border-white text-white py-3 rounded-lg font-semibold hover:bg-white hover:text-amber-600 transition-colors"
                >
                  Créer une cagnotte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
