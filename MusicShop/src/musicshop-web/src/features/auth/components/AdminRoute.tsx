import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * Layout route guard for admin-only routes.
 * Redirects to homepage if user is not authenticated or lacks the Admin role.
 */
export function AdminRoute() {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isInitializing = useAuthStore((state) => state.isInitializing);

  if (isInitializing) {
    return null;
  }

  const isAdmin = !!accessToken && user?.role === 'Admin';

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
