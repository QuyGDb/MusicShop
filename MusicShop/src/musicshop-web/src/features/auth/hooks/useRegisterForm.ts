import { useMutation } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { authService } from '@/features/auth/services/authService';
import { useAuthRedirect } from '@/shared/hooks/useAuthRedirect';

export function useRegisterForm() {
  const { redirectAfterAuth } = useAuthRedirect();
  
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      redirectAfterAuth(data.accessToken, data.user);
    },
  });

  const form = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
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
