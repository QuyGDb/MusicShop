import { useState } from 'react';
import { authService } from '@/features/auth/services/authService';
import { useSubmitState } from '@/shared/hooks/useSubmitState';
import { useAuthRedirect } from '@/shared/hooks/useAuthRedirect';

interface RegisterErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function useRegisterForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<RegisterErrors>({});

  const { 
    isSubmitting, 
    setIsSubmitting, 
    serverError, 
    setServerError 
  } = useSubmitState();
  const { redirectAfterAuth } = useAuthRedirect();
  
  const validate = () => {
    const newErrors: RegisterErrors = {};
    
    if (!fullName || fullName.length < 2) {
      newErrors.fullName = 'Full Name must be at least 2 characters';
    }
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Valid email is required';
    }
    
    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const result = await authService.register({ email, password, fullName });

      if (result.success && result.data) {
        redirectAfterAuth(result.data.user, result.data.accessToken);
      } else {
        setServerError(result.error?.message || 'Registration failed');
      }
    } catch {
       setServerError('Network error or server unavailable.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isSubmitting,
    errors,
    serverError,
    onSubmit
  };
}
