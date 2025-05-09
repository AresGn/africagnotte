import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ConnexionLayout({
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