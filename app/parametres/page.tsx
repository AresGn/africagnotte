'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/navigation';

export default function ParametresPage() {
  const { isLoading: authIsLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (authIsLoading) {
      setPageLoading(true);
      return;
    }

    if (!isAuthenticated) {
      router.push('/connexion');
      return;
    }
    setPageLoading(false);

  }, [authIsLoading, isAuthenticated, router]);

  return (
    <>
      <Navbar />
      <div className="container-custom pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-8">Paramètres</h1>
        
        {pageLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" style={{ color: 'var(--primary-color)' }}></div>
            <p className="mt-4">Chargement des paramètres...</p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="space-y-6">
              <div className="border-b pb-6">
                <h2 className="text-xl font-semibold mb-4">Paramètres du compte</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-md font-medium">Changer le mot de passe</h3>
                    <p className="text-sm text-gray-500 mb-2">Pour des raisons de sécurité, nous vous recommandons de changer régulièrement votre mot de passe.</p>
                    <button 
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{ '--tw-ring-color': 'var(--primary-color)' } as React.CSSProperties}>
                      Modifier le mot de passe
                    </button>
                  </div>

                  <div>
                    <h3 className="text-md font-medium">Email de récupération</h3>
                    <p className="text-sm text-gray-500 mb-2">Ajoutez une adresse email alternative pour récupérer votre compte en cas de besoin.</p>
                    <button 
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{ '--tw-ring-color': 'var(--primary-color)' } as React.CSSProperties}>
                      Gérer les emails
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="border-b pb-6">
                <h2 className="text-xl font-semibold mb-4">Notifications</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-medium">Notifications par email</h3>
                      <p className="text-sm text-gray-500">Recevez des notifications par email quand une de vos cagnottes reçoit des fonds.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-medium">Notifications par SMS</h3>
                      <p className="text-sm text-gray-500">Recevez des notifications par SMS pour les activités importantes.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <h2 className="text-xl font-semibold mb-4 text-red-600">Zone dangereuse</h2>
                <div>
                  <h3 className="text-md font-medium">Supprimer le compte</h3>
                  <p className="text-sm text-gray-500 mb-2">Cette action est irréversible et supprimera définitivement toutes vos données.</p>
                  <button 
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Supprimer mon compte
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 