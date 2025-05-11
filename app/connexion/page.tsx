'use client';

import LoginForm from '../../components/LoginForm';
import AuthLayout from '../../components/AuthLayout';

export default function ConnexionPage() {
  return (
    <AuthLayout title="Connexion à votre compte">
      <LoginForm />
    </AuthLayout>
  );
} 