'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlay, FaQuoteLeft, FaHeart, FaUsers, FaCalendarAlt, FaSpinner, FaVideo } from 'react-icons/fa';
import VideoPlayer from '../../components/VideoPlayer';
import TestimonialReactions from '../../components/TestimonialReactions';

// Interface pour les témoignages
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
  isFeatured?: boolean;
}

export default function TemoignagesPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/testimonials');
      const data = await response.json();

      if (data.success) {
        setTestimonials(data.data);
      } else {
        setError(data.error || 'Erreur lors du chargement des témoignages');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Erreur lors du chargement des témoignages:', err);
    } finally {
      setLoading(false);
    }
  };

  // Données statiques de fallback (à supprimer une fois la DB configurée)
  const fallbackTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Aminata Diallo',
    age: 8,
    location: 'Dakar, Sénégal',
    story: `Aminata était née avec une malformation cardiaque qui nécessitait une intervention chirurgicale urgente. Sa famille, sans moyens financiers suffisants, s'est tournée vers AfricaGnotte pour lancer une cagnotte.

Grâce à la générosité de 127 donateurs, nous avons pu réunir les fonds nécessaires pour son opération. Aujourd'hui, Aminata court, joue et va à l'école comme tous les enfants de son âge.

"Je peux maintenant courir avec mes amis et je rêve de devenir médecin pour aider d'autres enfants comme moi", dit-elle avec un grand sourire.

L'opération s'est déroulée avec succès à l'hôpital Aristide Le Dantec de Dakar. Les médecins ont confirmé que son cœur fonctionne parfaitement maintenant.`,
    shortDescription: 'Opération cardiaque réussie grâce à votre solidarité',
    image: 'https://res.cloudinary.com/africagnotte/image/upload/v1/testimonials/aminata_after.jpg',
    beforeImage: 'https://res.cloudinary.com/africagnotte/image/upload/v1/testimonials/aminata_before.jpg',
    afterImage: 'https://res.cloudinary.com/africagnotte/image/upload/v1/testimonials/aminata_after.jpg',
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

