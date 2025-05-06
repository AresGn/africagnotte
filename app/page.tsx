import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <nav className="py-4 bg-white shadow-md">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-color)' }}>
              AfricaGnotte
            </h1>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="font-medium hover:text-amber-500 transition-colors">
              Accueil
            </Link>
            <Link href="/cagnottes" className="font-medium hover:text-amber-500 transition-colors">
              Découvrir
            </Link>
            <Link href="/creer" className="font-medium hover:text-amber-500 transition-colors">
              Créer une cagnotte
            </Link>
            <Link href="/comment-ca-marche" className="font-medium hover:text-amber-500 transition-colors">
              Comment ça marche
            </Link>
          </div>
          <div className="flex space-x-3">
            <Link href="/connexion" className="btn-secondary">
              Connexion
            </Link>
            <Link href="/inscription" className="btn-primary">
              Inscription
            </Link>
          </div>
          <button className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--light-color)' }}>
        <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--dark-color)' }}>
              Soutenez des causes africaines qui en ont besoin
            </h1>
            <p className="text-lg mb-8">
              AfricaGnotte est la première plateforme de collecte de dons 100% dédiée à l'Afrique, 
              centrée sur l'aide aux personnes en difficulté.
            </p>
            <div className="flex space-x-4">
              <Link href="/creer" className="btn-primary">
                Créer une cagnotte
              </Link>
              <Link href="/cagnottes" className="btn-secondary">
                Découvrir les projets
              </Link>
            </div>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gray-800 opacity-20 z-10 rounded-lg"></div>
            <Image 
              src="/images/hero-image.jpg" 
              alt="Aide humanitaire en Afrique" 
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-10 text-center" style={{ color: 'var(--dark-color)' }}>
            Catégories de cagnottes
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Santé', 'Famille', 'Orphelins', 'Urgences'].map((category) => (
              <Link href={`/category/${category.toLowerCase()}`} key={category} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                <div className="h-16 w-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
                    style={{ backgroundColor: 'var(--accent-color)' }}>
                  {/* Icon placeholder */}
                  <span className="text-2xl">🤲</span>
                </div>
                <h3 className="font-semibold" style={{ color: 'var(--dark-color)' }}>{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Campaigns Section */}
      <section className="py-16" style={{ backgroundColor: 'var(--light-color)' }}>
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-2 text-center" style={{ color: 'var(--dark-color)' }}>
            Cagnottes à la une
          </h2>
          <p className="text-center mb-10">Découvrez des causes qui ont besoin de votre soutien</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
                  <Image 
                    src={`/images/campaign-${item}.jpg`} 
                    alt="Campagne" 
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 text-xs rounded-full mb-3" 
                      style={{ backgroundColor: 'var(--accent-color)', color: 'var(--dark-color)' }}>
                    Santé
                  </span>
                  <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--dark-color)' }}>
                    Soutien médical pour les enfants
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    Aidez-nous à financer des soins médicaux pour les enfants malades.
                  </p>
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full" style={{ width: '70%', backgroundColor: 'var(--secondary-color)' }}></div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <span>7 000 000 FCFA</span>
                      <span>10 000 000 FCFA</span>
                    </div>
                  </div>
                  <Link href={`/cagnotte/${item}`} className="btn-primary w-full block text-center">
                    Faire un don
                  </Link>
                </div>
              </div>
            ))}
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((testimonial) => (
              <div key={testimonial} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start mb-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
                    <Image 
                      src={`/images/testimonial-${testimonial}.jpg`} 
                      alt="Témoignage" 
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold">Amina K.</h3>
                    <p className="text-sm text-gray-600">Bénéficiaire d'une cagnotte médicale</p>
                  </div>
                </div>
                <p className="italic">
                  "Grâce à AfricaGnotte, j'ai pu financer l'opération dont j'avais besoin. 
                  Je suis infiniment reconnaissante envers tous les donateurs qui m'ont soutenue."
                </p>
              </div>
            ))}
          </div>
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

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">AfricaGnotte</h3>
              <p className="mb-4">
                La première plateforme de collecte de dons 100% dédiée à l'Afrique.
              </p>
              <div className="flex space-x-4">
                {/* Social icons */}
                <a href="#" className="text-white hover:text-gray-300">
                  <span>FB</span>
                </a>
                <a href="#" className="text-white hover:text-gray-300">
                  <span>TW</span>
                </a>
                <a href="#" className="text-white hover:text-gray-300">
                  <span>IG</span>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Liens utiles</h3>
              <ul className="space-y-2">
                <li><Link href="/a-propos" className="hover:text-gray-300">À propos</Link></li>
                <li><Link href="/comment-ca-marche" className="hover:text-gray-300">Comment ça marche</Link></li>
                <li><Link href="/creer" className="hover:text-gray-300">Créer une cagnotte</Link></li>
                <li><Link href="/cagnottes" className="hover:text-gray-300">Découvrir les cagnottes</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Catégories</h3>
              <ul className="space-y-2">
                <li><Link href="/category/sante" className="hover:text-gray-300">Santé</Link></li>
                <li><Link href="/category/famille" className="hover:text-gray-300">Famille</Link></li>
                <li><Link href="/category/orphelins" className="hover:text-gray-300">Orphelins</Link></li>
                <li><Link href="/category/urgences" className="hover:text-gray-300">Urgences</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li>Email: contact@africagnotte.com</li>
                <li>Téléphone: +xxx xxx xxx xxx</li>
                <li>WhatsApp: +xxx xxx xxx xxx</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} AfricaGnotte. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </main>
  );
} 