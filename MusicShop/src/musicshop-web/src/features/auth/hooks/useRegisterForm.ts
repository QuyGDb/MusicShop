import { useMutation } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { authService } from '@/features/auth/services/authService';
import { useAuthRedirect } from '@/shared/hooks/useAuthRedirect';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full Name must be at least 2 characters'),
  email: z.string().email('Valid email is required').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Confirm Password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export function useRegisterForm() {
  const { redirectAfterAuth } = useAuthRedirect();
  
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      redirectAfterAuth(data.accessToken);
    },
  });

  const form = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      registerMutation.mutate({ 
        email: value.email, 
        password: value.password, 
        fullName: value.fullName 
      });
    },
  });

  const isSubmitting = registerMutation.isPending;
  const serverError = registerMutation.error instanceof Error ? registerMutation.error.message : null;

  return {
    form,
    isSubmitting,
    serverError,
  };
}
