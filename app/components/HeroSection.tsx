'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function HeroSection() {
  const [imgError, setImgError] = useState(false);
  
  return (
    <section className="py-20" style={{ backgroundColor: 'var(--light-color)' }}>
      <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--dark-color)' }}>
            Soutenez des causes africaines qui en ont besoin
          </h1>
          <p className="text-lg mb-8">
            AfricaGnotte est la première plateforme de collecte de dons 100% dédiée à l&apos;Afrique, 
            centrée sur l&apos;aide aux personnes en difficulté.
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
          {imgError ? (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center" style={{ color: 'var(--dark-color)' }}>
              <div className="text-center px-4">
                <h3 className="text-2xl font-bold mb-2">AfricaGnotte</h3>
                <p>La plateforme de collecte de dons pour l&apos;Afrique</p>
              </div>
            </div>
          ) : (
            <Image 
              src="/images/hero-image.jpg.jpg" 
              alt="Aide humanitaire en Afrique" 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
              priority
              onError={() => setImgError(true)}
            />
          )}
        </div>
      </div>
    </section>
  );
} 