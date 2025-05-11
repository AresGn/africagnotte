import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';

export default function AuthForm() {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">Se connecter ou s&apos;inscrire</h2>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="light"
        providers={['google', 'facebook']}
        redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
        socialLayout="horizontal"
        localization={{
          variables: {
            sign_in: {
              email_label: 'Adresse email',
              password_label: 'Mot de passe',
              button_label: 'Se connecter',
              link_text: 'Vous avez déjà un compte? Connectez-vous',
            },
            sign_up: {
              email_label: 'Adresse email',
              password_label: 'Mot de passe',
              button_label: "S'inscrire",
              link_text: "Vous n'avez pas de compte? Inscrivez-vous",
            },
            magic_link: {
              button_label: 'Envoyer le lien magique',
              link_text: 'Envoyer un lien magique de connexion',
            },
            forgotten_password: {
              button_label: 'Réinitialiser le mot de passe',
              link_text: 'Mot de passe oublié?',
            },
          },
        }}
      />
    </div>
  );
} 