'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';

// Définir le type du profil utilisateur
interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  phone_number?: string;
  country?: string;
  email?: string;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      
      try {
        // Récupérer l'utilisateur actuellement connecté
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Charger les données du profil depuis la base de données
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error) {
            throw error;
          }
          
          setProfile(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfile();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container-custom pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" style={{ color: 'var(--primary-color)' }}></div>
            <p className="mt-4">Chargement de votre profil...</p>
          </div>
        ) : profile ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 pb-6 border-b">
              <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center text-white text-2xl font-bold mb-4 sm:mb-0 sm:mr-6">
                {profile.username?.charAt(0).toUpperCase() || profile.first_name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profile.username || 'Utilisateur'}</h2>
                <p className="text-gray-600">{profile.first_name} {profile.last_name}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
                <div className="space-y-3">
                  <div>
                    <span className="block text-sm text-gray-500">Nom complet</span>
                    <span className="block">{profile.first_name} {profile.last_name}</span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Pseudo</span>
                    <span className="block">{profile.username}</span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Pays</span>
                    <span className="block">{profile.country}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Coordonnées</h3>
                <div className="space-y-3">
                  <div>
                    <span className="block text-sm text-gray-500">Email</span>
                    <span className="block">{profile.email}</span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Téléphone</span>
                    <span className="block">{profile.phone_number}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ '--tw-ring-color': 'var(--primary-color)' } as React.CSSProperties}>
                Modifier le profil
              </button>
              <button 
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ backgroundColor: 'var(--primary-color)', '--tw-ring-color': 'var(--primary-color)' } as React.CSSProperties}>
                Changer le mot de passe
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <p className="text-lg">Vous devez être connecté pour voir votre profil.</p>
            <div className="mt-4">
              <a 
                href="/connexion" 
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ backgroundColor: 'var(--primary-color)', '--tw-ring-color': 'var(--primary-color)' } as React.CSSProperties}>
                Se connecter
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 