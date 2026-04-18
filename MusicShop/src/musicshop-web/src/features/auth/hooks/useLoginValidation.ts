import { useState, useCallback } from 'react';

interface LoginErrors {
  email?: string;
  password?: string;
}

export function useLoginValidation(email: string, password: string) {
  const [errors, setErrors] = useState<LoginErrors>({});

  const validate = useCallback(() => {
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
  }, [email, password]);

  return { errors, validate };
}
