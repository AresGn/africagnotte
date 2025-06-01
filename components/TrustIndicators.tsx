'use client';

import { FaShieldAlt, FaUsers, FaHeart, FaGlobe } from 'react-icons/fa';

export default function TrustIndicators() {
  const indicators = [
    {
      icon: FaShieldAlt,
      title: 'Sécurisé',
      description: 'Transactions cryptées SSL/TLS',
      color: 'text-green-600'
    },
    {
      icon: FaUsers,
      title: '10,000+',
      description: 'Donateurs actifs',
      color: 'text-blue-600'
    },
    {
      icon: FaHeart,
      title: '500+',
      description: 'Cagnottes financées',
      color: 'text-red-600'
    },
    {
      icon: FaGlobe,
      title: 'Afrique',
      description: 'Présent dans 15 pays',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h3 className="text-lg font-semibold text-center mb-4 text-gray-800">
        Pourquoi nous faire confiance ?
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {indicators.map((indicator, index) => {
          const Icon = indicator.icon;
          return (
            <div key={index} className="text-center">
              <div className={`${indicator.color} mb-2 flex justify-center`}>
                <Icon className="text-2xl" />
              </div>
              <div className="font-semibold text-gray-800 text-sm">
                {indicator.title}
              </div>
              <div className="text-xs text-gray-600">
                {indicator.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
