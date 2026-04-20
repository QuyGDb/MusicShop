import { useMutation } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { CredentialResponse } from '@react-oauth/google';
import { authService } from '@/features/auth/services/authService';
import { useAuthRedirect } from '@/shared/hooks/useAuthRedirect';

export const loginSchema = z.object({
  email: z.string().email('Email is invalid').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export function useLoginForm() {
  const { redirectAfterAuth } = useAuthRedirect();

  // Standard Login Mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      redirectAfterAuth(data.accessToken);
    },
  });

  // Google Login Mutation
  const googleLoginMutation = useMutation({
    mutationFn: authService.googleLogin,
    onSuccess: (data) => {
      redirectAfterAuth(data.accessToken);
    },
  });

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      loginMutation.mutate(value);
    },
  });

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      return;
    }

    googleLoginMutation.mutate(idToken);
  };

  // Combine loading and error states for the UI
  const isSubmitting = loginMutation.isPending || googleLoginMutation.isPending;
  const error = loginMutation.error || googleLoginMutation.error;
  const serverError = error instanceof Error ? error.message : null;

  return {
    form,
    isSubmitting,
    serverError,
    handleGoogleSuccess
  };
}
