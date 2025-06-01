'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaCheckCircle, FaHeart, FaShare, FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa';

interface PaymentSuccessProps {
  cagnotteId: string;
  cagnotteTitle: string;
  amount: number;
  donorName: string;
  isAnonymous: boolean;
  customUrl?: string;
}

export default function PaymentSuccess({ 
  cagnotteId, 
  cagnotteTitle, 
  amount, 
  donorName, 
  isAnonymous,
  customUrl 
}: PaymentSuccessProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Masquer les confettis après 3 secondes
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cagnotteUrl = customUrl ? `/c/${customUrl}` : `/cagnotte/${cagnotteId}`;
  const shareText = `Je viens de participer à la cagnotte "${cagnotteTitle}" avec ${formatAmount(amount)}. Rejoignez-moi pour soutenir cette cause !`;
  const shareUrl = `https://africagnotte.com${cagnotteUrl}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-green-50 flex items-center justify-center p-4">
      {/* Effet confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-10">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              >
                <div className="w-2 h-2 bg-lime-400 rounded-full opacity-70"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative z-20">
        {/* Icône de succès */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-4xl text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Merci pour votre générosité !
          </h1>
          <p className="text-gray-600">
            Votre don a été traité avec succès
          </p>
        </div>

        {/* Détails du don */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Montant :</span>
            <span className="font-bold text-lg text-lime-600">{formatAmount(amount)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Donateur :</span>
            <span className="font-medium">{isAnonymous ? 'Anonyme' : donorName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Cagnotte :</span>
            <span className="font-medium text-sm">{cagnotteTitle}</span>
          </div>
        </div>

        {/* Message de remerciement */}
        <div className="mb-6">
          <div className="flex items-center justify-center mb-3">
            <FaHeart className="text-red-500 mr-2" />
            <span className="text-gray-700 font-medium">Votre soutien fait la différence</span>
          </div>
          <p className="text-sm text-gray-600">
            Un email de confirmation vous a été envoyé. 
            Vous pouvez suivre l'évolution de la cagnotte à tout moment.
          </p>
        </div>

        {/* Partage */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center justify-center">
            <FaShare className="mr-2" />
            Partagez pour amplifier l'impact
          </h3>
          <div className="flex justify-center space-x-3">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <FaFacebook />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
            >
              <FaTwitter />
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href={cagnotteUrl}
            className="w-full bg-lime-500 hover:bg-lime-600 text-white font-bold py-3 px-6 rounded-lg transition-colors block"
          >
            Voir la cagnotte
          </Link>
          <Link
            href="/cagnottes"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors block"
          >
            Découvrir d'autres cagnottes
          </Link>
        </div>

        {/* Note légale */}
        <div className="mt-6 text-xs text-gray-500">
          <p>
            Votre don est sécurisé et traité selon nos standards de sécurité les plus élevés.
            Pour toute question, contactez notre support.
          </p>
        </div>
      </div>
    </div>
  );
}
