'use client';

import RegisterForm from '../../components/RegisterForm';
import AuthLayout from '../../components/AuthLayout';

export default function InscriptionPage() {
  return (
    <AuthLayout title="Créer un compte">
      <RegisterForm />
    </AuthLayout>
  );
} 