'use client';

import Link from 'next/link';

type CategoryCardProps = {
  name: string;
  emoji: string;
};

export default function CategoryCard({ name, emoji }: CategoryCardProps) {
  return (
    <Link 
      href={`/category/${name.toLowerCase()}`} 
      className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
    >
      <div 
        className="h-16 w-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
        style={{ backgroundColor: 'var(--accent-color)' }}
      >
        <span className="text-2xl">{emoji}</span>
      </div>
      <h3 className="font-semibold" style={{ color: 'var(--dark-color)' }}>{name}</h3>
    </Link>
  );
} 