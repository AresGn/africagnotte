'use client';

import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaGlobe } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="py-12 bg-gray-900 text-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                AfricaGnotte
              </Link>
            </h3>
            <p className="mb-4">
              La première plateforme de collecte de dons 100% dédiée à l&apos;Afrique.
            </p>
            <div className="flex space-x-4 mb-4">
              {/* Social icons */}
              <a href="#" className="text-white hover:text-gray-300 text-2xl">
                <FaFacebook />
              </a>
              <a href="#" className="text-white hover:text-gray-300 text-2xl">
                <FaTwitter />
              </a>
              <a href="#" className="text-white hover:text-gray-300 text-2xl">
                <FaInstagram />
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <FaGlobe className="text-gray-400" />
              <select className="bg-gray-800 text-white px-2 py-1 rounded">
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li><Link href="/pourquoi-africagnotte" className="hover:text-gray-300">Pourquoi AfriCagnotte?</Link></li>
              <li><Link href="/comment-ca-marche" className="hover:text-gray-300">Comment ça marche</Link></li>
              <li><Link href="/centre-assistance" className="hover:text-gray-300">Centre d&apos;assistance</Link></li>
              <li><Link href="/garanties-securite" className="hover:text-gray-300">Garanties et sécurité</Link></li>
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
              <li><Link href="/nous-contacter" className="hover:text-gray-300">Nous contacter</Link></li>
              <li><Link href="/nous-recrutons" className="hover:text-gray-300">Nous recrutons</Link></li>
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