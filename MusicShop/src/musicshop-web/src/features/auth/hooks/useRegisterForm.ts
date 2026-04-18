import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/features/auth/services/authService';
import { useAuth } from '@/shared/hooks/useAuth';

export function useRegisterForm() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState<string | null>(null);

  // Controlled component states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
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

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await authService.register({ email, password, fullName });

      if (result.success && result.data) {
        setAuth(result.data.user, result.data.accessToken);
        navigate('/');
      } else {
        setServerError(result.error?.message || 'An unexpected error occurred during registration.');
      }
    } catch (error) {
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

