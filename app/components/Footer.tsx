'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-12 bg-gray-900 text-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">AfricaGnotte</h3>
            <p className="mb-4">
              La première plateforme de collecte de dons 100% dédiée à l&apos;Afrique.
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
  );
} 