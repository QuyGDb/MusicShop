import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { User } from '@/features/auth/types';

export function useAuthRedirect() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const redirectAfterAuth = (accessToken: string, user: User) => {
    setAuth(accessToken, user);
    navigate('/');
  };

  return { redirectAfterAuth };
}
