import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-luxury-50">
      {/* Left side editorial runway fashion imagery */}
      <div className="hidden lg:block lg:col-span-6 relative overflow-hidden bg-luxury-950">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600"
          alt="Maison Étoile Couture Runway"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-between p-12 text-white">
          <Link to="/" className="inline-block">
            <span className="font-serif text-3xl font-semibold tracking-widest-plus text-white">
              MAISON ÉTOILE
            </span>
            <span className="text-[10px] tracking-widest uppercase text-luxury-300 block font-sans">
              Haute Couture Atelier
            </span>
          </Link>
          <div className="space-y-4 max-w-md">
            <div className="w-12 h-0.5 bg-luxury-gold" />
            <blockquote className="font-serif text-2xl italic leading-relaxed text-luxury-100">
              “Elegance is not about being noticed, it is about being remembered.”
            </blockquote>
            <p className="text-xs uppercase tracking-widest text-luxury-400">
              Runway Autumn/Winter 2026 Collection
            </p>
          </div>
        </div>
      </div>

      {/* Right side form container */}
      <div className="col-span-1 lg:col-span-6 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
        <div className="max-w-md w-full mx-auto">
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl font-semibold tracking-widest-plus text-luxury-950">
                MAISON ÉTOILE
              </span>
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
