import React from 'react';
import ProductCard from './ProductCard.jsx';
import { ProductCardSkeleton } from '../../../components/ui/Skeleton.jsx';

export const ProductGrid = ({
  products = [],
  isLoading = false,
  skeletonCount = 8,
  onQuickView,
  columns = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
}) => {
  if (isLoading) {
    return (
      <div className={`grid ${columns} gap-x-6 gap-y-10`}>
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid ${columns} gap-x-6 gap-y-10`}>
      {products.map((product) => (
        <ProductCard
          key={product._id || product.id}
          product={product}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
