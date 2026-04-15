'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginSchema } from '../schemas/loginSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '../services/authService';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';

/**
 * LoginForm component for handling standard and Google authentication.
 */
export default function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [apiError, setApiError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  /**
   * Handles the standard email/password login submission.
   */
  const onSubmit = async (data: LoginSchema) => {
    setApiError(null);
    const result = await authService.login(data);

    if (result.success && result.data) {
      setAuth(result.data.user, result.data.accessToken);
      router.push('/');
    } else {
      setApiError(result.error?.message || 'Login failed');
    }
  };

  /**
   * Handles successful Google Login response.
   * @param credentialResponse Contains the Google ID Token (credential)
   */
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setApiError(null);
    
    // The 'credential' field contains the ID Token required by our backend
    const idToken = credentialResponse.credential;
    if (!idToken) return;

    const result = await authService.googleLogin(idToken);

    if (result.success && result.data) {
      // Store user info and token in the global store
      setAuth(result.data.user, result.data.accessToken);
      router.push('/');
    } else {
      const errorMessage = result.error?.message || 'Google login failed on server side';
      setApiError(errorMessage);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
        <CardDescription className="text-center text-neutral-400">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="bg-neutral-800 border-neutral-700"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button variant="link" className="p-0 h-auto text-xs text-neutral-400">
                Forgot password?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              className="bg-neutral-800 border-neutral-700"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          {apiError && (
            <div className="p-3 text-sm bg-red-900/20 border border-red-900/50 text-red-400 rounded-md">
              {apiError}
            </div>
          )}
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Sign In'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-neutral-700"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-neutral-900 px-2 text-neutral-400">Or continue with</span>
          </div>
        </div>

        {/* Standard Google Login Button - Handles Token Flow Automatically */}
        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              setApiError('Google login was unsuccessful');
            }}
            theme="filled_black"
            shape="pill"
            width="384" // Max width of the card
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-neutral-400">
        Don&apos;t have an account?{' '}
        <Button variant="link" className="p-0 h-auto text-blue-400 hover:text-blue-300">
          Sign up now
        </Button>
      </CardFooter>
    </Card>
  );
}
