import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlistItem } from '../../wishlist/wishlistSlice.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import Badge from '../../../components/ui/Badge.jsx';

export const ProductCard = ({ product, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const isInWishlist = wishlistItems.some(
    (item) => (item._id || item.id) === (product._id || product.id)
  );

  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800';
  const secondaryImage = product.images?.[1] || primaryImage;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlistItem(product));
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div
      className="group relative flex flex-col transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-luxury-100">
        <Link to={`/product/${product.slug || product._id}`} className="block w-full h-full">
          <img
            src={isHovered ? secondaryImage : primaryImage}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges on Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.discountPercentage > 0 && (
            <Badge variant="sale">-{product.discountPercentage}%</Badge>
          )}
          {product.isNewArrival && (
            <Badge variant="neutral">New</Badge>
          )}
          {product.isTrending && !product.isNewArrival && (
            <Badge variant="gold">Trending</Badge>
          )}
        </div>

        {/* Wishlist Button on Top Right */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-luxury-900 shadow-sm hover:scale-110 transition-all duration-200 z-10"
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isInWishlist ? 'fill-rose-700 text-rose-700' : 'text-luxury-900 hover:text-rose-700'
            }`}
          />
        </button>

        {/* Quick View Button on Bottom Hover */}
        {onQuickView && (
          <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
            <button
              onClick={handleQuickViewClick}
              className="w-full py-2.5 bg-luxury-950/90 hover:bg-luxury-950 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest font-medium flex items-center justify-center gap-1.5 transition-colors shadow-lg"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick Preview</span>
            </button>
          </div>
        )}
      </div>

      {/* Product Editorial Details */}
      <div className="pt-3 pb-2 flex-1 flex flex-col justify-between space-y-1">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-luxury-500 font-semibold truncate">
            {product.brand}
          </p>
          <Link
            to={`/product/${product.slug || product._id}`}
            className="block font-serif text-sm text-luxury-900 group-hover:underline line-clamp-1 font-normal tracking-wide"
          >
            {product.name}
          </Link>
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-2">
            {product.discountPrice ? (
              <>
                <span className="text-xs font-semibold text-rose-800">
                  {formatCurrency(product.discountPrice)}
                </span>
                <span className="text-[11px] text-luxury-400 line-through">
                  {formatCurrency(product.price)}
                </span>
              </>
            ) : (
              <span className="text-xs font-semibold text-luxury-950">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {/* Color Dots */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center space-x-1">
              {product.colors.slice(0, 3).map((col, idx) => (
                <span
                  key={idx}
                  className="w-2.5 h-2.5 rounded-full border border-luxury-300 inline-block"
                  style={{ backgroundColor: col.hex || '#000' }}
                  title={col.name}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-[9px] text-luxury-500 font-sans">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
