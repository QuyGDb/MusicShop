import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '@/shared/hooks/useAuth';

export function useLogout() {
  const { clearAuth, accessToken } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    // 1. Best-effort server-side invalidation
    // We do this BEFORE clearing local state so the HttpClient can still access the token
    if (accessToken) {
      try {
        await authService.logout();
      } catch (error) {
        console.error('Server-side logout failed:', error);
      }
    }

    // 2. Clear client-side auth state and navigate
    clearAuth();
    navigate('/');
  };

  return { logout };
}
