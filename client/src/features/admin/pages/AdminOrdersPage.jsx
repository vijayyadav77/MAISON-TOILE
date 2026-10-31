import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService.js';
import Button from '../../../components/ui/Button.jsx';
import Modal from '../../../components/ui/Modal.jsx';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { formatDate } from '../../../utils/formatDate.js';
import { ORDER_STATUS_LABELS } from '../../../utils/constants.js';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';

export const AdminOrdersPage = () => {
  useDocumentTitle('Atelier Orders Fulfillment');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('confirmed');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminService.getOrders();
      setOrders(res.orders || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenStatusModal = (ord) => {
    setSelectedOrder(ord);
    setNewStatus(ord.orderStatus);
    setStatusNote('');
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await adminService.updateOrderStatus(selectedOrder._id, newStatus, statusNote);
      setIsModalOpen(false);
      fetchOrders();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="border-b border-luxury-800 pb-6">
        <h1 className="font-serif text-3xl font-normal text-white">
          Orders & Fulfillment
        </h1>
        <p className="text-xs uppercase tracking-widest text-luxury-400 mt-1 font-medium">
          White-Glove Dispatch, Tracking Status & Verification
        </p>
      </div>

      <div className="bg-luxury-900 border border-luxury-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-luxury-950 text-[10px] uppercase tracking-widest text-luxury-400 border-b border-luxury-800">
              <tr>
                <th className="py-4 px-4">Order #</th>
                <th className="py-4 px-4">Client</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Total</th>
                <th className="py-4 px-4">Payment</th>
                <th className="py-4 px-4">Fulfillment</th>
                <th className="py-4 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-800/60 text-luxury-200">
              {orders.map((ord) => {
                const statusInfo = ORDER_STATUS_LABELS[ord.orderStatus] || { label: ord.orderStatus, color: 'bg-luxury-800' };
                return (
                  <tr key={ord._id} className="hover:bg-luxury-850/50">
                    <td className="py-3 px-4 font-mono font-medium text-white">{ord.orderNumber}</td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-white">{ord.user?.name || ord.shippingAddress?.recipientName}</p>
                      <p className="text-[10px] text-luxury-400">{ord.user?.email}</p>
                    </td>
                    <td className="py-3 px-4 text-luxury-400">{formatDate(ord.createdAt)}</td>
                    <td className="py-3 px-4 font-semibold text-white">{formatCurrency(ord.totalAmount)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest ${
                        ord.paymentStatus === 'paid' ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800' : 'text-amber-400'
                      }`}>
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest border ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenStatusModal(ord)}
                        className="px-3 py-1.5 bg-luxury-800 hover:bg-luxury-700 text-white text-[11px] uppercase tracking-wider font-semibold transition-colors"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Update Order ${selectedOrder?.orderNumber}`}
        subtitle="White-Glove Status Transition"
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4 text-luxury-950">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-medium text-luxury-700 mb-1.5">
              Select Fulfillment Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-luxury-200 text-sm focus:outline-none focus:border-luxury-900"
            >
              <option value="processing">Order Placed (Processing)</option>
              <option value="confirmed">Confirmed & Authenticated</option>
              <option value="shipped">In Transit (Dispatched with Courier)</option>
              <option value="delivered">Delivered to Client</option>
              <option value="cancelled">Cancelled & Restocked</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-medium text-luxury-700 mb-1.5">
              Status Change Note / Tracking Code
            </label>
            <input
              type="text"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="e.g. Dispatched with Bluedart Air Signature Express #BD-998811"
              className="w-full px-4 py-3 bg-white border border-luxury-200 text-sm focus:outline-none focus:border-luxury-900"
            />
          </div>

          <Button type="submit" isLoading={updating} size="md" className="w-full mt-4">
            Record Status Change
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminOrdersPage;
