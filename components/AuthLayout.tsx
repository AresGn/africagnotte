'use client';

import React, { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-extrabold text-center mb-8" style={{ color: 'var(--primary-color)' }}>
            {title}
          </h1>
          {children}
        </div>
      </div>
    </div>
  );
} 