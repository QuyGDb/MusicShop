import { useState } from 'react';

interface RegisterErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function useRegisterValidation(
  fullName: string, 
  email: string, 
  password: string, 
  confirmPassword: string
) {
  const [errors, setErrors] = useState<RegisterErrors>({});

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

  return { errors, validate };
}
