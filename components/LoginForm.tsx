'use client';

import React, { useState } from 'react';
// import { useRouter } from 'next/navigation'; // Plus utilisé directement ici
import { useAuth } from '../contexts/AuthContext';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  // const router = useRouter(); // Supprimé car la redirection est dans AuthContext
  const context = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion');
      }

      await context.signIn(formData);

      setMessage({ 
        type: 'success', 
        content: 'Connexion réussie ! Redirection...' 
      });
      
      // La redirection est maintenant gérée par AuthContext après la mise à jour de l'utilisateur
      // setTimeout(() => {
      //   router.push('/'); 
      // }, 1000); 

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