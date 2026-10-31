import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  ArrowLeft,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { logoutUser } from '../features/auth/authSlice.js';

export const AdminLayout = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-luxury-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <ShieldAlert className="w-16 h-16 text-luxury-gold" />
        <h2 className="font-serif text-3xl font-semibold">Atelier Admin Restricted</h2>
        <p className="text-xs text-luxury-400 max-w-md">
          Administrative access requires verified atelier credentials. Please sign in with an administrative account.
        </p>
        <div className="pt-4 flex gap-4">
          <Link
            to="/login?redirect=/admin"
            className="px-6 py-3 bg-luxury-gold text-luxury-950 text-xs uppercase tracking-widest font-semibold hover:bg-luxury-goldHover transition-colors"
          >
            Admin Sign In
          </Link>
          <Link
            to="/"
            className="px-6 py-3 border border-luxury-700 text-white text-xs uppercase tracking-widest font-semibold hover:bg-luxury-900 transition-colors"
          >
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  const navLinks = [
    { name: 'Executive Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Product Catalog', path: '/admin/products', icon: Package },
    { name: 'Orders Fulfillment', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Client Directory', path: '/admin/users', icon: Users },
  ];

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#111111] text-luxury-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-luxury-950 border-r border-luxury-800/80 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-luxury-800/80">
            <Link to="/" className="block">
              <span className="font-serif text-xl tracking-widest-plus text-white font-semibold">
                MAISON ÉTOILE
              </span>
              <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-sans block mt-1">
                Atelier Administration
              </span>
            </Link>
          </div>

          <nav className="p-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 text-xs tracking-wider uppercase font-medium transition-colors ${
                    isActive
                      ? 'bg-luxury-850 text-luxury-gold border-l-2 border-luxury-gold'
                      : 'text-luxury-400 hover:text-white hover:bg-luxury-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom actions */}
        <div className="p-4 border-t border-luxury-800/80 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-luxury-400 hover:text-white hover:bg-luxury-900 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Storefront View</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors uppercase tracking-wider text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-luxury-950/60 backdrop-blur-md border-b border-luxury-800/80 px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-luxury-400">
              Atelier Server Live &bull; MongoDB Connected
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-luxury-300 font-medium">
              {user?.name}
            </span>
            <span className="px-2 py-0.5 text-[9px] uppercase tracking-widest bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/40 rounded-none font-semibold">
              Admin
            </span>
          </div>
        </header>

        <main className="p-8 flex-1 bg-[#141414]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
