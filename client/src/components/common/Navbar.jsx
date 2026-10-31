import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { openCartDrawer } from '../../features/cart/cartSlice.js';
import { openWishlistDrawer } from '../../features/wishlist/wishlistSlice.js';
import { logoutUser } from '../../features/auth/authSlice.js';
import SearchOverlay from './SearchOverlay.jsx';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalWishlistCount = wishlistItems.length;

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Ready-to-Wear', path: '/shop?category=ready-to-wear' },
    { name: 'Couture Gowns', path: '/shop?category=evening-couture' },
    { name: 'Leather & Bags', path: '/shop?category=leather-and-handbags' },
    { name: 'Footwear', path: '/shop?category=designer-footwear' },
    { name: 'Fine Accessories', path: '/shop?category=fine-accessories' },
    { name: 'New Arrivals', path: '/shop?newArrival=true' },
    { name: 'Private Sale', path: '/shop?sort=popular', highlight: true },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-luxury-200 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-luxury-900 hover:text-luxury-600 focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-1 lg:flex-none text-center lg:text-left">
              <Link to="/" className="inline-block group">
                <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-widest-plus text-luxury-950 block leading-tight">
                  MAISON ÉTOILE
                </span>
                <span className="text-[9px] tracking-widest uppercase text-luxury-500 block font-sans">
                  Paris &bull; Milan &bull; Mumbai
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-[11px] uppercase tracking-editorial font-medium transition-colors duration-200 py-1 ${
                    link.highlight
                      ? 'text-rose-800 hover:text-rose-950 font-semibold'
                      : 'text-luxury-700 hover:text-luxury-950 hover:border-b hover:border-luxury-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* Search Icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-luxury-800 hover:text-luxury-950 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => dispatch(openWishlistDrawer())}
                className="p-2 text-luxury-800 hover:text-luxury-950 transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {totalWishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-luxury-900 text-luxury-50 text-[9px] font-sans font-bold rounded-full flex items-center justify-center">
                    {totalWishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Drawer Button */}
              <button
                onClick={() => dispatch(openCartDrawer())}
                className="p-2 text-luxury-800 hover:text-luxury-950 transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-luxury-gold text-luxury-950 text-[9px] font-sans font-bold rounded-full flex items-center justify-center shadow-sm">
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* User Account Dropdown */}
              <div className="relative">
                {isAuthenticated ? (
                  <div>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 p-1.5 text-luxury-900 hover:text-luxury-700 focus:outline-none"
                    >
                      <img
                        src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                        alt={user?.name}
                        className="w-7 h-7 rounded-full object-cover border border-luxury-300"
                      />
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-white border border-luxury-200 shadow-xl py-2 z-50 text-luxury-900">
                        <div className="px-4 py-2 border-b border-luxury-100">
                          <p className="text-xs font-semibold text-luxury-950 truncate">{user?.name}</p>
                          <p className="text-[10px] text-luxury-500 truncate">{user?.email}</p>
                        </div>

                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs hover:bg-luxury-50 text-luxury-900 font-medium"
                          >
                            <ShieldCheck className="w-4 h-4 text-luxury-gold" />
                            Admin Atelier
                          </Link>
                        )}

                        <Link
                          to="/account/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs hover:bg-luxury-50 text-luxury-800"
                        >
                          <Package className="w-4 h-4 text-luxury-500" />
                          My Orders
                        </Link>

                        <Link
                          to="/account/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs hover:bg-luxury-50 text-luxury-800"
                        >
                          <User className="w-4 h-4 text-luxury-500" />
                          Account Settings
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-700 hover:bg-rose-50 border-t border-luxury-100 mt-1"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="p-2 text-luxury-800 hover:text-luxury-950 transition-colors"
                    title="Account Sign In"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-luxury-50 border-t border-luxury-200 px-6 py-6 space-y-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xs uppercase tracking-widest font-medium py-2 border-b border-luxury-200/50 ${
                    link.highlight ? 'text-rose-800 font-bold' : 'text-luxury-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {!isAuthenticated ? (
                <div className="pt-4 flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 text-center bg-luxury-950 text-white text-xs uppercase tracking-widest font-medium"
                  >
                    Client Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 text-center border border-luxury-950 text-luxury-950 text-xs uppercase tracking-widest font-medium"
                  >
                    Register Account
                  </Link>
                </div>
              ) : (
                <div className="pt-4 border-t border-luxury-200 space-y-2">
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs uppercase tracking-widest font-semibold text-luxury-gold py-1.5"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/account/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs uppercase tracking-widest font-medium text-luxury-800 py-1.5"
                  >
                    Order History
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block text-xs uppercase tracking-widest font-medium text-rose-700 py-1.5"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Live Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
