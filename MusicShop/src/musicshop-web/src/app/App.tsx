import { Routes, Route, Navigate } from 'react-router-dom';
import { ShopLayout } from '@/layouts/ShopLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import HomePage from '@/pages/shop/HomePage';
import ProductListPage from '@/pages/shop/ProductListPage';
import ProfilePage from '@/pages/shop/ProfilePage';
import TermsPage from '@/pages/shop/TermsPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AdminRoute } from '@/features/auth/components/AdminRoute';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import { useAuthStore } from '@/store/useAuthStore';

export default function App() {
  const accessToken = useAuthStore((state) => state.accessToken);

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

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        {/* Future admin sub-routes will go here */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<div className="min-h-screen bg-background text-foreground flex items-center justify-center">404 - Page Not Found</div>} />
    </Routes>
  );
}
