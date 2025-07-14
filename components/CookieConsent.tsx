'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface CookieConsentProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

export default function CookieConsent({ onAccept, onDecline }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait un choix
    const cookieChoice = localStorage.getItem('africagnotte-cookie-consent');
    if (!cookieChoice) {
      setIsVisible(true);
    }
    setIsLoading(false);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('africagnotte-cookie-consent', 'accepted');
    localStorage.setItem('africagnotte-cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
    
    // Activer les cookies/analytics ici
    if (typeof window !== 'undefined') {
      // Exemple : Google Analytics, Facebook Pixel, etc.
      console.log('Cookies acceptés - Activation des services analytics');
    }
    
    onAccept?.();
  };

  const handleDecline = () => {
    localStorage.setItem('africagnotte-cookie-consent', 'declined');
    localStorage.setItem('africagnotte-cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
    
    // Désactiver les cookies non essentiels
    if (typeof window !== 'undefined') {
      console.log('Cookies refusés - Seuls les cookies essentiels sont utilisés');
    }
    
    onDecline?.();
  };

  const handleClose = () => {
    // Fermer sans choix équivaut à refuser
    handleDecline();
  };

  // Ne pas afficher pendant le chargement ou si déjà choisi
  if (isLoading || !isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center p-4 pointer-events-none">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 max-w-2xl w-full pointer-events-auto animate-slide-up">
        <div className="p-6">
          {/* Bouton de fermeture */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contenu principal */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">
              Qui refuse encore de bons cookies 🍪 en 2025 ?
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Nous utilisons des cookies afin d'améliorer votre expérience de visite, 
              vous proposer des contenus personnalisés, développer nos services et 
              mesurer notre audience. Vous pouvez accepter ou refuser ces cookies.
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAccept}
              className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Accepter
            </button>
            <button
              onClick={handleDecline}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Continuer sans accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utilitaires pour gérer les cookies
export const CookieUtils = {
  // Vérifier si les cookies sont acceptés
  isAccepted: (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('africagnotte-cookie-consent') === 'accepted';
  },

  // Vérifier si l'utilisateur a fait un choix
  hasChoice: (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('africagnotte-cookie-consent') !== null;
  },

  // Obtenir la date du choix
  getChoiceDate: (): Date | null => {
    if (typeof window === 'undefined') return null;
    const dateStr = localStorage.getItem('africagnotte-cookie-consent-date');
    return dateStr ? new Date(dateStr) : null;
  },

  // Réinitialiser le choix (pour les paramètres utilisateur)
  resetChoice: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('africagnotte-cookie-consent');
    localStorage.removeItem('africagnotte-cookie-consent-date');
  }
};
