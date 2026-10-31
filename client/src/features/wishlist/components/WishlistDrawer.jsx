import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { X, Heart, Trash2, ArrowRight } from 'lucide-react';
import { closeWishlistDrawer, toggleWishlistItem } from '../wishlistSlice.js';
import Button from '../../../components/ui/Button.jsx';
import { formatCurrency } from '../../../utils/formatCurrency.js';

export const WishlistDrawer = () => {
  const { items, isDrawerOpen } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handleViewProduct = (product) => {
    dispatch(closeWishlistDrawer());
    navigate(`/product/${product.slug || product._id}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => dispatch(closeWishlistDrawer())}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-luxury-200 flex items-center justify-between bg-luxury-50">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-luxury-900 fill-luxury-900" />
              <h3 className="font-serif text-lg tracking-wider text-luxury-950 font-semibold uppercase">
                Curated Wishlist ({items.length})
              </h3>
            </div>
            <button
              onClick={() => dispatch(closeWishlistDrawer())}
              className="p-1.5 text-luxury-500 hover:text-luxury-950 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wishlist Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="text-center py-24 space-y-4">
                <Heart className="w-12 h-12 text-luxury-300 mx-auto" />
                <h4 className="font-serif text-xl text-luxury-800">Your wishlist is empty</h4>
                <p className="text-xs text-luxury-500 max-w-xs mx-auto">
                  Save your desired runway and couture pieces for private viewing or future acquisition.
                </p>
                <div className="pt-2">
                  <Button onClick={() => { dispatch(closeWishlistDrawer()); navigate('/shop'); }}>
                    Discover Runway
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((product) => {
                  const image = (product.images && product.images[0]) || '';
                  return (
                    <div
                      key={product._id || product.id}
                      className="flex gap-4 py-3 border-b border-luxury-200"
                    >
                      <div
                        onClick={() => handleViewProduct(product)}
                        className="w-20 h-28 bg-luxury-100 overflow-hidden shrink-0 cursor-pointer"
                      >
                        <img
                          src={image}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-start justify-between">
                            <p className="text-[10px] uppercase tracking-widest text-luxury-500 font-semibold">
                              {product.brand}
                            </p>
                            <button
                              onClick={() => dispatch(toggleWishlistItem(product))}
                              className="text-luxury-400 hover:text-rose-700 p-1"
                              title="Remove from wishlist"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <h4
                            onClick={() => handleViewProduct(product)}
                            className="font-serif text-sm text-luxury-950 font-medium line-clamp-1 cursor-pointer hover:underline"
                          >
                            {product.name}
                          </h4>
                          <p className="text-xs font-semibold text-luxury-950">
                            {formatCurrency(product.discountPrice || product.price)}
                          </p>
                        </div>

                        <div className="pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewProduct(product)}
                            className="w-full text-[10px]"
                          >
                            Select Size & Add to Bag
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-luxury-200 p-6 bg-luxury-50">
              <Button
                onClick={() => { dispatch(closeWishlistDrawer()); navigate('/wishlist'); }}
                className="w-full flex items-center justify-center gap-2"
              >
                <span>View Full Wishlist Gallery</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistDrawer;
