'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { FiShield, FiEye, FiEyeOff, FiAlertTriangle } from 'react-icons/fi';

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', content: '' });

    try {
      if (!formData.email || !formData.password) {
        throw new Error('Veuillez remplir tous les champs');
      }

      await signIn(formData);

      setMessage({ 
        type: 'success', 
        content: 'Connexion réussie ! Vérification des permissions admin...' 
      });

      // La redirection vers /admin sera gérée par AuthContext
      
    } catch (error: unknown) {
      console.error('Erreur de connexion admin:', error);
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue lors de la connexion.';
      setMessage({ 
        type: 'error', 
        content: errorMessage 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Admin */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 rounded-full mb-4">
            <FiShield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Administration
          </h1>
          <p className="text-gray-600">
            Connexion au dashboard administrateur
          </p>
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {message.content && (
            <div className={`mb-4 p-3 rounded-md flex items-center ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {message.type === 'error' && <FiAlertTriangle className="w-4 h-4 mr-2" />}
              {message.content}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email administrateur
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="admin@africagnotte.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connexion...
                </>
              ) : (
                <>
                  <FiShield className="w-4 h-4 mr-2" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          {/* Comptes de test */}
          <div className="mt-6 p-4 bg-amber-50 rounded-md">
            <h3 className="text-sm font-medium text-amber-800 mb-2">Comptes de test :</h3>
            <div className="text-xs text-amber-700 space-y-1">
              <div>
                <strong>Admin :</strong> alex.gnimagnon@africagnotte.com / admin123
              </div>
              <div>
                <strong>User :</strong> marc.zinzou@africagnotte.com / user123
              </div>
            </div>
          </div>

          {/* Lien vers connexion normale */}
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push('/connexion')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Connexion utilisateur normale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
