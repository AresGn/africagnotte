'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import { Session } from '@supabase/supabase-js';

export default function UserAuthStatus() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier l'état de la session au chargement
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="text-center">Chargement...</div>;
  }

  return (
    <div className="flex items-center space-x-4">
      {session ? (
        <div className="flex items-center space-x-4">
          <span>
            Connecté en tant que: <strong>{session.user.email}</strong>
          </span>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Déconnexion
          </button>
        </div>
      ) : (
        <div className="flex space-x-4">
          <Link href="/connexion" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90">
            Connexion
          </Link>
          <Link href="/inscription" className="px-4 py-2 text-sm font-medium border border-primary text-primary rounded-md hover:bg-primary/10">
            Inscription
          </Link>
        </div>
      )}
    </div>
  );
} 