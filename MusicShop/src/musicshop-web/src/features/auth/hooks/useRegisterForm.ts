import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/features/auth/services/authService';
import { useAuthRedirect } from '@/shared/hooks/useAuthRedirect';
import { registerSchema, RegisterFormValues } from '../schemas';

import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface UseRegisterFormReturn {
  register: UseFormRegister<RegisterFormValues>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: FieldErrors<RegisterFormValues>;
  isSubmitting: boolean;
  serverError: string | null;
}

export function useRegisterForm(): UseRegisterFormReturn {
  const { redirectAfterAuth } = useAuthRedirect();
  
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      redirectAfterAuth(data.accessToken, data.user);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema) as any,

    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (value: RegisterFormValues) => {
    registerMutation.mutate({ 
      email: value.email, 
      password: value.password, 
      fullName: value.fullName 
    });
  };

  const serverError = registerMutation.error instanceof Error ? registerMutation.error.message : null;

  return {
    register,
    handleSubmit: handleSubmit(onSubmit) as any,

    errors,
    isSubmitting: isSubmitting || registerMutation.isPending,
    serverError,
  };
}

