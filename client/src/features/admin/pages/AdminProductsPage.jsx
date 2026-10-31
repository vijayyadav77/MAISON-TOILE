import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Package } from 'lucide-react';
import { adminService } from '../services/adminService.js';
import { homeService } from '../../home/services/homeService.js';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';
import Modal from '../../../components/ui/Modal.jsx';
import { formatCurrency } from '../../../utils/formatCurrency.js';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';

export const AdminProductsPage = () => {
  useDocumentTitle('Atelier Product Management');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    category: '',
    price: '',
    discountPrice: '',
    totalStock: '20',
    images: '',
    sizes: 'XS, S, M, L',
    colors: 'Noir (#000000), Ivoire (#FAF7F2)',
    isFeatured: false,
    isNewArrival: true,
    isTrending: false,
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        adminService.getProducts(),
        homeService.getCategories(),
      ]);
      setProducts(prodRes.products || []);
      setCategories(catRes.categories || []);
      if (catRes.categories?.length > 0 && !formData.category) {
        setFormData((prev) => ({ ...prev, category: catRes.categories[0]._id }));
      }
    } catch (err) {
      console.error('Failed to load products for admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      brand: 'MAISON ÉTOILE ATELIER',
      description: '',
      category: categories[0]?._id || '',
      price: '',
      discountPrice: '',
      totalStock: '25',
      images: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000',
      sizes: 'XS, S, M, L',
      colors: 'Noir (#000000), Ivoire (#FAF7F2)',
      isFeatured: false,
      isNewArrival: true,
      isTrending: false,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingId(p._id);
    setFormData({
      name: p.name,
      brand: p.brand,
      description: p.description,
      category: p.category?._id || p.category,
      price: p.price.toString(),
      discountPrice: p.discountPrice ? p.discountPrice.toString() : '',
      totalStock: p.totalStock.toString(),
      images: p.images.join(', '),
      sizes: p.sizes.join(', '),
      colors: p.colors.map((c) => `${c.name} (${c.hex})`).join(', '),
      isFeatured: p.isFeatured || false,
      isNewArrival: p.isNewArrival || false,
      isTrending: p.isTrending || false,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this runway piece permanently from catalogue?')) return;
    try {
      await adminService.deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete product.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      setFormError('');

      // Parse arrays
      const imageList = formData.images
        .split(',')
        .map((img) => img.trim())
        .filter(Boolean);

      const sizeList = formData.sizes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const colorList = formData.colors
        .split(',')
        .map((c) => {
          const match = c.match(/^(.*?)\s*\((.*?)\)$/);
          if (match) {
            return { name: match[1].trim(), hex: match[2].trim() };
          }
          return { name: c.trim(), hex: '#000000' };
        })
        .filter(Boolean);

      const payload = {
        name: formData.name,
        brand: formData.brand,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        totalStock: Number(formData.totalStock),
        images: imageList,
        sizes: sizeList,
        colors: colorList,
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        isTrending: formData.isTrending,
      };

      if (editingId) {
        await adminService.updateProduct(editingId, payload);
      } else {
        await adminService.createProduct(payload);
      }

      setIsModalOpen(false);
      loadData();
    } catch (err) {
      setFormError(err.message || 'Failed to save product.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luxury-800 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-normal text-white">
            Runway Product Inventory
          </h1>
          <p className="text-xs uppercase tracking-widest text-luxury-400 mt-1 font-medium">
            Manage Haute Couture Collections, Stocks, and Pricing
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="flex items-center gap-1.5" size="sm">
          <Plus className="w-4 h-4" />
          <span>Add Runway Piece</span>
        </Button>
      </div>

      {/* Products Table */}
      <div className="bg-luxury-900 border border-luxury-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-luxury-950 text-[10px] uppercase tracking-widest text-luxury-400 border-b border-luxury-800">
              <tr>
                <th className="py-4 px-4">Garment</th>
                <th className="py-4 px-4">Designer</th>
                <th className="py-4 px-4">Collection</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-4">Stock</th>
                <th className="py-4 px-4">Flags</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-800/60 text-luxury-200">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-luxury-850/50">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="w-10 h-14 bg-luxury-800 overflow-hidden shrink-0">
                      <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-serif text-white font-medium line-clamp-1">{p.name}</p>
                      <p className="text-[10px] text-luxury-400">{p.sizes?.join(', ')}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 uppercase text-[11px] font-medium text-luxury-300">{p.brand}</td>
                  <td className="py-3 px-4 text-luxury-400">{p.category?.name || 'Couture'}</td>
                  <td className="py-3 px-4 font-semibold text-white">
                    {formatCurrency(p.price)}
                    {p.discountPrice && (
                      <span className="block text-[10px] text-rose-400">Sale: {formatCurrency(p.discountPrice)}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-semibold ${p.totalStock <= 15 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {p.totalStock} units
                    </span>
                  </td>
                  <td className="py-3 px-4 space-x-1">
                    {p.isFeatured && <span className="px-1.5 py-0.5 bg-luxury-gold/20 text-luxury-gold text-[9px] uppercase">Featured</span>}
                    {p.isNewArrival && <span className="px-1.5 py-0.5 bg-blue-900/40 text-blue-300 text-[9px] uppercase">New</span>}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 text-luxury-400 hover:text-white"
                      title="Edit piece"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="p-1.5 text-luxury-400 hover:text-rose-400"
                      title="Delete piece"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Runway Piece' : 'Add New Runway Piece'}
        subtitle="Atelier Product Catalog"
        maxWidth="max-w-2xl"
      >
        {formError && <p className="text-xs text-rose-600 mb-4">{formError}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 text-luxury-950">
          <Input
            label="Product Name *"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. L’Éclipse Sculpted Silk Gown"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Brand / Atelier *"
              required
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            />
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-medium text-luxury-700 mb-1.5">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-luxury-200 text-sm focus:outline-none focus:border-luxury-900"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Standard Price (INR) *"
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="84000"
            />
            <Input
              label="Discounted Price (Optional)"
              type="number"
              value={formData.discountPrice}
              onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
              placeholder="72000"
            />
            <Input
              label="Stock Quantity *"
              type="number"
              required
              value={formData.totalStock}
              onChange={(e) => setFormData({ ...formData, totalStock: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-medium text-luxury-700 mb-1.5">
              Description *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-luxury-200 text-sm focus:outline-none focus:border-luxury-900"
            />
          </div>

          <Input
            label="Image URLs (Comma-separated) *"
            required
            value={formData.images}
            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Sizes (Comma-separated)"
              value={formData.sizes}
              onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
            />
            <Input
              label="Colors: Name (#HEX), Name (#HEX)"
              value={formData.colors}
              onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
            />
          </div>

          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="accent-luxury-950"
              />
              <span>Featured</span>
            </label>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNewArrival}
                onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                className="accent-luxury-950"
              />
              <span>New Arrival</span>
            </label>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isTrending}
                onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                className="accent-luxury-950"
              />
              <span>Trending</span>
            </label>
          </div>

          <Button type="submit" isLoading={formLoading} size="md" className="w-full mt-4">
            {editingId ? 'Save Changes' : 'Create Runway Piece'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProductsPage;
