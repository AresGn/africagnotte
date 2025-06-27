import Navbar from '../../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Témoignages - Comment nous changeons des vies | AfricaGnotte',
  description: 'Découvrez les histoires inspirantes de personnes dont la vie a été transformée grâce à la solidarité de notre communauté AfricaGnotte.',
};

export default function TemoignagesLayout({
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
