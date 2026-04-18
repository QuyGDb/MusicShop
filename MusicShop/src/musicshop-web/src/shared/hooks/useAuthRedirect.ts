import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import { User } from '@/features/auth/types';

export function useAuthRedirect() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const redirectAfterAuth = useCallback((user: User, accessToken: string) => {
    setAuth(user, accessToken);
    navigate('/');
  }, [navigate, setAuth]);

  return { redirectAfterAuth };
}
