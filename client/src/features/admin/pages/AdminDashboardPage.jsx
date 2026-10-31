import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { adminService } from '../services/adminService.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDate } from '../../../utils/formatDate.js';
import { ORDER_STATUS_LABELS } from '../../../utils/constants.js';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';

export const AdminDashboardPage = () => {
  useDocumentTitle('Atelier Executive Overview');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const res = await adminService.getAnalytics();
        setData(res);
      } catch (err) {
        console.error('Failed to load admin analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 font-serif text-2xl text-luxury-100 animate-pulse">
        Compiling Atelier Intelligence...
      </div>
    );
  }

  const { metrics = {}, lowStockProducts = [], recentOrders = [] } = data || {};

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-normal text-white">
          Executive Atelier Analytics
        </h1>
        <p className="text-xs uppercase tracking-widest text-luxury-400 mt-1 font-medium">
          Maison Étoile Global Runway Operations & Revenue
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sales */}
        <div className="p-6 bg-luxury-900 border border-luxury-800 space-y-3">
          <div className="flex items-center justify-between text-luxury-gold">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-luxury-400">
              Verified Revenue
            </span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="font-serif text-3xl font-semibold text-white">
            {formatCurrency(metrics.totalSales || 0)}
          </p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-sans">
            <span>● Net paid collections</span>
          </p>
        </div>

        {/* Total Orders */}
        <div className="p-6 bg-luxury-900 border border-luxury-800 space-y-3">
          <div className="flex items-center justify-between text-luxury-400">
            <span className="text-[10px] uppercase tracking-widest font-semibold">
              Total Acquisitions
            </span>
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
          <p className="font-serif text-3xl font-semibold text-white">
            {metrics.totalOrders || 0}
          </p>
          <Link to="/admin/orders" className="text-[11px] text-luxury-400 hover:text-white flex items-center gap-1 font-sans">
            <span>Manage fulfillment</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Products */}
        <div className="p-6 bg-luxury-900 border border-luxury-800 space-y-3">
          <div className="flex items-center justify-between text-luxury-400">
            <span className="text-[10px] uppercase tracking-widest font-semibold">
              Runway Designs
            </span>
            <Package className="w-4 h-4 text-white" />
          </div>
          <p className="font-serif text-3xl font-semibold text-white">
            {metrics.totalProducts || 0}
          </p>
          <Link to="/admin/products" className="text-[11px] text-luxury-400 hover:text-white flex items-center gap-1 font-sans">
            <span>Catalogue inventory</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Registered Clientele */}
        <div className="p-6 bg-luxury-900 border border-luxury-800 space-y-3">
          <div className="flex items-center justify-between text-luxury-400">
            <span className="text-[10px] uppercase tracking-widest font-semibold">
              VIP Clientele
            </span>
            <Users className="w-4 h-4 text-white" />
          </div>
          <p className="font-serif text-3xl font-semibold text-white">
            {metrics.totalUsers || 0}
          </p>
          <Link to="/admin/users" className="text-[11px] text-luxury-400 hover:text-white flex items-center gap-1 font-sans">
            <span>Client directory</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (8 cols) */}
        <div className="lg:col-span-8 p-6 bg-luxury-900 border border-luxury-800 space-y-4">
          <div className="flex items-center justify-between border-b border-luxury-800 pb-4">
            <h3 className="font-serif text-lg font-normal text-white">
              Recent Order Acquisitions
            </h3>
            <Link to="/admin/orders" className="text-xs uppercase tracking-wider text-luxury-gold hover:underline font-semibold">
              View All Orders
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="text-[10px] uppercase tracking-widest text-luxury-400 border-b border-luxury-800">
                <tr>
                  <th className="py-3 px-2">Order #</th>
                  <th className="py-3 px-2">Client</th>
                  <th className="py-3 px-2">Items</th>
                  <th className="py-3 px-2">Total</th>
                  <th className="py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-800/60 text-luxury-200">
                {recentOrders.map((ord) => {
                  const statusInfo = ORDER_STATUS_LABELS[ord.orderStatus] || { label: ord.orderStatus, color: 'bg-luxury-800' };
                  return (
                    <tr key={ord._id} className="hover:bg-luxury-850/50">
                      <td className="py-3 px-2 font-mono font-medium text-white">{ord.orderNumber}</td>
                      <td className="py-3 px-2">{ord.user?.name || 'Guest Client'}</td>
                      <td className="py-3 px-2">{ord.items?.length || 0} pieces</td>
                      <td className="py-3 px-2 font-semibold text-white">{formatCurrency(ord.totalAmount)}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts (4 cols) */}
        <div className="lg:col-span-4 p-6 bg-luxury-900 border border-luxury-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-luxury-800 pb-4">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="font-serif text-lg font-normal text-white">
              Atelier Inventory Alerts
            </h3>
          </div>

          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-luxury-400">All runway stock levels are optimal.</p>
            ) : (
              lowStockProducts.map((p) => (
                <div key={p._id} className="flex gap-3 items-center p-2.5 bg-luxury-850 border border-luxury-800">
                  <div className="w-10 h-12 bg-luxury-800 overflow-hidden shrink-0">
                    <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-xs">
                    <p className="text-white font-medium truncate font-serif">{p.name}</p>
                    <p className="text-[10px] text-luxury-400 uppercase tracking-widest">{p.brand}</p>
                    <p className="text-amber-400 font-semibold text-[11px] pt-0.5">
                      Only {p.totalStock} units in salon
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
