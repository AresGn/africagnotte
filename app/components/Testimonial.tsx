'use client';

import Image from 'next/image';
import { useState } from 'react';

type TestimonialProps = {
  id: number | string;
  imageUrl: string;
  name: string;
  role: string;
  quote: string;
};

export default function Testimonial({ imageUrl, name, role, quote }: TestimonialProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-start mb-4">
        <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
          {imgError ? (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm">
              {name.charAt(0)}
            </div>
          ) : (
            <Image 
              src={imageUrl} 
              alt={`Témoignage de ${name}`}
              sizes="64px"
              fill
              style={{ objectFit: 'cover' }}
              onError={() => setImgError(true)}
            />
          )}
        </div>
        <div>
          <h3 className="font-bold">{name}</h3>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>
      <p className="italic">
        &quot;{quote}&quot;
      </p>
    </div>
  );
} 