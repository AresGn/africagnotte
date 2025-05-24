'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import { toast, Toaster } from 'react-hot-toast';

// UserProfile n'est plus nécessaire, AppUser du contexte et UserProfileFormData suffisent.
// interface UserProfile { 
//   id: string;
//   first_name?: string;
//   last_name?: string;
//   username?: string;
//   phone_number?: string;
//   country?: string;
//   email?: string;
// }

interface UserProfileFormData {
  first_name?: string;
  last_name?: string;
  username?: string;
  phone_number?: string;
  country?: string;
  // email n'est pas modifiable ici pour l'instant
}

export default function ProfilePage() {
  const { user, isLoading: authIsLoading, isAuthenticated, fetchUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfileFormData>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        username: user.username || '',
        phone_number: user.phone_number || '',
        country: user.country || '',
      });
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    toast.loading('Mise à jour du profil...');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      toast.dismiss(); // Enlever le toast de chargement

      if (!response.ok) {
        throw new Error(result.error || 'Échec de la mise à jour du profil');
      }
      toast.success('Profil mis à jour avec succès!');
      fetchUser(); // Re-fetch user data pour mettre à jour le contexte et l'affichage
      setIsEditing(false); // Revenir en mode affichage
    } catch (error) {
      toast.dismiss(); // Enlever le toast de chargement en cas d'erreur aussi
      toast.error((error as Error).message || 'Une erreur est survenue.');
    } finally {
      setIsSaving(false);
    }
  };

  if (authIsLoading) {
    return (
      <>
        <Navbar />
        <div className="container-custom pt-24 pb-12 text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" style={{ color: 'var(--primary-color)' }}></div>
          <p className="mt-4">Chargement de votre profil...</p>
        </div>
      </>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <>
        <Navbar />
        <div className="container-custom pt-24 pb-12">
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
        </div>
      </>
    );
  }

  // Si user est disponible (déjà vérifié par isAuthenticated && user ci-dessus)
  const profile = user; // Utiliser directement user du contexte comme base d'affichage

  return (
    <>
      <Navbar />
      <Toaster position="top-center" />
      <div className="container-custom pt-24 pb-12">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Mon Profil</h1>
            {!isEditing && (
                <button 
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ '--tw-ring-color': 'var(--primary-color)' } as React.CSSProperties}>
                    Modifier le profil
                </button>
            )}
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 pb-6 border-b">
            <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center text-white text-2xl font-bold mb-4 sm:mb-0 sm:mr-6">
              {(formData.username || formData.first_name || profile.email)?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{formData.username || formData.first_name || 'Utilisateur'}</h2>
              <p className="text-gray-600">{formData.first_name} {formData.last_name}</p>
              <p className="text-gray-500 text-sm">Email: {profile.email} (non modifiable ici)</p>
            </div>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleProfileUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Prénom</label>
                      <input type="text" name="first_name" id="first_name" value={formData.first_name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm" />
                    </div>
                    <div>
                      <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Nom</label>
                      <input type="text" name="last_name" id="last_name" value={formData.last_name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm" />
                    </div>
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">Pseudo</label>
                      <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Coordonnées (Optionnel)</h3>
                  <div className="space-y-4">
                     <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">Pays</label>
                      <input type="text" name="country" id="country" value={formData.country} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm" />
                    </div>
                    <div>
                      <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Téléphone</label>
                      <input type="text" name="phone_number" id="phone_number" value={formData.phone_number} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3 justify-end">
                <button 
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    // Réinitialiser formData aux valeurs de user si des changements non sauvegardés sont présents
                    if (user) {
                        setFormData({
                            first_name: user.first_name || '',
                            last_name: user.last_name || '',
                            username: user.username || '',
                            phone_number: user.phone_number || '',
                            country: user.country || '',
                        });
                    }
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  disabled={isSaving}
                  style={{ '--tw-ring-color': 'var(--primary-color)' } as React.CSSProperties}>
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ backgroundColor: 'var(--primary-color)', '--tw-ring-color': 'var(--primary-color)' } as React.CSSProperties}>
                  {isSaving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
                <div className="space-y-3">
                  <div>
                    <span className="block text-sm text-gray-500">Prénom</span>
                    <span className="block">{profile.first_name || '-'}</span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Nom</span>
                    <span className="block">{profile.last_name || '-'}</span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Pseudo</span>
                    <span className="block">{profile.username || '-'}</span>
                  </div>
                   <div>
                    <span className="block text-sm text-gray-500">Pays</span>
                    <span className="block">{profile.country || '-'}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Coordonnées</h3>
                <div className="space-y-3">
                  <div>
                    <span className="block text-sm text-gray-500">Email</span>
                    <span className="block">{profile.email || '-'} (non modifiable ici)</span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Téléphone</span>
                    <span className="block">{profile.phone_number || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isEditing && (
            <div className="mt-8 pt-6 border-t flex flex-wrap gap-3">
                <button 
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ backgroundColor: 'var(--primary-color)', '--tw-ring-color': 'var(--primary-color)' } as React.CSSProperties}>
                    Changer le mot de passe
                </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 