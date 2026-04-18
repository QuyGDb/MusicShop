import { useState } from 'react';
import { CredentialResponse } from '@react-oauth/google';
import { authService } from '@/features/auth/services/authService';
import { useSubmitState } from '@/shared/hooks/useSubmitState';
import { useAuthRedirect } from '@/shared/hooks/useAuthRedirect';

interface LoginErrors {
  email?: string;
  password?: string;
}

export function useLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  
  const { isSubmitting, setIsSubmitting, serverError, setServerError } = useSubmitState();
  const { redirectAfterAuth } = useAuthRedirect();

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
    setServerError(null);
    
    if (!validate()) {
      return;
    }

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
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setServerError(null);
    const idToken = credentialResponse.credential;
    
    if (!idToken) {
      return;
    }

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
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    serverError,
    errors,
    onSubmit,
    handleGoogleSuccess,
    setServerError
  };
}
