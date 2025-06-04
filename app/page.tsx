'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from './components/Footer';
import CampaignCard from './components/CampaignCard';
import HeroSection from './components/HeroSection';
import { AnimatedTestimonialsDemo } from './components/ui/animated-testimonials-demo';
import { CategoryTabsDemo } from './components/ui/category-tabs-demo';
import { toast } from 'react-hot-toast';

// Interface pour les cagnottes
interface Campaign {
  id: string;
  title: string;
  custom_url: string | null;
  category: string;
  description: string;
  images: string[];
  current_amount: number;
  target_amount: number | null;
  show_target: boolean;
}

export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeaturedCampaigns() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/cagnottes/featured');

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Impossible de charger les cagnottes en vedette');
        }

        const data: Campaign[] = await response.json();
        setCampaigns(data);

      } catch (err) {
        console.error('Erreur lors du chargement des cagnottes en vedette:', err);
        setError((err as Error).message || 'Impossible de charger les cagnottes en vedette');
        toast.error((err as Error).message || 'Erreur lors du chargement des cagnottes en vedette');
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedCampaigns();
  }, []);

  return (
    <main className="min-h-screen pt-16">
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-10 text-center" style={{ color: 'var(--dark-color)' }}>
            Catégories de cagnottes
          </h2>
          <CategoryTabsDemo />
        </div>
      </section>

      {/* Featured Campaigns Section */}
      <section className="py-16" style={{ backgroundColor: 'var(--light-color)' }}>
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-2 text-center" style={{ color: 'var(--dark-color)' }}>
            Cagnottes à la une
          </h2>
          <p className="text-center mb-10">Découvrez des causes qui ont besoin de votre soutien</p>

          {loading ? (
            <div className="text-center py-10">
              <p className="text-lg">Chargement des cagnottes en vedette...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary"
              >
                Réessayer
              </button>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xl mb-4">Aucune cagnotte en vedette pour le moment</p>
              <Link href="/creer" className="btn-secondary">
                Créer la première cagnotte
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {campaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  id={campaign.id}
                  imageUrl={campaign.images[0] || '/images/default-campaign.jpg'}
                  title={campaign.title}
                  description={campaign.description}
                  category={campaign.category}
                  currentAmount={campaign.current_amount}
                  targetAmount={campaign.target_amount || 0}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/cagnottes" className="btn-secondary">
              Voir toutes les cagnottes
            </Link>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--dark-color)' }}>
            Comment ça marche ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: 'Créez votre cagnotte', description: 'Inscrivez-vous et créez une cagnotte en quelques clics' },
              { title: 'Partagez largement', description: 'Partagez votre cagnotte sur les réseaux sociaux et WhatsApp' },
              { title: 'Recevez les fonds', description: 'Recevez directement les fonds sur votre compte Mobile Money ou bancaire' }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center h-20 w-20 mx-auto mb-4 rounded-full text-white text-xl font-bold"
                    style={{ backgroundColor: 'var(--primary-color)' }}>
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--dark-color)' }}>{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/comment-ca-marche" className="btn-secondary">
              En savoir plus
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16" style={{ backgroundColor: 'var(--accent-color)', color: 'var(--dark-color)' }}>
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Ils ont été aidés
          </h2>
          <AnimatedTestimonialsDemo />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à lancer votre cagnotte ?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Créez votre cagnotte en quelques minutes et partagez-la facilement avec votre communauté.
          </p>
          <Link href="/creer" className="px-8 py-3 bg-white text-xl font-semibold rounded-md" style={{ color: 'var(--primary-color)' }}>
            Créer ma cagnotte
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}