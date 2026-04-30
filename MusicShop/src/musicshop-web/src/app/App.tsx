import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ShopLayout } from '@/layouts/ShopLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import HomePage from '@/pages/shop/HomePage';
import ProductListPage from '@/pages/shop/ProductListPage';
import ProfilePage from '@/pages/shop/ProfilePage';
import ProductDetailPage from '@/pages/shop/ProductDetailPage';
import OrderHistoryPage from '@/pages/shop/OrderHistoryPage';
import { CheckoutPage } from '@/pages/shop/CheckoutPage';
import CheckoutSuccessPage from '@/pages/shop/CheckoutSuccessPage';
import CheckoutCancelPage from '@/pages/shop/CheckoutCancelPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AdminRoute } from '@/features/auth/components/AdminRoute';
import ArtistManagementPage from '@/pages/admin/ArtistManagementPage';
import LabelManagementPage from '@/pages/admin/LabelManagementPage';
import GenreManagementPage from '@/pages/admin/GenreManagementPage';
import ReleaseManagementPage from '@/pages/admin/ReleaseManagementPage';
import ProductManagementPage from '@/pages/admin/ProductManagementPage';
import OrderManagementPage from '@/pages/admin/OrderManagementPage';

import CollectionManagementPage from '@/pages/admin/CollectionManagementPage';
import ProductAdminDetailsPage from '@/pages/admin/ProductAdminDetailsPage';
import { Toaster } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import axiosInstance from '@/shared/api/axiosInstance';

export default function App() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  useEffect(() => {
    // Setup the listener for 401 Unauthorized errors from the network layer
    axiosInstance.onUnauthorized = () => {
      clearAuth();
      navigate('/login', { replace: true });
    };

    return () => {
      axiosInstance.onUnauthorized = undefined;
    };
  }, [clearAuth, navigate]);

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        {/* Shop Routes */}
        <Route element={<ShopLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/checkout" element={accessToken ? <CheckoutPage /> : <Navigate to="/login" />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
          <Route path="/profile" element={accessToken ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/orders" element={accessToken ? <OrderHistoryPage /> : <Navigate to="/login" />} />
          <Route path="/orders/:id" element={accessToken ? <OrderHistoryPage /> : <Navigate to="/login" />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={accessToken ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/register" element={accessToken ? <Navigate to="/" /> : <RegisterPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Navigate to="orders" replace />} />
          <Route path="artists" element={<ArtistManagementPage />} />
          <Route path="labels" element={<LabelManagementPage />} />
          <Route path="genres" element={<GenreManagementPage />} />
          <Route path="releases" element={<ReleaseManagementPage />} />
          <Route path="products" element={<ProductManagementPage />} />
          <Route path="orders" element={<OrderManagementPage />} />

          <Route path="collections" element={<CollectionManagementPage />} />
          <Route path="products/:id" element={<ProductAdminDetailsPage />} />
          {/* Future admin sub-routes will go here */}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<div className="min-h-screen bg-background text-foreground flex items-center justify-center">404 - Page Not Found</div>} />
      </Routes>
    </>
  );
}
