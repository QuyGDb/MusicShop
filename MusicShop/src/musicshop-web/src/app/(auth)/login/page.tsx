import React from 'react';
import LoginForm from '@/features/auth/components/LoginForm';

export const metadata = {
  title: 'Login | MusicShop',
  description: 'Log in to your MusicShop account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black -z-10" />
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">MusicShop</h1>
          <p className="text-neutral-500">Where you find your musical soul</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
