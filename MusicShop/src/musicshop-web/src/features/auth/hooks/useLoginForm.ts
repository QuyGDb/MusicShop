import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CredentialResponse } from '@react-oauth/google';
import { authService } from '@/features/auth/services/authService';
import { useAuthRedirect } from '@/shared/hooks/useAuthRedirect';

interface LoginErrors {
  email?: string;
  password?: string;
}

export function useLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  
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

  const validate = () => {
    const newErrors: LoginErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    loginMutation.mutate({ email, password });
  };

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
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    serverError,
    errors,
    onSubmit,
    handleGoogleSuccess
  };
}
