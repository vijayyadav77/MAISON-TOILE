import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShieldCheck,
  Truck,
  Plus,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
  CreditCard,
  MapPin,
} from 'lucide-react';
import { checkoutService } from '../services/checkoutService.js';
import { authService } from '../../auth/services/authService.js';
import { updateUserAddresses } from '../../auth/authSlice.js';
import { clearLocalCart } from '../../cart/cartSlice.js';
import Breadcrumb from '../../../components/common/Breadcrumb.jsx';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';

export const CheckoutPage = () => {
  useDocumentTitle('Haute Couture Order Checkout');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items, subtotal, shippingFee, taxAmount, discountAmount, totalAmount, appliedCoupon } =
    useSelector((state) => state.cart);

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipientName: user?.name || '',
    phone: user?.phone || '+91 ',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [simulationActive, setSimulationActive] = useState(false);

  useEffect(() => {
    if (user?.addresses?.length > 0) {
      const defaultIdx = user.addresses.findIndex((a) => a.isDefault);
      setSelectedAddressIndex(defaultIdx !== -1 ? defaultIdx : 0);
    } else {
      setShowNewAddressForm(true);
    }
  }, [user]);

  // If not logged in, enforce authentication
  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-luxury-100 rounded-full flex items-center justify-center mx-auto text-luxury-900">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-3xl text-luxury-950 font-normal">
            Private Atelier Sign In Required
          </h2>
          <p className="text-xs text-luxury-600 max-w-md mx-auto font-sans leading-relaxed">
            To ensure white-glove delivery, order tracking, and authenticity insurance, please sign in or register your account before proceeding to payment. Your selected items will remain intact.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-4">
          <Link to="/login?redirect=/checkout">
            <Button size="lg">Sign In to Continue</Button>
          </Link>
          <Link to="/signup?redirect=/checkout">
            <Button variant="outline" size="lg">Create Account</Button>
          </Link>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl text-luxury-950">Your Bag is Empty</h2>
        <p className="text-xs text-luxury-600">Please select garments before checking out.</p>
        <Link to="/shop">
          <Button>Discover Runway Collections</Button>
        </Link>
      </div>
    );
  }

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.addAddress(newAddress);
      dispatch(updateUserAddresses(res.addresses));
      setSelectedAddressIndex(res.addresses.length - 1);
      setShowNewAddressForm(false);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save address.');
    }
  };

  const getActiveShippingAddress = () => {
    if (user?.addresses && user.addresses.length > 0 && !showNewAddressForm) {
      return user.addresses[selectedAddressIndex] || user.addresses[0];
    }
    return newAddress;
  };

  const handleInitiatePayment = async () => {
    const address = getActiveShippingAddress();
    if (!address || !address.recipientName || !address.street || !address.city || !address.phone) {
      setErrorMessage('Please provide a complete shipping address including recipient name, phone, street, and city.');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage('');

      // Step 1: Create Order in MongoDB
      const orderPayload = {
        items: items.map((i) => ({
          productId: i.productId || i.product?._id || i.product,
          name: i.name || i.product?.name,
          brand: i.brand || i.product?.brand,
          image: i.image || i.product?.images?.[0],
          size: i.size,
          color: i.color,
          quantity: i.quantity,
          price: i.price,
        })),
        shippingAddress: address,
        couponCode: appliedCoupon?.code,
      };

      const { order } = await checkoutService.createOrder(orderPayload);

      // Step 2: Create Razorpay Order on Backend
      const razorpayData = await checkoutService.createRazorpayOrder(order._id);

      // Step 3: Launch Razorpay Modal or Sandbox Handler
      if (typeof window.Razorpay !== 'undefined') {
        const options = {
          key: razorpayData.keyId,
          amount: razorpayData.amount,
          currency: razorpayData.currency || 'INR',
          name: 'MAISON ÉTOILE',
          description: `Haute Couture Order ${razorpayData.orderNumber}`,
          image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=200',
          order_id: razorpayData.razorpayOrderId.startsWith('order_test_') ? undefined : razorpayData.razorpayOrderId,
          prefill: {
            name: user.name,
            email: user.email,
            contact: address.phone || user.phone,
          },
          theme: {
            color: '#0A0A0A',
          },
          handler: async function (response) {
            await handlePaymentVerification({
              razorpayOrderId: response.razorpay_order_id || razorpayData.razorpayOrderId,
              razorpayPaymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
              razorpaySignature: response.razorpay_signature || 'test_verified_signature',
              orderId: order._id,
              orderNumber: order.orderNumber,
            });
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              setErrorMessage('Payment cancelled or window closed. You can re-attempt or use sandbox simulated verification below.');
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (res) {
          setIsProcessing(false);
          setErrorMessage(`Payment declined: ${res.error.description}`);
        });
        rzp.open();
      } else {
        // Fallback for sandboxed developer environments where third-party script CDN may be filtered
        setSimulationActive(true);
        setIsProcessing(false);
      }
    } catch (err) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Payment initiation failed.');
    }
  };

  const handlePaymentVerification = async ({ razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId, orderNumber }) => {
    try {
      setIsProcessing(true);
      const verifyRes = await checkoutService.verifyPayment({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        orderId,
      });

      dispatch(clearLocalCart());
      setIsProcessing(false);
      navigate(`/order-success/${orderNumber || verifyRes.order?.orderNumber}`);
    } catch (err) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Payment verification failed on the server.');
    }
  };

  // Instant sandbox test completion for demonstration purposes
  const handleSimulatedTestSuccess = async () => {
    const address = getActiveShippingAddress();
    try {
      setIsProcessing(true);
      const orderPayload = {
        items: items.map((i) => ({
          productId: i.productId || i.product?._id || i.product,
          name: i.name || i.product?.name,
          brand: i.brand || i.product?.brand,
          image: i.image || i.product?.images?.[0],
          size: i.size,
          color: i.color,
          quantity: i.quantity,
          price: i.price,
        })),
        shippingAddress: address,
        couponCode: appliedCoupon?.code,
      };

      const { order } = await checkoutService.createOrder(orderPayload);
      const razorpayData = await checkoutService.createRazorpayOrder(order._id);

      await handlePaymentVerification({
        razorpayOrderId: razorpayData.razorpayOrderId,
        razorpayPaymentId: `pay_test_${Date.now()}`,
        razorpaySignature: 'simulated_sig_success_token',
        orderId: order._id,
        orderNumber: order.orderNumber,
      });
    } catch (err) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Sandbox simulated payment failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Shopping Bag', path: '/cart' }, { label: 'Secure Checkout' }]} />

      <div className="pt-2 pb-8 border-b border-luxury-200">
        <h1 className="font-serif text-3xl sm:text-4xl text-luxury-950 font-normal">
          White-Glove Order Checkout
        </h1>
        <p className="text-xs uppercase tracking-widest text-luxury-500 mt-1 font-medium flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>256-Bit Encrypted Atelier Transaction</span>
        </p>
      </div>

      {errorMessage && (
        <div className="my-6 p-4 bg-rose-50 border border-rose-200 text-xs text-rose-700 font-sans flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
        {/* Left Column: Address Selection & Payment Methods (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Shipping Address */}
          <div className="p-6 bg-white border border-luxury-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-luxury-200 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-luxury-900" />
                <h3 className="font-serif text-lg font-medium text-luxury-950 uppercase tracking-wide">
                  1. Delivery Address
                </h3>
              </div>
              {user?.addresses?.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                  className="text-xs uppercase tracking-wider text-luxury-950 underline font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showNewAddressForm ? 'Use Saved Address' : 'Add New Address'}</span>
                </button>
              )}
            </div>

            {/* Saved Addresses List */}
            {!showNewAddressForm && user?.addresses && user.addresses.length > 0 && (
              <div className="space-y-3">
                {user.addresses.map((addr, idx) => (
                  <div
                    key={addr._id || idx}
                    onClick={() => setSelectedAddressIndex(idx)}
                    className={`p-4 border cursor-pointer transition-all flex items-start gap-3 ${
                      selectedAddressIndex === idx
                        ? 'border-luxury-950 bg-luxury-50/70 shadow-sm'
                        : 'border-luxury-200 hover:border-luxury-400 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressIndex === idx}
                      onChange={() => setSelectedAddressIndex(idx)}
                      className="mt-1 accent-luxury-950"
                    />
                    <div className="text-xs text-luxury-800 space-y-0.5 font-sans flex-1">
                      <p className="font-semibold text-luxury-950">{addr.recipientName}</p>
                      <p>{addr.street} {addr.apartment && `, ${addr.apartment}`}</p>
                      <p>{addr.city}, {addr.state} - {addr.postalCode}, {addr.country}</p>
                      <p className="text-luxury-500 pt-1">Phone: {addr.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* New Address Form */}
            {showNewAddressForm && (
              <form onSubmit={handleAddNewAddress} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Recipient Full Name"
                    required
                    value={newAddress.recipientName}
                    onChange={(e) => setNewAddress({ ...newAddress, recipientName: e.target.value })}
                  />
                  <Input
                    label="Mobile Phone (for white-glove courier)"
                    required
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  />
                </div>

                <Input
                  label="Street Address / Residence"
                  required
                  placeholder="e.g. 14B Altamount Road Towers"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                />

                <Input
                  label="Apartment, Suite, Unit (Optional)"
                  placeholder="e.g. Floor 14"
                  value={newAddress.apartment}
                  onChange={(e) => setNewAddress({ ...newAddress, apartment: e.target.value })}
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    required
                    placeholder="Mumbai"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  />
                  <Input
                    label="State"
                    required
                    placeholder="Maharashtra"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  />
                  <Input
                    label="Postal Code"
                    required
                    placeholder="400026"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                  />
                </div>

                <Button type="submit" size="sm" variant="secondary">
                  Save Address for Future Orders
                </Button>
              </form>
            )}
          </div>

          {/* Section 2: Payment Method */}
          <div className="p-6 bg-white border border-luxury-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-luxury-200 pb-3">
              <CreditCard className="w-4 h-4 text-luxury-900" />
              <h3 className="font-serif text-lg font-medium text-luxury-950 uppercase tracking-wide">
                2. Payment Gateway
              </h3>
            </div>

            <div className="p-4 border-2 border-luxury-950 bg-luxury-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-luxury-950" />
                <div>
                  <p className="text-xs font-semibold text-luxury-950 uppercase tracking-wider">
                    Razorpay Gateway (Test Mode / Instant Simulation)
                  </p>
                  <p className="text-[11px] text-luxury-600 font-sans">
                    Supports UPI, Credit/Debit Cards, NetBanking, and Wallets
                  </p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 bg-emerald-100 px-2 py-0.5 border border-emerald-300">
                Verified Test Mode
              </span>
            </div>

            <p className="text-[11px] text-luxury-500 font-sans leading-relaxed">
              Upon clicking "Authorize & Place Order", the official Razorpay test checkout window will open. Once completed, your order status is securely signed and verified cryptographically on our server.
            </p>
          </div>
        </div>

        {/* Right Column: Order Items & Price Summary (5 cols) */}
        <div className="lg:col-span-5">
          <div className="p-6 bg-white border border-luxury-200 shadow-sm space-y-6 sticky top-28">
            <h3 className="font-serif text-xl text-luxury-950 font-normal border-b border-luxury-200 pb-3">
              Ensemble Review ({items.reduce((s, i) => s + i.quantity, 0)})
            </h3>

            {/* Thumbnail review */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 divide-y divide-luxury-100">
              {items.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex gap-3 items-center">
                  <div className="w-12 h-16 bg-luxury-100 overflow-hidden shrink-0">
                    <img
                      src={item.image || item.product?.images?.[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-xs">
                    <p className="font-serif font-medium text-luxury-950 line-clamp-1">{item.name}</p>
                    <p className="text-luxury-500 text-[11px]">{item.size} • {item.color} • Qty {item.quantity}</p>
                    <p className="font-semibold text-luxury-900 pt-0.5">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-2 text-xs text-luxury-600 border-t border-luxury-200 pt-4 font-sans">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-medium text-luxury-900">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Privilege Code ({appliedCoupon?.code})</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>White-Glove Shipping</span>
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

            {/* Action Button */}
            <div className="space-y-2 pt-2">
              <Button
                onClick={handleInitiatePayment}
                isLoading={isProcessing}
                className="w-full flex items-center justify-center gap-2"
                size="lg"
              >
                <Lock className="w-4 h-4" />
                <span>Pay {formatCurrency(totalAmount)} with Razorpay</span>
              </Button>

              {/* Developer / Reviewer Instant Simulation Option */}
              <button
                type="button"
                onClick={handleSimulatedTestSuccess}
                disabled={isProcessing}
                className="w-full py-2.5 text-[11px] uppercase tracking-wider font-semibold text-luxury-700 bg-luxury-100 hover:bg-luxury-200 border border-luxury-300 transition-colors"
              >
                ⚡ Instant Portfolio Sandbox Test Checkout
              </button>
            </div>

            <p className="text-[10px] text-center text-luxury-500 font-sans">
              Complimentary White-Glove Insurance included with all orders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
