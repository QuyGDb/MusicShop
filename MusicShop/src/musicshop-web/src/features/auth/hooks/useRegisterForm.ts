import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/features/auth/services/authService';
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

  const { redirectAfterAuth } = useAuthRedirect();
  
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      redirectAfterAuth(data.user, data.accessToken);
    },
  });
  
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
    
    if (!validate()) {
      return;
    }
    
    registerMutation.mutate({ email, password, fullName });
  };

  const isSubmitting = registerMutation.isPending;
  const serverError = registerMutation.error instanceof Error ? registerMutation.error.message : null;

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
