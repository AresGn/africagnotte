import Navbar from '../../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Notre Équipe - Les visages derrière AfricaGnotte | AfricaGnotte',
  description: 'Rencontrez l\'équipe passionnée qui travaille chaque jour pour faire d\'AfricaGnotte la première plateforme de solidarité africaine.',
};

export default function EquipeLayout({
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
