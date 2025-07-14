'use client';

import { Heart, Users, Shield, Globe, Target, Lightbulb } from 'lucide-react';
import Link from 'next/link';

export default function NotreMissionPage() {
  return (
    <main className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--light-color)' }}>
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ color: 'var(--dark-color)' }}>
              Notre Mission
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed mb-8" style={{ color: 'var(--dark-color)' }}>
              Transformer l&apos;Afrique par la solidarité et créer un impact durable
              dans la vie des personnes les plus vulnérables
            </p>
            <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></div>
          </div>
        </div>
      </section>

      {/* Vision et Mission */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--dark-color)' }}>
                Notre Vision
              </h2>
              <p className="text-lg leading-relaxed mb-6 text-gray-700">
                Nous rêvons d&apos;une Afrique où chaque personne en difficulté peut compter sur
                la solidarité de sa communauté. Une Afrique où la technologie rapproche les cœurs
                et où l&apos;entraide transcende les frontières.
              </p>
              <div className="flex items-center space-x-3 mb-4">
                <Heart className="w-6 h-6" style={{ color: 'var(--primary-color)' }} />
                <span className="font-semibold">Solidarité africaine</span>
              </div>
              <div className="flex items-center space-x-3 mb-4">
                <Globe className="w-6 h-6" style={{ color: 'var(--primary-color)' }} />
                <span className="font-semibold">Impact continental</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6" style={{ color: 'var(--primary-color)' }} />
                <span className="font-semibold">Transparence totale</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-yellow-100 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--dark-color)' }}>
                Pourquoi AfricaGnotte ?
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--primary-color)' }}></div>
                  <span>100% dédiée aux causes africaines</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--primary-color)' }}></div>
                  <span>Adaptée aux moyens de paiement locaux</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--primary-color)' }}></div>
                  <span>Interface en français et langues locales</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--primary-color)' }}></div>
                  <span>Frais réduits pour maximiser l&apos;impact</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Objectifs */}
      <section className="py-16" style={{ backgroundColor: 'var(--light-color)' }}>
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--dark-color)' }}>
            Nos Objectifs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary-color)' }}>
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--dark-color)' }}>
                Connecter les Communautés
              </h3>
              <p className="text-gray-700">
                Créer un réseau de solidarité qui unit les Africains du continent et de la diaspora 
                autour de causes communes.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--secondary-color)' }}>
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--dark-color)' }}>
                Maximiser l&apos;Impact
              </h3>
              <p className="text-gray-700">
                Assurer que chaque don atteint directement les bénéficiaires avec un maximum 
                de transparence et d&apos;efficacité.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-color)' }}>
                <Lightbulb className="w-8 h-8" style={{ color: 'var(--dark-color)' }} />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--dark-color)' }}>
                Innover pour l&apos;Afrique
              </h3>
              <p className="text-gray-700">
                Développer des solutions technologiques adaptées aux réalités africaines 
                et aux besoins spécifiques du continent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: 'var(--dark-color)' }}>
            Nos Valeurs Fondamentales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Transparence",
                description: "Chaque don est tracé et chaque utilisation est documentée",
                icon: "🔍"
              },
              {
                title: "Solidarité",
                description: "L&apos;entraide africaine au cœur de notre mission",
                icon: "🤝"
              },
              {
                title: "Authenticité",
                description: "Vérification rigoureuse de chaque cause soutenue",
                icon: "✅"
              },
              {
                title: "Accessibilité",
                description: "Une plateforme simple et accessible à tous",
                icon: "🌍"
              }
            ].map((valeur, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{valeur.icon}</div>
                <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--dark-color)' }}>
                  {valeur.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {valeur.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-6">
            Rejoignez Notre Mission
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Ensemble, nous pouvons transformer des vies et construire une Afrique plus solidaire. 
            Chaque geste compte, chaque don fait la différence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/creer" className="px-8 py-3 bg-white text-xl font-semibold rounded-md hover:bg-gray-100 transition-colors" style={{ color: 'var(--primary-color)' }}>
              Créer une cagnotte
            </Link>
            <Link href="/cagnottes" className="px-8 py-3 border-2 border-white text-xl font-semibold rounded-md hover:bg-white hover:text-orange-600 transition-colors">
              Soutenir une cause
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
