import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { User, Package, MapPin, Check, ShieldCheck } from 'lucide-react';
import { authService } from '../../auth/services/authService.js';
import { updateUserProfileData } from '../../auth/authSlice.js';
import Breadcrumb from '../../../components/common/Breadcrumb.jsx';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';
import { formatDate } from '../../../utils/formatDate.js';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';

export const ProfilePage = () => {
  useDocumentTitle('My Atelier Profile');
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const res = await authService.updateProfile({ name, phone });
      dispatch(updateUserProfileData({ name, phone }));
      setSuccess('Your atelier profile has been updated.');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'My Account' }, { label: 'Atelier Profile' }]} />

      <div className="pt-2 pb-8 border-b border-luxury-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-luxury-950 font-normal">
            Atelier Profile & Privileges
          </h1>
          <p className="text-xs uppercase tracking-widest text-luxury-500 mt-1 font-medium">
            Maison Étoile Registered Client #{user?.id?.slice(-6) || 'VIP'}
          </p>
        </div>

        {/* Quick Nav Links */}
        <div className="flex gap-3">
          <Link to="/account/orders">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" />
              <span>Orders ({user?.ordersCount || 'History'})</span>
            </Button>
          </Link>
          <Link to="/account/addresses">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Address Book</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* User Card */}
        <div className="lg:col-span-4">
          <div className="p-6 bg-white border border-luxury-200 shadow-sm text-center space-y-4">
            <div className="relative inline-block">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                alt={user?.name}
                className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-luxury-900"
              />
              <span className="absolute bottom-0 right-0 p-1 bg-luxury-950 text-luxury-gold rounded-full">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-xl font-medium text-luxury-950">{user?.name}</h3>
              <p className="text-xs text-luxury-500 font-sans">{user?.email}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 text-[9px] uppercase tracking-widest bg-luxury-950 text-luxury-gold font-semibold">
                {user?.role === 'admin' ? 'Atelier Administrator' : 'VIP Clientele Member'}
              </span>
            </div>

            <div className="pt-4 border-t border-luxury-100 text-left text-xs font-sans space-y-2 text-luxury-600">
              <p>Registered Address: <strong>{user?.addresses?.length || 0} saved locations</strong></p>
              <p>Member Since: <strong>{formatDate(user?.createdAt || new Date())}</strong></p>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <div className="lg:col-span-8">
          <div className="p-6 bg-white border border-luxury-200 shadow-sm space-y-6">
            <h3 className="font-serif text-xl text-luxury-950 font-normal border-b border-luxury-200 pb-3">
              Personal Credentials
            </h3>

            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{success}</span>
              </div>
            )}

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
              <Input
                label="Full Legal Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Email Address (Permanent)"
                value={user?.email || ''}
                disabled
                className="bg-luxury-100/70 cursor-not-allowed opacity-80"
              />

              <Input
                label="Mobile Phone (for courier and concierge dispatch)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98200 11223"
              />

              <Button type="submit" isLoading={loading} size="md">
                Update Profile Credentials
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
