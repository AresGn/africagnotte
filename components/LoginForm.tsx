'use client';

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      // Tentative de connexion
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email ou mot de passe incorrect');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Veuillez confirmer votre adresse email avant de vous connecter');
        } else {
          throw error;
        }
      }

      if (data.user) {
        // Vérifier que le profil existe dans la table profiles
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }
        
        // Si le profil n'existe pas, vérifier d'abord s'il y a des données en attente dans localStorage
        if (!profileData) {
          let profileToInsert;
          
          // Vérifier si nous avons des données de profil en attente dans localStorage
          const pendingProfileData = localStorage.getItem('pendingProfileData');
          
          if (pendingProfileData) {
            try {
              profileToInsert = JSON.parse(pendingProfileData);
              console.log("Utilisation des données de profil en attente trouvées dans localStorage.");
            } catch (e) {
              console.error("Erreur lors de l'analyse des données de profil en attente:", e);
            }
          }
          
          // Si aucune donnée en attente ou erreur de parsing, utiliser les métadonnées utilisateur
          if (!profileToInsert) {
            const metadata = data.user.user_metadata;
            
            if (metadata) {
              profileToInsert = {
                id: data.user.id,
                first_name: metadata.first_name || '',
                last_name: metadata.last_name || '',
                username: metadata.username || '',
                phone_number: metadata.phone_number || '',
                country: metadata.country || ''
              };
            }
          }
          
          // Insérer le profil si nous avons des données
          if (profileToInsert) {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert(profileToInsert);
              
            if (insertError) {
              console.error('Erreur lors de la création du profil:', insertError);
              throw new Error(`Impossible de créer votre profil: ${insertError.message}`);
            } else {
              console.log("Profil utilisateur créé avec succès après confirmation de l'email.");
              
              // Supprimer les données en attente du localStorage après succès
              localStorage.removeItem('pendingProfileData');
              
              // Message de succès spécifique pour la création de profil
              setMessage({ 
                type: 'success', 
                content: 'Connexion réussie et profil créé ! Redirection...' 
              });
            }
          }
        } else {
          setMessage({ 
            type: 'success', 
            content: 'Connexion réussie ! Redirection...' 
          });
        }
        
        // Rediriger vers la page d'accueil après une pause pour montrer le message
        setTimeout(() => {
          window.location.href = '/';  // Utiliser window.location.href au lieu de router.push pour forcer un rechargement complet
        }, 2000);
      }
    } catch (error: unknown) {
      console.error('Erreur de connexion:', error);
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue lors de la connexion.';
      
      setMessage({ 
        type: 'error', 
        content: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {message.content && (
        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.content}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': 'var(--primary-color)' } as React.CSSProperties}
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': 'var(--primary-color)' } as React.CSSProperties}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 focus:ring-primary border-gray-300 rounded"
              style={{ accentColor: 'var(--primary-color)' }}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Se souvenir de moi
            </label>
          </div>
          
          <div className="text-sm">
            <a href="#" className="font-medium hover:opacity-80" style={{ color: 'var(--primary-color)' }}>
              Mot de passe oublié?
            </a>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: 'var(--primary-color)',
              '--tw-ring-color': 'var(--primary-color)',
              ':hover': { backgroundColor: 'var(--primary-color-hover)' }
            } as React.CSSProperties}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p>
          Vous n&apos;avez pas de compte?{' '}
          <a href="/inscription" className="font-medium hover:opacity-80" style={{ color: 'var(--primary-color)' }}>
            Inscrivez-vous
          </a>
        </p>
      </div>
    </div>
  );
} 