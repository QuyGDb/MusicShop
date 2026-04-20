import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';

export function useAuthRedirect() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const redirectAfterAuth = (accessToken: string) => {
    setAuth(accessToken);
    navigate('/');
  };

  return { redirectAfterAuth };
}
