'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Définir notre propre type User pour le contexte
interface AppUser {
  id: string;
  email: string;
  username?: string;
  first_name?: string; 
  last_name?: string;  
  phone_number?: string;
  country?: string;
}

// Types pour les fonctions d'authentification
interface EmailPasswordCredentials {
  email: string;
  password: string;
}

interface RegistrationDetails extends EmailPasswordCredentials {
  // raw_user_meta_data et autres champs d'inscription
  [key: string]: any; // Permettre d'autres champs pour l'instant
}

type AuthContextType = {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: EmailPasswordCredentials) => Promise<void>; 
  signUp: (details: RegistrationDetails) => Promise<void>; 
  signOut: () => Promise<void>;
  fetchUser: () => Promise<void>; // Pour charger l'utilisateur initialement
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUserCallback = useCallback(async () => {
    console.log('[AuthContext] fetchUserCallback triggered');
    setIsLoading(true);
    try {
      const response = await fetch('/api/me', { credentials: 'include' });
      console.log('[AuthContext] /api/me response status:', response.status);
      if (response.ok) {
        const userData = await response.json();
        console.log('[AuthContext] /api/me response data:', userData);
        if (userData.user && typeof userData.user === 'object') {
            setUser(userData.user as AppUser);
            console.log('[AuthContext] User set from userData.user:', userData.user);
        } else if (userData.id && userData.email) { 
            setUser(userData as AppUser);
            console.log('[AuthContext] User set from userData root:', userData);
        } else {
            console.warn("[AuthContext] Unexpected user data format from /api/me", userData);
            setUser(null);
        }
      } else {
        setUser(null); 
        console.log('[AuthContext] /api/me call failed or no user session');
      }
    } catch (error) {
      console.error("[AuthContext] Error fetching user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
      console.log('[AuthContext] fetchUserCallback finished. isLoading:', false);
    }
  }, []); 

  useEffect(() => {
    fetchUserCallback();
  }, [fetchUserCallback]);

  const signIn = async (credentials: EmailPasswordCredentials) => {
    console.log('[AuthContext] signIn called with:', credentials.email);
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      console.log('[AuthContext] /api/auth/signin response status:', response.status);
      if (response.ok) {
        console.log('[AuthContext] Sign-in successful, calling fetchUserCallback');
        await fetchUserCallback(); 
        router.push('/'); // Rediriger APRÈS la mise à jour de l'utilisateur
      } else {
        const errorData = await response.json();
        console.error('[AuthContext] Sign-in API error:', errorData);
        throw new Error(errorData.message || 'Échec de la connexion');
      }
    } catch (error) {
      console.error("[AuthContext] Error in signIn function:", error);
      setUser(null);
      throw error; 
    } finally {
      setIsLoading(false);
      console.log('[AuthContext] signIn finished. isLoading:', false);
    }
  };

  const signUp = async (details: RegistrationDetails) => {
    console.log('[AuthContext] signUp called for:', details.email);
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });
      console.log('[AuthContext] /api/auth/signup response status:', response.status);
      if (response.ok) {
        console.log('[AuthContext] Sign-up successful');
        router.push('/connexion'); 
      } else {
        const errorData = await response.json();
        console.error('[AuthContext] Sign-up API error:', errorData);
        throw new Error(errorData.message || 'Échec de l\'inscription');
      }
    } catch (error) {
      console.error("[AuthContext] Error in signUp function:", error);
      throw error;
    } finally {
      setIsLoading(false);
      console.log('[AuthContext] signUp finished. isLoading:', false);
    }
  };

  const signOut = async () => {
    console.log('[AuthContext] signOut called');
    setIsLoading(true);
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      setUser(null);
      console.log('[AuthContext] User set to null after signout');
      router.push('/connexion'); 
    } catch (error) {
      console.error("[AuthContext] Error in signOut function:", error);
    } finally {
      setIsLoading(false);
      console.log('[AuthContext] signOut finished. isLoading:', false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user, 
    isLoading,
    signIn,
    signUp,
    signOut,
    fetchUser: fetchUserCallback, 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 