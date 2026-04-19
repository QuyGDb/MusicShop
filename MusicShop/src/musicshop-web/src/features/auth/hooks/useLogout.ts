import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '@/shared/hooks/useAuth';

export function useLogout() {
  const { clearAuth, accessToken } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    // Retrieve the refresh token from storage before clearing auth state
    const storedRefreshToken = localStorage.getItem('refreshToken') ?? '';

    // Optimistically clear client-side auth state immediately
    clearAuth();
    navigate('/');

    // Best-effort server-side invalidation — does not block UI
    if (accessToken) {
      await authService.logout(storedRefreshToken);
    }
  };

  return { logout };
}
