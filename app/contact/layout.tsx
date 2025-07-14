import Navbar from '../../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Contactez-nous - Nous sommes là pour vous aider | AfricaGnotte',
  description: 'Contactez l\'équipe AfricaGnotte pour toute question, suggestion ou collaboration. Nous sommes disponibles pour vous accompagner dans vos projets de solidarité.',
};

export default function ContactLayout({
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
