'use client';

import { useParams } from 'next/navigation';
import CagnotteDetailView from '../../../components/CagnotteDetailView';
import { useCagnotte } from '../../../hooks/useCagnotte';
import ApiTestPanel from '../../../components/ApiTestPanel';

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
  const cagnotteId = params?.id as string;

  // Utiliser le hook personnalisé pour charger la cagnotte
  const { cagnotte, loading, error } = useCagnotte(cagnotteId || '');

  // Utiliser les données réelles ou fictives en cas d'erreur
  const currentCagnotte = cagnotte || {
    ...mockCagnotte,
    currentAmount: mockCagnotte.currentAmount,
    targetAmount: mockCagnotte.targetAmount,
    createdAt: mockCagnotte.createdAt,
    // Transformer les donations pour correspondre au format API
    donations: mockCagnotte.donations.map(donation => ({
      id: donation.id.toString(),
      donor_name: donation.name,
      amount: donation.amount,
      comment: donation.comment,
      created_at: donation.date.toISOString()
    })),
    // Transformer les actualités pour correspondre au format API
    actualites: mockCagnotte.actualites.map(actu => ({
      id: actu.id.toString(),
      title: actu.titre,
      content: actu.contenu,
      created_at: actu.date.toISOString(),
      video_url: actu.video,
      images: actu.images,
      amount_at_time: actu.montantCollecte
    }))
  };

  // Afficher l'erreur si elle existe (pour debug)
  if (error && process.env.NODE_ENV === 'development') {
    console.warn('Erreur de chargement de la cagnotte:', error);
  }

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

  return (
    <>
      <CagnotteDetailView cagnotte={currentCagnotte} cagnotteId={cagnotteId} />
      <ApiTestPanel cagnotteId={cagnotteId} userId="bf93c980-aab1-47ad-83c0-ab4e91e59cd3" />
    </>
  );
}