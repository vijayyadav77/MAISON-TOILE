import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, ArrowRight, ArrowLeft, Tag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { applyCouponCode, removeAppliedCoupon, clearLocalCart } from '../cartSlice.js';
import CartItem from '../components/CartItem.jsx';
import Button from '../../../components/ui/Button.jsx';
import EmptyState from '../../../components/common/EmptyState.jsx';
import Breadcrumb from '../../../components/common/Breadcrumb.jsx';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { FREE_SHIPPING_THRESHOLD } from '../../../utils/constants.js';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';

export const CartPage = () => {
  useDocumentTitle('Shopping Bag & Order Preparation');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, subtotal, shippingFee, taxAmount, discountAmount, totalAmount, appliedCoupon } =
    useSelector((state) => state.cart);

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!couponCode.trim()) return;

    const res = await dispatch(applyCouponCode(couponCode.trim()));
    if (applyCouponCode.fulfilled.match(res)) {
      setCouponSuccess(`Privilege code ${res.payload.code} successfully applied!`);
      setCouponCode('');
    } else {
      setCouponError(res.payload || 'Invalid or ineligible coupon code.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Breadcrumb items={[{ label: 'Shopping Bag' }]} />
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Bag is Empty"
          description="You currently have no haute couture pieces or runway garments in your shopping bag. Explore our ready-to-wear collections and iconic designer footwear."
          actionText="Discover The Catalogue"
          actionLink="/shop"
        />
      </div>
    );
  }

  const freeShippingDiff = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Shopping Bag' }]} />

      <div className="pt-2 pb-8 border-b border-luxury-200 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-luxury-950 font-normal">
            Your Shopping Bag
          </h1>
          <p className="text-xs uppercase tracking-widest text-luxury-500 mt-1 font-medium">
            {items.reduce((s, i) => s + i.quantity, 0)} Items Selected for Acquisition
          </p>
        </div>
        <Link
          to="/shop"
          className="text-xs uppercase tracking-widest text-luxury-900 hover:text-luxury-600 font-semibold flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Discovering</span>
        </Link>
      </div>

      {/* Free Shipping Alert */}
      <div className="my-6 p-4 bg-luxury-100 border border-luxury-200 text-xs font-sans flex items-center justify-between">
        {freeShippingDiff > 0 ? (
          <span>
            Complimentary White-Glove Shipping on orders ₹15,000+. Add <strong className="text-luxury-950">{formatCurrency(freeShippingDiff)}</strong> more.
          </span>
        ) : (
          <span className="text-emerald-800 font-semibold">
            ✨ You have qualified for Complimentary White-Glove Express Shipping.
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-2">
          {items.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>

        {/* Order Summary & Checkout Card (4 cols) */}
        <div className="lg:col-span-4">
          <div className="p-6 bg-white border border-luxury-200 shadow-sm space-y-6 sticky top-28">
            <h3 className="font-serif text-xl text-luxury-950 font-normal border-b border-luxury-200 pb-3">
              Order Summary
            </h3>

            {/* Promo Code Input */}
            <div className="space-y-2">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Tag className="w-4 h-4 text-emerald-700" />
                    <span>{appliedCoupon.code} (-{formatCurrency(discountAmount)})</span>
                  </div>
                  <button
                    onClick={() => dispatch(removeAppliedCoupon())}
                    className="text-xs text-rose-700 underline font-semibold hover:text-rose-900"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon (e.g. ÉTOILE15)"
                      className="flex-1 px-3 py-2 text-xs uppercase tracking-wider border border-luxury-300 focus:outline-none focus:border-luxury-950"
                    />
                    <Button type="submit" variant="secondary" size="sm">
                      Apply
                    </Button>
                  </div>
                  {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
                  {couponSuccess && <p className="text-[11px] text-emerald-700">{couponSuccess}</p>}
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-luxury-600 border-t border-luxury-200 pt-4 font-sans">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-medium text-luxury-900">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Privilege Code Reduction</span>
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
                <span>Luxury Goods GST (12%)</span>
                <span className="font-medium text-luxury-900">{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-luxury-950 pt-3 border-t border-luxury-200">
                <span className="font-serif">Total Payable</span>
                <span className="font-serif text-lg">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <div className="space-y-3 pt-2">
              <Button
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center gap-2"
                size="lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Luxury Assurance Badges */}
            <div className="pt-4 border-t border-luxury-200 space-y-2 text-[11px] text-luxury-500 font-sans">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-luxury-gold shrink-0" />
                <span>Verified 256-bit Secure Razorpay Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-luxury-gold shrink-0" />
                <span>White-glove courier handling & signature guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-luxury-gold shrink-0" />
                <span>Complimentary 14-day luxury returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
