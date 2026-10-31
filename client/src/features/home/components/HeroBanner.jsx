import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';

export const HeroBanner = () => {
  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-luxury-950">
      {/* Background Campaign Photography */}
      <img
        src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=85&w=2000"
        alt="Maison Étoile Runway Collection 2026"
        className="absolute inset-0 w-full h-full object-cover object-top filter brightness-[0.78] contrast-[1.05] transition-transform duration-1000 scale-100 hover:scale-105"
      />

      {/* Editorial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 md:pb-24 text-white">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[11px] uppercase tracking-widest text-luxury-gold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autumn / Winter 2026 Haute Runway</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight leading-[1.05] text-white">
            Architecture in <span className="italic font-light">Liquid Silk</span> & Cashmere.
          </h1>

          <p className="text-xs sm:text-sm font-sans text-luxury-200 tracking-wide max-w-lg leading-relaxed font-light">
            Discover sculpted silhouettes, double-faced cashmere overcoats, and handcrafted Italian leather top-handle bags tailored for discerning collectors.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link to="/shop?category=evening-couture">
              <Button size="lg" className="bg-white text-luxury-950 hover:bg-luxury-100 font-semibold">
                <span>Explore Couture Gowns</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/shop?category=ready-to-wear">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-luxury-950">
                Ready-to-Wear Atelier
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
