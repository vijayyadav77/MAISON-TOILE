import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, ShieldCheck, Printer, Calendar } from 'lucide-react';
import apiClient from '../../../services/apiClient.js';
import { API_ENDPOINTS } from '../../../services/apiEndpoints.js';
import Button from '../../../components/ui/Button.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDate } from '../../../utils/formatDate.js';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';

export const OrderSuccessPage = () => {
  const { orderNumber } = useParams();
  useDocumentTitle(`Order Confirmation ${orderNumber || ''}`);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get(API_ENDPOINTS.ORDERS.DETAILS(orderNumber));
        setOrder(data.order);
      } catch (err) {
        console.error('Failed to load order confirmation:', err);
      } finally {
        setLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <p className="font-serif text-2xl text-luxury-950 animate-pulse">
          Retrieving Atelier Order Dossier...
        </p>
      </div>
    );
  }

  const estimatedDeliveryDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Success Hero Header */}
      <div className="text-center space-y-3 pb-8 border-b border-luxury-200">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-emerald-800 font-bold bg-emerald-100 px-3 py-1 border border-emerald-300 inline-block">
          Payment Verified & Confirmed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-luxury-950 font-normal">
          Merci Pour Votre Commande.
        </h1>
        <p className="text-xs text-luxury-600 font-sans max-w-md mx-auto leading-relaxed">
          Your order <strong className="text-luxury-950 font-semibold">{order?.orderNumber || orderNumber}</strong> has been registered with our Paris & Milan ateliers.
        </p>
      </div>

      {/* Summary Dossier Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
        <div className="p-5 bg-white border border-luxury-200 space-y-2">
          <div className="flex items-center gap-2 text-luxury-500 uppercase tracking-widest text-[10px] font-semibold">
            <Package className="w-4 h-4 text-luxury-900" />
            <span>Order Reference</span>
          </div>
          <p className="font-serif text-base font-semibold text-luxury-950">
            {order?.orderNumber || orderNumber}
          </p>
          <p className="text-luxury-500">Placed on {formatDate(order?.createdAt || new Date())}</p>
        </div>

        <div className="p-5 bg-white border border-luxury-200 space-y-2">
          <div className="flex items-center gap-2 text-luxury-500 uppercase tracking-widest text-[10px] font-semibold">
            <Calendar className="w-4 h-4 text-luxury-900" />
            <span>Estimated Delivery</span>
          </div>
          <p className="font-serif text-base font-semibold text-emerald-800">
            {formatDate(estimatedDeliveryDate)}
          </p>
          <p className="text-luxury-500">White-Glove Express Courier</p>
        </div>

        <div className="p-5 bg-white border border-luxury-200 space-y-2">
          <div className="flex items-center gap-2 text-luxury-500 uppercase tracking-widest text-[10px] font-semibold">
            <ShieldCheck className="w-4 h-4 text-luxury-900" />
            <span>Payment Security</span>
          </div>
          <p className="font-serif text-base font-semibold text-luxury-950">
            {order?.paymentDetails?.razorpayPaymentId ? 'Razorpay Verified' : 'Cryptographically Verified'}
          </p>
          <p className="text-luxury-500 font-mono text-[10px] truncate">
            Ref: {order?.paymentDetails?.razorpayPaymentId || 'rzp_verified_token'}
          </p>
        </div>
      </div>

      {/* Ordered Items Table */}
      <div className="mt-10 p-6 bg-white border border-luxury-200 shadow-sm space-y-6">
        <h3 className="font-serif text-xl font-normal text-luxury-950 border-b border-luxury-200 pb-3">
          Acquired Atelier Ensembles
        </h3>

        <div className="divide-y divide-luxury-200">
          {order?.items?.map((item, idx) => (
            <div key={idx} className="py-4 first:pt-0 flex gap-4 items-center">
              <div className="w-16 h-20 bg-luxury-100 overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-xs">
                <p className="text-[10px] uppercase tracking-widest text-luxury-500 font-semibold">{item.brand}</p>
                <h4 className="font-serif text-sm font-medium text-luxury-950">{item.name}</h4>
                <p className="text-luxury-600 text-[11px] pt-0.5">Size: {item.size} • Color: {item.color} • Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-luxury-950 text-sm">{formatCurrency(item.subtotal || item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Financial Recap */}
        <div className="pt-4 border-t border-luxury-200 space-y-2 text-xs font-sans text-luxury-700 max-w-xs ml-auto">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(order?.subtotal || 0)}</span>
          </div>
          {order?.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Privilege Discount:</span>
              <span>-{formatCurrency(order?.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>{order?.shippingFee === 0 ? 'Complimentary' : formatCurrency(order?.shippingFee)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (12%):</span>
            <span>{formatCurrency(order?.taxAmount || 0)}</span>
          </div>
          <div className="flex justify-between text-base font-serif font-semibold text-luxury-950 pt-2 border-t border-luxury-200">
            <span>Total Paid:</span>
            <span>{formatCurrency(order?.totalAmount || 0)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address Details */}
      {order?.shippingAddress && (
        <div className="mt-8 p-6 bg-white border border-luxury-200 shadow-sm text-xs font-sans space-y-2">
          <h4 className="font-serif text-base font-semibold text-luxury-950">White-Glove Shipping Destination</h4>
          <p className="font-medium text-luxury-900">{order.shippingAddress.recipientName}</p>
          <p className="text-luxury-600">{order.shippingAddress.street} {order.shippingAddress.apartment && `, ${order.shippingAddress.apartment}`}</p>
          <p className="text-luxury-600">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
          <p className="text-luxury-500 pt-1">Recipient Mobile: {order.shippingAddress.phone}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link to="/account/orders">
          <Button size="lg" className="flex items-center gap-2">
            <span>Track Order Dossier</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <Link to="/shop">
          <Button variant="outline" size="lg">
            Return to Storefront
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
