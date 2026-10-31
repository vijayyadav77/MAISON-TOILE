import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ArrowRight, Check, ShoppingBag } from 'lucide-react';
import Modal from '../../../components/ui/Modal.jsx';
import Button from '../../../components/ui/Button.jsx';
import { addItemToCart } from '../../cart/cartSlice.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';

export const QuickViewModal = ({ product, isOpen, onClose }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [added, setAdded] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!product) return null;

  const currentSize = selectedSize || product.sizes?.[0] || 'Standard';
  const currentColor = selectedColor || product.colors?.[0]?.name || 'Standard';
  const price = product.discountPrice || product.price;

  const handleAddToCart = async () => {
    await dispatch(
      addItemToCart({
        productId: product._id,
        name: product.name,
        brand: product.brand,
        image: product.images?.[0],
        price,
        size: currentSize,
        color: currentColor,
        quantity: 1,
      })
    );
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1000);
  };

  const handleFullDetails = () => {
    onClose();
    navigate(`/product/${product.slug || product._id}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image preview */}
        <div className="aspect-[3/4] bg-luxury-100 overflow-hidden">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details & Selectors */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-luxury-500 font-semibold">
              {product.brand}
            </p>
            <h2 className="font-serif text-2xl text-luxury-950 font-normal leading-tight">
              {product.name}
            </h2>

            <div className="flex items-center gap-3 pt-1">
              <span className="text-base font-semibold text-luxury-950">
                {formatCurrency(price)}
              </span>
              {product.discountPrice && (
                <span className="text-xs text-luxury-400 line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>

            <p className="text-xs text-luxury-600 line-clamp-3 pt-2 font-sans leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="space-y-4 pt-2 border-t border-luxury-200">
            {/* Color selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-luxury-700 font-medium mb-1.5">
                  Color: <strong className="text-luxury-950">{currentColor}</strong>
                </label>
                <div className="flex gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        currentColor === c.name
                          ? 'border-luxury-950 scale-110'
                          : 'border-transparent hover:border-luxury-300'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-luxury-700 font-medium mb-1.5">
                  Select Size
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`py-2 text-xs uppercase tracking-wider font-medium border transition-colors ${
                        currentSize === s
                          ? 'border-luxury-950 bg-luxury-950 text-white'
                          : 'border-luxury-200 text-luxury-800 hover:border-luxury-900 bg-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-4">
            <Button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2"
              variant={added ? 'secondary' : 'primary'}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Added to Shopping Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Bag</span>
                </>
              )}
            </Button>
            <button
              type="button"
              onClick={handleFullDetails}
              className="w-full py-2.5 text-center text-xs tracking-widest uppercase font-medium text-luxury-700 hover:text-luxury-950 flex items-center justify-center gap-1 transition-colors"
            >
              <span>View Full Editorial Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QuickViewModal;
