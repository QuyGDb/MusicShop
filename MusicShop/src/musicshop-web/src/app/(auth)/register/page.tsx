import React from 'react';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - MusicShop',
  description: 'Create a new account at MusicShop',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
}
