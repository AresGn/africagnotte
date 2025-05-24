import Navbar from '../../components/Navbar';
import Footer from '../components/Footer';

export default function CagnottesLayout({
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