import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateItemQuantity, removeItemFromCart } from '../cartSlice.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';

export const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const product = item.product || {};
  const image = (product.images && product.images[0]) || item.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=300';
  const name = product.name || item.name;
  const brand = product.brand || item.brand;
  const price = item.price || product.price || 0;

  return (
    <div className="flex gap-4 py-4 border-b border-luxury-200">
      <div className="w-20 h-28 bg-luxury-100 overflow-hidden shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-luxury-500 font-semibold">
                {brand}
              </p>
              <h4 className="font-serif text-sm text-luxury-950 font-medium line-clamp-1">
                {name}
              </h4>
            </div>
            <button
              onClick={() => dispatch(removeItemFromCart(item._id))}
              className="text-luxury-400 hover:text-rose-700 transition-colors p-1"
              title="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-luxury-600">
            <span>Size: <strong className="text-luxury-900">{item.size}</strong></span>
            <span>&bull;</span>
            <span>Color: <strong className="text-luxury-900">{item.color}</strong></span>
          </div>

          <p className="text-xs font-semibold text-luxury-950 pt-1">
            {formatCurrency(price)}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between pt-2">
          <div className="inline-flex items-center border border-luxury-300">
            <button
              type="button"
              disabled={item.quantity <= 1}
              onClick={() => dispatch(updateItemQuantity({ itemId: item._id, quantity: item.quantity - 1 }))}
              className="p-1.5 hover:bg-luxury-100 text-luxury-700 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-3 text-xs font-medium text-luxury-900">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => dispatch(updateItemQuantity({ itemId: item._id, quantity: item.quantity + 1 }))}
              className="p-1.5 hover:bg-luxury-100 text-luxury-700"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <span className="text-xs font-medium text-luxury-700">
            {formatCurrency(price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
