import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';

export const CuratedLookbook = () => {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Editorial Visual */}
        <div className="relative">
          <div className="aspect-[4/5] bg-luxury-200 overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200"
              alt="Maison Étoile Tailoring Atelier"
              className="w-full h-full object-cover filter brightness-[0.9]"
            />
          </div>
          <div className="hidden sm:block absolute -bottom-8 -right-8 w-56 aspect-[3/4] bg-luxury-100 border-4 border-luxury-50 shadow-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600"
              alt="Handcrafted Leather Accent"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Story Text */}
        <div className="space-y-6 lg:pl-8">
          <div className="w-12 h-0.5 bg-luxury-gold" />
          <span className="text-[11px] uppercase tracking-widest text-luxury-500 font-semibold block">
            Atelier Heritage & Philosophy
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl text-luxury-950 font-normal leading-tight">
            Purity of Line, Precision of Proportion.
          </h2>

          <p className="text-xs sm:text-sm text-luxury-600 font-sans leading-relaxed">
            Every garment from Maison Étoile is an exploration of architectural silhouettes and exceptional materials. From bias-cut heavy silk charmeuse designed in Paris to unstructured double-faced cashmeres hand-loomed in Italy, we champion timeless modern luxury over transient trends.
          </p>

          <div className="pt-4 grid grid-cols-2 gap-6 border-t border-luxury-200 text-luxury-900">
            <div>
              <p className="font-serif text-2xl font-normal">100%</p>
              <p className="text-[10px] uppercase tracking-widest text-luxury-500 mt-0.5">
                Artisanal European Craft
              </p>
            </div>
            <div>
              <p className="font-serif text-2xl font-normal">Zero Waste</p>
              <p className="text-[10px] uppercase tracking-widest text-luxury-500 mt-0.5">
                Silk Pattern Engineering
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Link to="/shop?category=ready-to-wear">
              <Button size="lg" className="flex items-center gap-2">
                <span>Explore The Autumn Lookbook</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CuratedLookbook;
