import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AfricaGnotte - Plateforme de collecte de dons pour l\'Afrique',
  description: 'Plateforme de collecte de dons 100% dédiée à l\'Afrique, centrée sur l\'aide aux personnes en difficulté',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
} 