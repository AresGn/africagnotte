import Navbar from '../../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Notre Mission - Transformer l\'Afrique par la solidarité | AfricaGnotte',
  description: 'Découvrez la mission d\'AfricaGnotte : créer une plateforme de collecte de dons 100% dédiée à l\'Afrique pour aider les personnes en difficulté et transformer des vies.',
};

export default function NotreMissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
