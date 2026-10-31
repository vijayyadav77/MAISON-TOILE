import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner.jsx';
import FeaturedCollections from '../components/FeaturedCollections.jsx';
import TrendingSection from '../components/TrendingSection.jsx';
import CuratedLookbook from '../components/CuratedLookbook.jsx';
import NewArrivalsSection from '../components/NewArrivalsSection.jsx';
import QuickViewModal from '../../products/components/QuickViewModal.jsx';
import { homeService } from '../services/homeService.js';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';

export const HomePage = () => {
  useDocumentTitle('Haute Runway & Designer Collections');

  const [categories, setCategories] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [catsRes, trendingRes, newRes] = await Promise.all([
          homeService.getCategories(),
          homeService.getTrendingProducts(),
          homeService.getNewArrivals(),
        ]);

        setCategories(catsRes.categories || []);
        setTrendingProducts(trendingRes.products || []);
        setNewArrivals(newRes.products || []);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="space-y-0">
      <HeroBanner />
      <FeaturedCollections categories={categories} />
      <TrendingSection
        products={trendingProducts}
        isLoading={loading}
        onQuickView={(prod) => setQuickViewProduct(prod)}
      />
      <CuratedLookbook />
      <NewArrivalsSection
        products={newArrivals}
        isLoading={loading}
        onQuickView={(prod) => setQuickViewProduct(prod)}
      />

      {/* Global Quick View Modal */}
      <QuickViewModal
        isOpen={Boolean(quickViewProduct)}
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default HomePage;
