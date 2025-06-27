import Navbar from '../../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Comment ça marche ? | AfricaGnotte',
  description: 'Découvrez comment créer une cagnotte sur AfricaGnotte en 4 étapes simples. Plateforme sécurisée de collecte de dons pour l\'Afrique.',
};

export default function CommentCaMarcheLayout({
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
