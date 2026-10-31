import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce.js';
import apiClient from '../../services/apiClient.js';
import { API_ENDPOINTS } from '../../services/apiEndpoints.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

export const SearchOverlay = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchTerm('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setResults([]);
      return;
    }

    const fetchSearch = async () => {
      setLoading(true);
      try {
        const data = await apiClient.get(API_ENDPOINTS.PRODUCTS.LIST, {
          params: { search: debouncedSearch, limit: 6 },
        });
        setResults(data.products || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [debouncedSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onClose();
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSelectProduct = (product) => {
    onClose();
    navigate(`/product/${product.slug || product._id}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col justify-start">
      <div className="w-full bg-luxury-50 border-b border-luxury-200 px-6 py-8 shadow-2xl">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between pb-6 border-b border-luxury-300">
            <span className="font-serif text-lg tracking-widest text-luxury-900 uppercase">
              Curated Runway Search
            </span>
            <button
              onClick={onClose}
              className="p-2 text-luxury-600 hover:text-luxury-950 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 relative">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-luxury-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search silk gowns, cashmere coats, leather totes, designer heels..."
              className="w-full pl-10 pr-24 py-4 text-xl md:text-2xl font-serif bg-transparent border-b-2 border-luxury-300 focus:border-luxury-950 focus:outline-none placeholder:text-luxury-300 placeholder:italic"
            />
            <button
              type="submit"
              className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs tracking-widest uppercase font-semibold text-luxury-900 hover:text-luxury-600"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Search Results Preview */}
          {loading && (
            <p className="mt-8 text-xs tracking-widest uppercase text-luxury-500 animate-pulse">
              Searching ateliers...
            </p>
          )}

          {!loading && results.length > 0 && (
            <div className="mt-8">
              <p className="text-[11px] tracking-widest uppercase text-luxury-500 mb-4">
                Curated Suggestions ({results.length})
              </p>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {results.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleSelectProduct(product)}
                    className="group cursor-pointer space-y-2"
                  >
                    <div className="aspect-[3/4] bg-luxury-100 overflow-hidden relative">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] tracking-widest uppercase text-luxury-500 truncate">
                        {product.brand}
                      </p>
                      <p className="text-xs font-serif text-luxury-900 truncate group-hover:underline">
                        {product.name}
                      </p>
                      <p className="text-xs font-medium text-luxury-950">
                        {formatCurrency(product.discountPrice || product.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && searchTerm && results.length === 0 && (
            <div className="mt-8 text-center py-6">
              <p className="text-sm font-serif text-luxury-600">
                No couture pieces match "{searchTerm}". Try browsing by category or designer brand.
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1" onClick={onClose} />
    </div>
  );
};

export default SearchOverlay;
