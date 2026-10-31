import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-luxury-200/70 rounded-none ${className}`}
    />
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="space-y-3">
      <Skeleton className="w-full aspect-[3/4]" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
};

export default Skeleton;
