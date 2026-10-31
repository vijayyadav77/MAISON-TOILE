import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService.js';
import { formatDate } from '../../../utils/formatDate.js';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';

export const AdminUsersPage = () => {
  useDocumentTitle('Atelier Clientele Directory');

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await adminService.getUsers();
        setUsers(res.users || []);
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="border-b border-luxury-800 pb-6">
        <h1 className="font-serif text-3xl font-normal text-white">
          Clientele & Atelier Accounts
        </h1>
        <p className="text-xs uppercase tracking-widest text-luxury-400 mt-1 font-medium">
          Verified Registered Collectors & Atelier Staff
        </p>
      </div>

      <div className="bg-luxury-900 border border-luxury-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-luxury-950 text-[10px] uppercase tracking-widest text-luxury-400 border-b border-luxury-800">
              <tr>
                <th className="py-4 px-4">Client</th>
                <th className="py-4 px-4">Email</th>
                <th className="py-4 px-4">Phone</th>
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-4">Addresses</th>
                <th className="py-4 px-4 text-right">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-800/60 text-luxury-200">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-luxury-850/50">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover border border-luxury-700"
                    />
                    <span className="font-serif text-white font-medium">{u.name}</span>
                  </td>
                  <td className="py-3 px-4 text-luxury-300">{u.email}</td>
                  <td className="py-3 px-4 text-luxury-400">{u.phone || '—'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest border ${
                      u.role === 'admin'
                        ? 'bg-luxury-gold/20 text-luxury-gold border-luxury-gold/40'
                        : 'bg-luxury-800 text-luxury-300 border-luxury-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-luxury-400">{u.addresses?.length || 0} saved</td>
                  <td className="py-3 px-4 text-right text-luxury-400">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
