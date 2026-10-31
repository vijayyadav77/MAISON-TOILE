import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductGrid from '../../products/components/ProductGrid.jsx';

export const TrendingSection = ({ products = [], isLoading = false, onQuickView }) => {
  return (
    <section className="py-20 bg-luxury-100/60 border-y border-luxury-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-luxury-500 font-semibold block mb-1">
              Runway Debuts & Private Re-orders
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-luxury-950 font-normal">
              Trending Pieces
            </h2>
          </div>
          <Link
            to="/shop?trending=true"
            className="mt-4 md:mt-0 text-xs uppercase tracking-widest text-luxury-900 hover:text-luxury-600 font-semibold flex items-center gap-2 group"
          >
            <span>Explore Trending Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <ProductGrid
          products={products}
          isLoading={isLoading}
          skeletonCount={4}
          onQuickView={onQuickView}
          columns="grid-cols-2 md:grid-cols-4"
        />
      </div>
    </section>
  );
};

export default TrendingSection;