"AfricaGnotte m'a redonné espoir. Ce n'est pas seulement l'argent, c'est toute cette solidarité qui m'a permis de me relever", témoigne-t-il avec émotion.`,
    shortDescription: 'Une famille reconstruite après un incendie',
    image: 'https://res.cloudinary.com/africagnotte/image/upload/v1/testimonials/mamadou_family.jpg',
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

Sa détermination et son projet ont touché de nombreuses personnes. Non seulement elle a atteint son objectif financier, mais plusieurs professionnels de santé l'ont également mentorée.

Aujourd'hui diplômée, Fatou travaille dans un centre de santé communautaire et aide à son tour d'autres jeunes à réaliser leurs rêves.

"Grâce à AfricaGnotte, j'ai pu réaliser mon rêve et maintenant j'aide d'autres personnes. C'est un cercle vertueux de solidarité", explique-t-elle fièrement.`,
    shortDescription: 'De rêve à réalité : devenir infirmière',
    image: 'https://res.cloudinary.com/africagnotte/image/upload/v1/testimonials/fatou_nurse.jpg',
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
  },
  {
    id: '4',
    name: 'Khadija Ouattara',
    age: 35,
    location: 'Ouagadougou, Burkina Faso',
    story: `Khadija était une mère célibataire de trois enfants qui avait perdu son petit commerce à cause de la pandémie. Sans revenus, elle ne pouvait plus nourrir sa famille ni payer le loyer.

Sa situation désespérée l'a poussée à créer une cagnotte sur AfricaGnotte. La réponse de la communauté a été immédiate et touchante. En plus des dons, plusieurs personnes lui ont proposé des opportunités d'emploi et des formations.

Aujourd'hui, Khadija a relancé son commerce avec un capital plus important et emploie même deux autres femmes de son quartier. Elle est devenue un exemple d'entrepreneuriat féminin dans sa communauté.

"AfricaGnotte ne m'a pas seulement aidée financièrement, mais m'a redonné confiance en moi et en l'avenir", témoigne-t-elle avec fierté.`,
    shortDescription: 'De la précarité à l\'entrepreneuriat réussi',
    image: 'https://res.cloudinary.com/africagnotte/image/upload/v1/testimonials/khadija_business.jpg',
    amountRaised: 750000,
    donorsCount: 67,
    category: 'Entrepreneuriat',
    date: '2023-12-05',
    impact: [
      'Commerce relancé avec succès',
      'Création d\'emplois pour 2 femmes',
      'Autonomie financière retrouvée',
      'Modèle d\'inspiration communautaire'
    ]
  },
  {
    id: '5',
    name: 'Ibrahim Traoré',
    age: 19,
    location: 'Conakry, Guinée',
    story: `Ibrahim était un jeune orphelin très doué en informatique mais sans moyens pour poursuivre ses études. Il rêvait de devenir développeur web pour sortir de la pauvreté.

Sa détermination et son projet de formation en développement web ont touché de nombreux donateurs. Plusieurs développeurs professionnels se sont même proposés pour le mentorer gratuitement.

Après 18 mois de formation intensive, Ibrahim travaille maintenant comme développeur freelance et gagne suffisamment pour subvenir à ses besoins et aider d'autres jeunes de son orphelinat.

"La technologie m'a ouvert les portes du monde entier. Maintenant, je peux travailler pour des clients partout en Afrique et même en Europe", explique-t-il avec enthousiasme.`,
    shortDescription: 'De l\'orphelinat au succès numérique',
    image: 'https://res.cloudinary.com/africagnotte/image/upload/v1/testimonials/ibrahim_coding.jpg',
    video: 'https://res.cloudinary.com/africagnotte/video/upload/v1/testimonials/ibrahim_success.mp4',
    amountRaised: 650000,
    donorsCount: 94,
    category: 'Éducation',
    date: '2023-11-20',
    impact: [
      'Formation en développement web complétée',
      'Emploi stable en freelance',
      'Mentorat d\'autres jeunes',
      'Indépendance financière'
    ]
  }
];

  // Utiliser les données de l'API ou les données de fallback
  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

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

  if (loading) {
    return (
      <main className="pt-20 pb-10 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-amber-500 mx-auto mb-4" />
              <p className="text-gray-600">Chargement des témoignages...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-20 pb-10 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchTestimonials}
                className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 pb-10 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--dark-color)' }}>
            Comment nous changeons des vies
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les histoires inspirantes de personnes dont la vie a été transformée grâce à la solidarité de notre communauté.
            Chaque témoignage est une preuve concrète de l&apos;impact positif que nous créons ensemble.
          </p>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold mb-2" style={{ color: 'var(--primary-color)' }}>
              500+
            </div>
            <div className="text-gray-600">Vies changées</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold mb-2" style={{ color: 'var(--secondary-color)' }}>
              {formatAmount(displayTestimonials.reduce((total, t) => total + t.amountRaised, 0))}
            </div>
            <div className="text-gray-600">FCFA collectés</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold mb-2" style={{ color: 'var(--accent-color)' }}>
              {displayTestimonials.reduce((total, t) => total + t.donorsCount, 0)}
            </div>
            <div className="text-gray-600">Donateurs généreux</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold mb-2" style={{ color: 'var(--primary-color)' }}>
              100%
            </div>
            <div className="text-gray-600">Taux de réussite</div>
          </div>
        </div>

        {/* Liste des témoignages */}
        <div className="space-y-8">
          {displayTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                {/* Image principale ou vidéo */}
                <div className="md:w-1/3 relative">
                  <div className="aspect-square md:aspect-auto md:h-full relative">
                    {playingVideo === testimonial.id && testimonial.video ? (
                      <VideoPlayer
                        src={testimonial.video}
                        poster={testimonial.image}
                        title={`Témoignage de ${testimonial.name}`}
                        className="w-full h-full rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                        autoPlay={true}
                      />
                    ) : (
                      <>
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                        />
                        {testimonial.video && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <button
                              onClick={() => setPlayingVideo(testimonial.id)}
                              className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all group"
                            >
                              <FaPlay className="text-white text-xl ml-1 group-hover:scale-110 transition-transform" />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Contenu */}
                <div className="md:w-2/3 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{testimonial.name}</h3>
                      <p className="text-gray-600 mb-2">
                        {testimonial.age && `${testimonial.age} ans, `}{testimonial.location}
                      </p>
                      <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
                        {testimonial.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">
                        <FaCalendarAlt className="inline mr-1" />
                        {formatDate(testimonial.date)}
                      </div>
                      {testimonial.video && (
                        <button
                          onClick={() => setPlayingVideo(playingVideo === testimonial.id ? null : testimonial.id)}
                          className="mt-2 inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full hover:bg-amber-200 transition-colors"
                        >
                          <FaVideo className="mr-1" />
                          {playingVideo === testimonial.id ? 'Voir photo' : 'Voir vidéo'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <FaQuoteLeft className="text-amber-500 text-2xl mb-2" />
                    <p className="text-lg font-medium text-gray-800 mb-3">
                      {testimonial.shortDescription}
                    </p>
                    <p className="text-gray-700 line-clamp-3">
                      {testimonial.story.split('\n')[0]}...
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-green-600">
                        <FaHeart className="mr-1" />
                        <span className="font-semibold">{formatAmount(testimonial.amountRaised)}</span>
                      </div>
                      <div className="flex items-center text-blue-600">
                        <FaUsers className="mr-1" />
                        <span>{testimonial.donorsCount} donateurs</span>
                      </div>
                    </div>
                  </div>

                  {/* Système de réactions */}
                  <div className="mb-4">
                    <TestimonialReactions testimonialId={testimonial.id} />
                  </div>

                  <Link
                    href={`/temoignages/${testimonial.id}`}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 text-center block"
                  >
                    Lire l&apos;histoire complète
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </main>
  );
}
