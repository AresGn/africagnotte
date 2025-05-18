'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function VerifyEmailPage() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Récupérer l'email du localStorage s'il existe
    const pendingProfileData = localStorage.getItem('pendingProfileData');
    if (pendingProfileData) {
      try {
        const userEmail = localStorage.getItem('registeredEmail');
        if (userEmail) {
          setEmail(userEmail);
        }
      } catch (e) {
        console.error("Erreur lors de la récupération des données:", e);
      }
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Vérifiez votre email</h2>
            <div className="mt-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--primary-color)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="mt-4 text-center text-lg text-gray-600">
              Nous avons envoyé un lien de confirmation à
              {email ? <span className="font-bold"> {email}</span> : <span> votre adresse email</span>}.
            </p>
          </div>
          <div className="mt-6">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Veuillez cliquer sur le lien de confirmation dans l&apos;email pour vérifier votre adresse.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Une fois votre email confirmé, vous pourrez vous connecter pour accéder à votre compte. Votre profil sera créé automatiquement lors de votre première connexion.
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Vous n&apos;avez pas reçu l&apos;email?
                </p>
                <button className="text-sm font-medium hover:opacity-80" style={{ color: 'var(--primary-color)' }}>
                  Renvoyer l&apos;email
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Link href="/connexion" 
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ backgroundColor: 'var(--primary-color)', '--tw-ring-color': 'var(--primary-color)' } as React.CSSProperties}>
              Aller à la page de connexion
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 