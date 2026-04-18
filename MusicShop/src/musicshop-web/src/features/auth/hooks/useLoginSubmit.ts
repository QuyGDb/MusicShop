import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/features/auth/services/authService';
import { useAuth } from '@/shared/hooks/useAuth';

export function useLoginSubmit() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const submitLogin = useCallback(async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      const result = await authService.login({ email, password });
      if (result.success && result.data) {
        setAuth(result.data.user, result.data.accessToken);
        navigate('/');
      } else {
        setApiError(result.error?.message || 'Login failed');
      }
    } catch {
      setApiError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [navigate, setAuth]);

  const submitGoogleLogin = useCallback(async (idToken: string) => {
    setIsSubmitting(true);
    try {
      const result = await authService.googleLogin(idToken);
      if (result.success && result.data) {
        setAuth(result.data.user, result.data.accessToken);
        navigate('/');
      } else {
        setApiError(result.error?.message || 'Google login failed');
      }
    } catch {
      setApiError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [navigate, setAuth]);

  return { 
    isSubmitting, 
    apiError, 
    setApiError, 
    submitLogin, 
    submitGoogleLogin 
  };
}
