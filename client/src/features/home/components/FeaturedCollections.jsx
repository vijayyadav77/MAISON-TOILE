import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const FeaturedCollections = ({ categories = [] }) => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-luxury-200 pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-luxury-500 font-semibold block mb-1">
            Curated Categories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-luxury-950 font-normal">
            The Atelier Collections
          </h2>
        </div>
        <Link
          to="/shop"
          className="mt-4 md:mt-0 text-xs uppercase tracking-widest text-luxury-900 hover:text-luxury-600 font-semibold flex items-center gap-2 group"
        >
          <span>View All Categories</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <Link
            key={cat._id || cat.slug}
            to={`/shop?category=${cat.slug}`}
            className={`group relative overflow-hidden bg-luxury-950 block ${
              idx === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
            }`}
          >
            <div className="aspect-[4/5] w-full overflow-hidden">
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.85]"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-[10px] tracking-widest uppercase text-luxury-gold font-medium mb-1">
                Collection 0{idx + 1}
              </span>
              <h3 className="font-serif text-2xl font-normal group-hover:underline">
                {cat.name}
              </h3>
              <p className="text-xs text-luxury-300 font-sans mt-1 line-clamp-2 font-light">
                {cat.description}
              </p>
              <div className="pt-3 flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-semibold text-white">
                <span>Explore Salon</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCollections;
