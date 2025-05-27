'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type CampaignCardProps = {
  id: number | string;
  imageUrl: string;
  title: string;
  description: string;
  category: string;
  currentAmount: number;
  targetAmount: number;
  currency?: string;
};

export default function CampaignCard({
  id,
  imageUrl,
  title,
  description,
  category,
  currentAmount,
  targetAmount,
  currency = 'FCFA'
}: CampaignCardProps) {
  const [imgError, setImgError] = useState(false);
  const progressPercentage = Math.min(Math.round((currentAmount / targetAmount) * 100), 100);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        {imgError ? (
          <div
            className="w-full h-full flex items-center justify-center bg-gray-200"
            style={{ color: 'var(--primary-color)' }}
          >
            <span>{title}</span>
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: 'cover' }}
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className="p-6">
        <span className="inline-block px-3 py-1 text-xs rounded-full mb-3"
            style={{ backgroundColor: 'var(--accent-color)', color: 'var(--dark-color)' }}>
          {category}
        </span>
        <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--dark-color)' }}>
          {title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: 'var(--secondary-color)'
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span>{formatAmount(currentAmount)} {currency}</span>
            <span>{formatAmount(targetAmount)} {currency}</span>
          </div>
        </div>
        <Link href={`/c/${id}`} className="btn-primary w-full block text-center">
          Faire un don
        </Link>
      </div>
    </div>
  );
}