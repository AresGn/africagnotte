'use client';

import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import Header from './Header';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
} 