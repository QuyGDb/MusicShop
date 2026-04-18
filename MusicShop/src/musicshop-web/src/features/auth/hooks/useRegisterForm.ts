import { authService } from '@/features/auth/services/authService';
import { useSubmitState } from '@/shared/hooks/useSubmitState';
import { useAuthRedirect } from '@/shared/hooks/useAuthRedirect';
import { useRegisterFields } from './useRegisterFields';
import { useRegisterValidation } from './useRegisterValidation';

export function useRegisterForm() {
  const { 
    isSubmitting, 
    setIsSubmitting, 
    serverError, 
    setServerError 
  } = useSubmitState();
  const { redirectAfterAuth } = useAuthRedirect();
  
  const {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword
  } = useRegisterFields();
  
  const { errors, validate } = useRegisterValidation(
    fullName, 
    email, 
    password, 
    confirmPassword
  );

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
