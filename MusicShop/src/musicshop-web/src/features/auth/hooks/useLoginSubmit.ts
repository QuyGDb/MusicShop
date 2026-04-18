import { useCallback } from 'react';
import { authService } from '@/features/auth/services/authService';
import { useSubmitState } from '@/shared/hooks/useSubmitState';
import { useAuthRedirect } from '@/shared/hooks/useAuthRedirect';

export function useLoginSubmit() {
  const { isSubmitting, setIsSubmitting, serverError, setServerError } = useSubmitState();
  const { redirectAfterAuth } = useAuthRedirect();

  const submitLogin = useCallback(async (email: string, password: string) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const result = await authService.login({ email, password });
      if (result.success && result.data) {
        redirectAfterAuth(result.data.user, result.data.accessToken);
      } else {
        setServerError(result.error?.message || 'Login failed');
      }
    } catch {
      setServerError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [redirectAfterAuth, setIsSubmitting, setServerError]);

  const submitGoogleLogin = useCallback(async (idToken: string) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const result = await authService.googleLogin(idToken);
      if (result.success && result.data) {
        redirectAfterAuth(result.data.user, result.data.accessToken);
      } else {
        setServerError(result.error?.message || 'Google login failed');
      }
    } catch {
      setServerError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [redirectAfterAuth, setIsSubmitting, setServerError]);

  return { 
    isSubmitting, 
    serverError, 
    setServerError, 
    submitLogin, 
    submitGoogleLogin 
  };
}
