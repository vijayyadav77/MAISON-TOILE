import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { X, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { closeCartDrawer, applyCouponCode, removeAppliedCoupon } from '../cartSlice.js';
import CartItem from './CartItem.jsx';
import Button from '../../../components/ui/Button.jsx';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { FREE_SHIPPING_THRESHOLD } from '../../../utils/constants.js';

export const CartDrawer = () => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const { items, subtotal, shippingFee, taxAmount, discountAmount, totalAmount, appliedCoupon, isDrawerOpen } =
    useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!couponInput.trim()) return;

    const result = await dispatch(applyCouponCode(couponInput.trim()));
    if (applyCouponCode.fulfilled.match(result)) {
      setCouponSuccess(`Coupon ${result.payload.code} applied!`);
      setCouponInput('');
    } else {
      setCouponError(result.payload || 'Invalid coupon code');
    }
  };

  const handleCheckout = () => {
    dispatch(closeCartDrawer());
    navigate('/checkout');
  };

  const handleViewCart = () => {
    dispatch(closeCartDrawer());
    navigate('/cart');
  };

  if (!isDrawerOpen) return null;

  const amountRemainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => dispatch(closeCartDrawer())}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-luxury-200 flex items-center justify-between bg-luxury-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-luxury-900" />
              <h3 className="font-serif text-lg tracking-wider text-luxury-950 font-semibold uppercase">
                Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={() => dispatch(closeCartDrawer())}
              className="p-1.5 text-luxury-500 hover:text-luxury-950 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-2.5 bg-luxury-100 text-[11px] text-luxury-800 border-b border-luxury-200 text-center font-medium">
            {amountRemainingForFreeShipping > 0 ? (
              <span>
                Add <strong className="text-luxury-950">{formatCurrency(amountRemainingForFreeShipping)}</strong> more for complimentary shipping
              </span>
            ) : (
              <span className="text-emerald-800 font-semibold">
                ✨ Complimentary White-Glove Shipping Unlocked!
              </span>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="text-center py-24 space-y-4">
                <ShoppingBag className="w-12 h-12 text-luxury-300 mx-auto" />
                <h4 className="font-serif text-xl text-luxury-800">Your shopping bag is empty</h4>
                <p className="text-xs text-luxury-500 max-w-xs mx-auto">
                  Explore our curated high-fashion ready-to-wear and couture collections.
                </p>
                <div className="pt-2">
                  <Button onClick={() => { dispatch(closeCartDrawer()); navigate('/shop'); }}>
                    Discover Runway
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                {items.map((item) => (
                  <CartItem key={item._id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer with Totals & Actions */}
          {items.length > 0 && (
            <div className="border-t border-luxury-200 p-6 bg-luxury-50 space-y-4">
              {/* Promo Code Input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Tag className="w-4 h-4 text-emerald-700" />
                      <span>{appliedCoupon.code} applied (-{formatCurrency(discountAmount)})</span>
                    </div>
                    <button
                      onClick={() => dispatch(removeAppliedCoupon())}
                      className="text-xs text-rose-700 underline font-medium hover:text-rose-900"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Privilege Code (e.g. ÉTOILE15)"
                      className="flex-1 px-3 py-2 text-xs uppercase tracking-wider bg-white border border-luxury-300 focus:border-luxury-900 focus:outline-none"
                    />
                    <Button type="submit" variant="secondary" size="sm">
                      Apply
                    </Button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-emerald-700 mt-1">{couponSuccess}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-luxury-600 border-t border-luxury-200 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-luxury-900">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Privilege Reduction</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-medium text-luxury-900">
                    {shippingFee === 0 ? 'Complimentary' : formatCurrency(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Luxury Goods Tax (12%)</span>
                  <span className="font-medium text-luxury-900">{formatCurrency(taxAmount)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-luxury-950 pt-2 border-t border-luxury-200">
                  <span className="font-serif">Total Payable</span>
                  <span className="font-serif text-base">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-2 pt-2">
                <Button onClick={handleCheckout} className="w-full flex items-center justify-center gap-2">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button onClick={handleViewCart} variant="outline" className="w-full">
                  Review Bag & Details
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
