import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';

// Features & Pages
import { HomePage } from '../features/home/index.js';
import { ProductListingPage, ProductDetailsPage } from '../features/products/index.js';
import { CartPage } from '../features/cart/index.js';
import { WishlistPage } from '../features/wishlist/index.js';
import { CheckoutPage, OrderSuccessPage } from '../features/checkout/index.js';
import { OrderHistoryPage, OrderDetailsPage } from '../features/orders/index.js';
import { ProfilePage, AddressesPage } from '../features/account/index.js';
import { LoginPage, SignupPage, ForgotPasswordPage } from '../features/auth/index.js';
import {
  AdminDashboardPage,
  AdminProductsPage,
  AdminOrdersPage,
  AdminUsersPage,
} from '../features/admin/index.js';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'shop', element: <ProductListingPage /> },
      { path: 'product/:identifier', element: <ProductDetailsPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'wishlist', element: <WishlistPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'order-success/:orderNumber', element: <OrderSuccessPage /> },
      { path: 'account/orders', element: <OrderHistoryPage /> },
      { path: 'account/orders/:id', element: <OrderDetailsPage /> },
      { path: 'account/profile', element: <ProfilePage /> },
      { path: 'account/addresses', element: <AddressesPage /> },
      {
        path: '*',
        element: (
          <div className="py-24 text-center space-y-4">
            <h2 className="font-serif text-3xl text-luxury-950 font-normal">Page Not Found</h2>
            <p className="text-xs text-luxury-500">The requested salon runway page could not be located.</p>
            <Navigate to="/" replace />
          </div>
        ),
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
    ],
  },
  {
    path: 'admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'products', element: <AdminProductsPage /> },
      { path: 'orders', element: <AdminOrdersPage /> },
      { path: 'users', element: <AdminUsersPage /> },
    ],
  },
]);

export default router;
