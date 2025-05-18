'use client';

import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
} 