'use client';

import Image from 'next/image';
import { FaUsers, FaCalendarAlt } from 'react-icons/fa';
import { CagnotteDetailData } from './CagnotteDetailView';

interface CagnotteSummaryProps {
  cagnotte: CagnotteDetailData;
}

export default function CagnotteSummary({ cagnotte }: CagnotteSummaryProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const currentAmount = cagnotte.current_amount || cagnotte.currentAmount || 0;
  const targetAmount = cagnotte.target_amount || cagnotte.targetAmount;
  const createdDate = cagnotte.created_at ? new Date(cagnotte.created_at) : cagnotte.createdAt || new Date();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-start space-x-4">
        {/* Image de la cagnotte */}
        {cagnotte.images && cagnotte.images.length > 0 && (
          <div className="flex-shrink-0">
            <div className="w-20 h-20 relative rounded-lg overflow-hidden">
              <Image
                src={cagnotte.images[0]}
                alt={cagnotte.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        )}

        {/* Informations de la cagnotte */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {cagnotte.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {cagnotte.category}
          </p>
          
          {/* Progression */}
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-900">
                {formatAmount(currentAmount)} collectés
              </span>
              {targetAmount && cagnotte.show_target && (
                <span className="text-gray-500">
                  sur {formatAmount(targetAmount)}
                </span>
              )}
            </div>
            
            {targetAmount && cagnotte.show_target && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-lime-400 to-lime-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((currentAmount / targetAmount) * 100, 100)}%`
                  }}
                ></div>
              </div>
            )}
          </div>

          {/* Statistiques */}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <FaUsers className="mr-1" />
              <span>{cagnotte.participants || 0} participants</span>
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-1" />
              <span>Lancée le {formatDate(createdDate)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
