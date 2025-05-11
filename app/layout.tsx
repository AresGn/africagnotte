import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './next-dev-overlay.css';
import ClientLayout from '../components/ClientLayout';

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
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
} 