import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AnnouncementBar from '../components/common/AnnouncementBar.jsx';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import CartDrawer from '../features/cart/components/CartDrawer.jsx';
import WishlistDrawer from '../features/wishlist/components/WishlistDrawer.jsx';
import { fetchCart, syncGuestCartToBackend } from '../features/cart/cartSlice.js';
import { fetchWishlist } from '../features/wishlist/wishlistSlice.js';
import { fetchCurrentUser } from '../features/auth/authSlice.js';

export const MainLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initial data hydration on app load
    if (localStorage.getItem('maison_token')) {
      dispatch(fetchCurrentUser()).then(() => {
        dispatch(syncGuestCartToBackend());
        dispatch(fetchCart());
        dispatch(fetchWishlist());
      });
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-luxury-50 text-luxury-950 font-sans selection:bg-luxury-900 selection:text-white">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Global Slide-Over Drawers */}
      <CartDrawer />
      <WishlistDrawer />
    </div>
  );
};

export default MainLayout;
