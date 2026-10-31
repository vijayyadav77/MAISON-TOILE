import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { orderService } from '../services/orderService.js';
import Breadcrumb from '../../../components/common/Breadcrumb.jsx';
import EmptyState from '../../../components/common/EmptyState.jsx';
import Button from '../../../components/ui/Button.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDate } from '../../../utils/formatDate.js';
import { ORDER_STATUS_LABELS } from '../../../utils/constants.js';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';

export const OrderHistoryPage = () => {
  useDocumentTitle('My Atelier Orders & Acquisition History');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getMyOrders();
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="font-serif text-2xl text-luxury-950 animate-pulse">
          Loading Atelier Orders...
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Breadcrumb items={[{ label: 'My Account', path: '/account/profile' }, { label: 'Order History' }]} />
        <EmptyState
          icon={Package}
          title="No Previous Orders Found"
          description="You haven’t completed any acquisitions from Maison Étoile yet. Explore our latest runway debuts and curated ready-to-wear collections."
          actionText="Browse The Runway"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'My Account', path: '/account/profile' }, { label: 'Order History' }]} />

      <div className="pt-2 pb-8 border-b border-luxury-200">
        <h1 className="font-serif text-3xl sm:text-4xl text-luxury-950 font-normal">
          Atelier Order History
        </h1>
        <p className="text-xs uppercase tracking-widest text-luxury-500 mt-1 font-medium">
          {orders.length} Verified Haute Couture Acquisitions
        </p>
      </div>

      <div className="pt-8 space-y-6">
        {orders.map((order) => {
          const statusInfo = ORDER_STATUS_LABELS[order.orderStatus] || { label: order.orderStatus, color: 'bg-luxury-100' };

          return (
            <div
              key={order._id}
              className="bg-white border border-luxury-200 shadow-sm p-6 space-y-6 transition-all hover:border-luxury-400"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luxury-100 pb-4 text-xs font-sans">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-luxury-500 font-semibold block">
                    Order Reference
                  </span>
                  <p className="font-serif text-lg font-semibold text-luxury-950">
                    {order.orderNumber}
                  </p>
                  <p className="text-luxury-500 text-[11px]">Placed on {formatDate(order.createdAt)}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-widest text-luxury-500 font-semibold block">
                      Total Payable
                    </span>
                    <p className="font-serif text-base font-semibold text-luxury-950">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-[10px] uppercase font-bold tracking-widest border ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>
              </div>

              {/* Items in this order */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <div className="w-16 h-20 bg-luxury-100 overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-xs font-sans">
                      <p className="text-[10px] uppercase tracking-widest text-luxury-500 font-semibold">
                        {item.brand}
                      </p>
                      <h4 className="font-serif text-sm font-medium text-luxury-950 line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-luxury-600 text-[11px]">
                        Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                      </p>
                      <p className="font-semibold text-luxury-900 pt-0.5">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-luxury-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-luxury-500 font-sans">
                  Payment Status:{' '}
                  <strong className="uppercase text-luxury-950 font-semibold">
                    {order.paymentStatus}
                  </strong>
                </span>
                <Link
                  to={`/account/orders/${order.orderNumber}`}
                  className="font-semibold uppercase tracking-wider text-luxury-950 hover:text-luxury-600 flex items-center gap-1.5"
                >
                  <span>View Complete Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
