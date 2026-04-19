import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';
import { useAuth } from '@/shared/hooks/useAuth';

export function useCurrentUser() {
  const { accessToken } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setUser(null);
      return;
    }

    const fetchCurrentUser = async () => {
      setLoading(true);
      setError(null);
      const result = await authService.getMe();
      if (result.success) {
        setUser(result.data);
      } else {
        setError(result.error.message);
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, [accessToken]);

  return { user, loading, error };
}
