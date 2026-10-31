import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { authService } from '../../auth/services/authService.js';
import { updateUserAddresses } from '../../auth/authSlice.js';
import Breadcrumb from '../../../components/common/Breadcrumb.jsx';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';
import Modal from '../../../components/ui/Modal.jsx';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';

export const AddressesPage = () => {
  useDocumentTitle('Shipping Addresses & Destinations');
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    recipientName: user?.name || '',
    phone: user?.phone || '+91 ',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const res = await authService.addAddress(formData);
      dispatch(updateUserAddresses(res.addresses));
      setIsModalOpen(false);
      setFormData({
        recipientName: user?.name || '',
        phone: user?.phone || '+91 ',
        street: '',
        apartment: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isDefault: false,
      });
    } catch (err) {
      setError(err.message || 'Failed to save address.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Remove this address from your book?')) return;
    try {
      const res = await authService.deleteAddress(id);
      dispatch(updateUserAddresses(res.addresses));
    } catch (err) {
      alert(err.message || 'Failed to delete address.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: 'My Account', path: '/account/profile' },
          { label: 'Address Book' },
        ]}
      />

      <div className="pt-2 pb-8 border-b border-luxury-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-luxury-950 font-normal">
            Atelier Address Book
          </h1>
          <p className="text-xs uppercase tracking-widest text-luxury-500 mt-1 font-medium">
            Manage Destinations for White-Glove Deliveries
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          size="sm"
          className="flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Destination</span>
        </Button>
      </div>

      <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {user?.addresses?.map((addr) => (
          <div
            key={addr._id}
            className="p-6 bg-white border border-luxury-200 shadow-sm flex flex-col justify-between space-y-4 relative"
          >
            <div className="space-y-2 text-xs font-sans">
              <div className="flex items-center justify-between">
                <p className="font-serif text-base font-semibold text-luxury-950">
                  {addr.recipientName}
                </p>
                {addr.isDefault && (
                  <span className="text-[9px] uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 font-bold">
                    Primary Destination
                  </span>
                )}
              </div>

              <p className="text-luxury-700 leading-relaxed">
                {addr.street} {addr.apartment && `, ${addr.apartment}`}
              </p>
              <p className="text-luxury-700">
                {addr.city}, {addr.state} - {addr.postalCode}
              </p>
              <p className="text-luxury-700 font-medium">{addr.country}</p>
              <p className="text-luxury-500 pt-1">Phone: {addr.phone}</p>
            </div>

            <div className="pt-4 border-t border-luxury-100 flex justify-end">
              <button
                type="button"
                onClick={() => handleDeleteAddress(addr._id)}
                className="text-luxury-400 hover:text-rose-700 transition-colors p-1"
                title="Remove address"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Shipping Destination"
        subtitle="White-Glove Courier Address"
      >
        {error && <p className="text-xs text-rose-600 mb-4">{error}</p>}

        <form onSubmit={handleAddAddress} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Recipient Name"
              required
              value={formData.recipientName}
              onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
            />
            <Input
              label="Phone Number"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <Input
            label="Street Address / Residence"
            required
            placeholder="e.g. 14B Altamount Road Towers"
            value={formData.street}
            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
          />

          <Input
            label="Apartment, Suite, Unit"
            placeholder="e.g. Floor 14"
            value={formData.apartment}
            onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="City"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            <Input
              label="State"
              required
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
            <Input
              label="Postal Code"
              required
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-luxury-700 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="accent-luxury-950"
            />
            <span>Set as primary default shipping destination</span>
          </label>

          <Button type="submit" isLoading={loading} size="md" className="w-full mt-4">
            Save Destination
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default AddressesPage;
