import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Heart } from 'lucide-react';
import Breadcrumb from '../../../components/common/Breadcrumb.jsx';
import EmptyState from '../../../components/common/EmptyState.jsx';
import ProductGrid from '../../products/components/ProductGrid.jsx';
import QuickViewModal from '../../products/components/QuickViewModal.jsx';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';

export const WishlistPage = () => {
  useDocumentTitle('Curated Luxury Wishlist');
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Breadcrumb items={[{ label: 'Wishlist' }]} />
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="You haven’t preserved any runway designs to your private wishlist yet. Save your favorite silk gowns, cashmere overcoats, or Italian leather bags for future collection."
          actionText="Discover Runway Designs"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Wishlist' }]} />

      <div className="pt-2 pb-8 border-b border-luxury-200">
        <h1 className="font-serif text-3xl sm:text-4xl text-luxury-950 font-normal">
          Curated Wishlist
        </h1>
        <p className="text-xs uppercase tracking-widest text-luxury-500 mt-1 font-medium">
          {wishlistItems.length} Reserved Runway Pieces
        </p>
      </div>

      <div className="pt-8">
        <ProductGrid
          products={wishlistItems}
          onQuickView={(prod) => setQuickViewProduct(prod)}
          columns="grid-cols-2 md:grid-cols-4"
        />
      </div>

      <QuickViewModal
        isOpen={Boolean(quickViewProduct)}
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default WishlistPage;
