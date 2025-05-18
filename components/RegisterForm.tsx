'use client';

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import { AuthError } from '@supabase/supabase-js';

// Pays utilisant le XOF (Union Économique et Monétaire Ouest-Africaine)
const XOF_COUNTRIES = [
  'Bénin', 'Burkina Faso', 'Côte d\'Ivoire', 'Guinée-Bissau', 
  'Mali', 'Niger', 'Sénégal', 'Togo'
];

// Pays utilisant le XAF (Communauté Économique et Monétaire de l'Afrique Centrale)
const XAF_COUNTRIES = [
  'Cameroun', 'République centrafricaine', 'Tchad', 
  'République du Congo', 'Guinée équatoriale', 'Gabon'
];

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    username: '',
    phoneNumber: '',
    country: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });
    
    try {
      // Étape 1: Vérifier si le nom d'utilisateur existe déjà
      console.log("Vérification du nom d'utilisateur...");
      try {
        const { data: existingUsers, error: usernameError } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', formData.username);
          
        if (usernameError) {
          console.error("Erreur lors de la vérification du nom d'utilisateur:", usernameError);
          // Si l'erreur est que la table n'existe pas, on continue
          if (usernameError.message && usernameError.message.includes('does not exist')) {
            console.log("La table profiles n'existe pas encore, on continue avec l'inscription");
          } else {
            throw usernameError;
          }
        } else if (existingUsers && existingUsers.length > 0) {
          setMessage({
            type: 'error',
            content: 'Ce nom d\'utilisateur est déjà utilisé. Veuillez en choisir un autre.'
          });
          setLoading(false);
          return;
        }
      } catch (verifyError) {
        // Si l'erreur est que la table n'existe pas, on continue
        if (verifyError instanceof Error && verifyError.message.includes('does not exist')) {
          console.log("La table profiles n'existe pas encore, on continue avec l'inscription");
        } else {
          throw verifyError;
        }
      }

      // Étape 2: Créer l'utilisateur dans Supabase Auth
      console.log("Création de l'utilisateur...");
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            username: formData.username,
            phone_number: formData.phoneNumber,
            country: formData.country
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error("Erreur lors de la création de l'utilisateur:", error);
        throw error;
      }
      
      // L'utilisateur a été créé avec succès
      if (data.user) {
        // Stocker les données du profil dans localStorage pour les utiliser après confirmation de l'email
        const profileData = {
          id: data.user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          username: formData.username,
          phone_number: formData.phoneNumber,
          country: formData.country
        };
        
        localStorage.setItem('pendingProfileData', JSON.stringify(profileData));
        localStorage.setItem('registeredEmail', formData.email);
        
        // Afficher un message demandant à l'utilisateur de vérifier son email
        setMessage({ 
          type: 'success', 
          content: 'Inscription réussie ! Redirection vers la page de vérification d\'email...'
        });
        
        // Rediriger vers la page de vérification d'email
        setTimeout(() => {
          router.push('/verify');
        }, 2000);
      }
    } catch (error: unknown) {
      console.error('Erreur d\'inscription détaillée:', error);
      let errorMessage = 'Une erreur est survenue lors de l\'inscription.';
      
      if (error instanceof AuthError) {
        if (error.message.includes('relation "profiles" does not exist')) {
          errorMessage = 'La table "profiles" n\'existe pas dans la base de données. Contactez l\'administrateur.';
        } else {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        if (error.message.includes('relation "profiles" does not exist')) {
          errorMessage = 'La table "profiles" n\'existe pas dans la base de données. Contactez l\'administrateur.';
        } else {
          errorMessage = error.message;
        }
      }
      
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'var(--primary-color)' } as React.CSSProperties}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'var(--primary-color)' } as React.CSSProperties}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Pseudo</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': 'var(--primary-color)' } as React.CSSProperties}
          />
        </div>
        
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
        
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            required
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+237 123456789"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': 'var(--primary-color)' } as React.CSSProperties}
          />
        </div>
        
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Pays de résidence</label>
          <select 
            id="country"
            name="country"
            required
            value={formData.country}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
            style={{ '--tw-ring-color': 'var(--primary-color)' } as React.CSSProperties}
          >
            <option value="">Sélectionnez votre pays</option>
            <optgroup label="Pays utilisant le XOF">
              {XOF_COUNTRIES.map(country => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </optgroup>
            <optgroup label="Pays utilisant le XAF">
              {XAF_COUNTRIES.map(country => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </optgroup>
          </select>
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
            {loading ? 'Inscription en cours...' : 'S\'inscrire'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p>
          Vous avez déjà un compte?{' '}
          <a href="/connexion" className="font-medium hover:opacity-80" style={{ color: 'var(--primary-color)' }}>
            Connectez-vous
          </a>
        </p>
      </div>
    </div>
  );
} 