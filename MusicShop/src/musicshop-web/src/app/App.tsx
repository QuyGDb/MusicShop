import { Routes, Route, Navigate } from 'react-router-dom';
import { ShopLayout } from '@/layouts/ShopLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import HomePage from '@/pages/shop/HomePage';
import ProductListPage from '@/pages/shop/ProductListPage';
import ProfilePage from '@/pages/shop/ProfilePage';
import TermsPage from '@/pages/shop/TermsPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useAuth } from '@/shared/hooks/useAuth';

export default function App() {
  const { isInitializing, accessToken } = useAuth();
  const { isLoading: isUserLoading } = useCurrentUser();

  const isBuffering = isInitializing || (!!accessToken && isUserLoading);

  if (isBuffering) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Shop Routes */}
      <Route element={<ShopLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/profile" element={accessToken ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/terms" element={<TermsPage />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={accessToken ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/register" element={accessToken ? <Navigate to="/" /> : <RegisterPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<div className="min-h-screen bg-background text-foreground flex items-center justify-center">404 - Page Not Found</div>} />
    </Routes>
  );
}
