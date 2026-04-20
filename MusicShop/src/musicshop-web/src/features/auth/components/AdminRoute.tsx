import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

interface AdminRouteProps {
  children: ReactNode;
}

/**
 * Higher-order component to protect routes that require Admin privileges.
 * Redirects to the homepage if the user is not authenticated or lacks the Admin role.
 */
export function AdminRoute({ children }: AdminRouteProps) {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isInitializing = useAuthStore((state) => state.isInitializing);

  // While checking auth status on boot, show nothing (or a loader)
  if (isInitializing) {
    return null; 
  }

  // Check if authenticated and has Admin role
  const isAdmin = !!accessToken && user?.role === 'Admin';

  if (!isAdmin) {
    console.warn('Unauthorized access attempt to admin route.');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
