import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, XCircle, ShieldCheck, MapPin, CreditCard, Clock } from 'lucide-react';
import { orderService } from '../services/orderService.js';
import OrderTimeline from '../components/OrderTimeline.jsx';
import Breadcrumb from '../../../components/common/Breadcrumb.jsx';
import Button from '../../../components/ui/Button.jsx';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDate } from '../../../utils/formatDate.js';
import { ORDER_STATUS_LABELS } from '../../../utils/constants.js';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';

export const OrderDetailsPage = () => {
  const { id } = useParams();
  useDocumentTitle(`Order Dossier ${id || ''}`);

  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await orderService.getOrderDetails(id);
        setOrder(data.order);
      } catch (err) {
        setError(err.message || 'Failed to retrieve order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you certain you wish to cancel this haute couture order? Restocking will be initiated.')) {
      return;
    }

    try {
      setCancelling(true);
      const res = await orderService.cancelOrder(order._id);
      setOrder(res.order);
    } catch (err) {
      alert(err.message || 'Failed to cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-serif text-2xl text-luxury-950 animate-pulse">
        Retrieving Order Dossier...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl text-luxury-950">Dossier Unavailable</h2>
        <p className="text-xs text-luxury-600">{error || 'Order record not found.'}</p>
        <Link to="/account/orders">
          <Button>Return to Orders</Button>
        </Link>
      </div>
    );
  }

  const statusInfo = ORDER_STATUS_LABELS[order.orderStatus] || { label: order.orderStatus, color: 'bg-luxury-100' };
  const canCancel = order.orderStatus === 'processing' || order.orderStatus === 'confirmed';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: 'My Account', path: '/account/profile' },
          { label: 'Orders', path: '/account/orders' },
          { label: order.orderNumber },
        ]}
      />

      <div className="pt-2 pb-6 border-b border-luxury-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-luxury-500 font-semibold block">
            Atelier Order Dossier
          </span>
          <h1 className="font-serif text-3xl font-normal text-luxury-950">
            {order.orderNumber}
          </h1>
          <p className="text-xs text-luxury-500 font-sans">
            Registered on {formatDate(order.createdAt, { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 text-xs uppercase font-bold tracking-widest border ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
          {canCancel && (
            <Button
              variant="outline"
              size="sm"
              isLoading={cancelling}
              onClick={handleCancelOrder}
              className="border-rose-300 text-rose-700 hover:bg-rose-50"
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="my-6 p-6 bg-white border border-luxury-200 shadow-sm">
        <h3 className="font-serif text-base text-luxury-950 font-semibold mb-2">
          Fulfillment Progress
        </h3>
        <OrderTimeline orderStatus={order.orderStatus} timeline={order.timeline} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ordered Pieces (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 bg-white border border-luxury-200 shadow-sm space-y-4">
            <h3 className="font-serif text-lg text-luxury-950 font-normal border-b border-luxury-200 pb-3">
              Ensemble Pieces ({order.items.length})
            </h3>
            <div className="divide-y divide-luxury-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 first:pt-0 flex gap-4 items-center">
                  <div className="w-16 h-20 bg-luxury-100 overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-xs font-sans">
                    <p className="text-[10px] uppercase tracking-widest text-luxury-500 font-semibold">
                      {item.brand}
                    </p>
                    <h4 className="font-serif text-sm font-medium text-luxury-950">
                      {item.name}
                    </h4>
                    <p className="text-luxury-600 text-[11px] pt-0.5">
                      Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                    </p>
                    <p className="font-semibold text-luxury-950 pt-1">
                      {formatCurrency(item.subtotal || item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Timeline Log */}
          {order.timeline && order.timeline.length > 0 && (
            <div className="p-6 bg-white border border-luxury-200 shadow-sm space-y-3">
              <h4 className="font-serif text-base font-semibold text-luxury-950 flex items-center gap-2">
                <Clock className="w-4 h-4 text-luxury-700" />
                <span>Atelier Status Log</span>
              </h4>
              <div className="space-y-3 text-xs font-sans">
                {order.timeline.map((event, idx) => (
                  <div key={idx} className="flex items-start justify-between border-b border-luxury-100 pb-2">
                    <div>
                      <p className="font-semibold text-luxury-950 uppercase tracking-wider text-[11px]">
                        {event.status}
                      </p>
                      {event.note && <p className="text-luxury-600 text-[11px]">{event.note}</p>}
                    </div>
                    <span className="text-[10px] text-luxury-400">
                      {formatDate(event.timestamp, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Address & Payment Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Shipping Address Card */}
          <div className="p-6 bg-white border border-luxury-200 shadow-sm text-xs font-sans space-y-2">
            <h4 className="font-serif text-base font-semibold text-luxury-950 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-luxury-900" />
              <span>Shipping Destination</span>
            </h4>
            <p className="font-semibold text-luxury-950">{order.shippingAddress?.recipientName}</p>
            <p className="text-luxury-600">{order.shippingAddress?.street} {order.shippingAddress?.apartment && `, ${order.shippingAddress.apartment}`}</p>
            <p className="text-luxury-600">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}</p>
            <p className="text-luxury-500 pt-1">Phone: {order.shippingAddress?.phone}</p>
          </div>

          {/* Payment & Financial Ledger */}
          <div className="p-6 bg-white border border-luxury-200 shadow-sm text-xs font-sans space-y-4">
            <h4 className="font-serif text-base font-semibold text-luxury-950 flex items-center gap-2 border-b border-luxury-200 pb-3">
              <CreditCard className="w-4 h-4 text-luxury-900" />
              <span>Financial Ledger</span>
            </h4>

            <div className="space-y-2 text-luxury-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium text-luxury-900">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Privilege Discount:</span>
                  <span>-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-medium text-luxury-900">
                  {order.shippingFee === 0 ? 'Complimentary' : formatCurrency(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Luxury Goods GST (12%):</span>
                <span className="font-medium text-luxury-900">{formatCurrency(order.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-base font-serif font-semibold text-luxury-950 pt-2 border-t border-luxury-200">
                <span>Total Amount:</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-luxury-100 text-[11px] text-luxury-500 space-y-1">
              <p>Payment: <strong className="uppercase text-luxury-950 font-semibold">{order.paymentStatus}</strong></p>
              {order.paymentDetails?.razorpayPaymentId && (
                <p className="font-mono text-[10px]">Payment ID: {order.paymentDetails.razorpayPaymentId}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
