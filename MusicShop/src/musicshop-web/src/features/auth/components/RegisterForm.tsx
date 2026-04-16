'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterSchema } from '../schemas/registerSchema';
import { authService } from '../services/authService';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2, Music, UserPlus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

export const RegisterForm: React.FC = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    setServerError(null);
    const result = await authService.register(data);

    if (result.success && result.data) {
      setAuth(result.data.user, result.data.accessToken);
      router.push('/');
      router.refresh();
    } else {
      setServerError(result.error?.message || 'An unexpected error occurred during registration.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
           <div className="bg-blue-600/10 p-3 rounded-2xl">
             <UserPlus className="h-8 w-8 text-blue-500" />
           </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
        <p className="text-neutral-400">Join MusicShop and start your collection</p>
      </div>

      <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-colors duration-500" />
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
          {serverError && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-900/50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Registration Failed</AlertTitle>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium text-neutral-300">Full Name</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              {...register('fullName')}
              className={`bg-neutral-950/50 border-neutral-800 focus:border-blue-500 h-11 transition-all ${errors.fullName ? 'border-red-500/50' : ''}`}
            />
            {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-neutral-300">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register('email')}
              className={`bg-neutral-950/50 border-neutral-800 focus:border-blue-500 h-11 transition-all ${errors.email ? 'border-red-500/50' : ''}`}
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-neutral-300">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={`bg-neutral-950/50 border-neutral-800 focus:border-blue-500 h-11 transition-all ${errors.password ? 'border-red-500/50' : ''}`}
            />
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-300">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              className={`bg-neutral-950/50 border-neutral-800 focus:border-blue-500 h-11 transition-all ${errors.confirmPassword ? 'border-red-500/50' : ''}`}
            />
            {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-neutral-500">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-500 font-semibold hover:text-blue-400 transition-colors">
          Sign In
        </Link>
      </p>
    </div>
  );
};
