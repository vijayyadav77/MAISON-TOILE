import React from 'react';
import { X, Check } from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';
import { formatCurrency } from '../../../utils/formatCurrency.js';

export const FilterDrawer = ({
  isOpen,
  onClose,
  facets = {},
  selectedCategory,
  onSelectCategory,
  selectedBrands = [],
  onToggleBrand,
  selectedSizes = [],
  onToggleSize,
  selectedColors = [],
  onToggleColor,
  priceRange = { min: 0, max: 150000 },
  onPriceChange,
  onResetFilters,
  totalResults = 0,
}) => {
  const content = (
    <div className="space-y-8">
      {/* Categories */}
      {facets.categories && facets.categories.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-widest font-semibold text-luxury-950">
            Collections
          </h4>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => onSelectCategory('')}
              className={`block w-full text-left text-xs uppercase tracking-wider py-1 transition-colors ${
                !selectedCategory
                  ? 'text-luxury-950 font-bold'
                  : 'text-luxury-600 hover:text-luxury-950'
              }`}
            >
              All Collections
            </button>
            {facets.categories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                className={`block w-full text-left text-xs uppercase tracking-wider py-1 transition-colors ${
                  selectedCategory === cat.slug
                    ? 'text-luxury-950 font-bold border-l-2 border-luxury-900 pl-2'
                    : 'text-luxury-600 hover:text-luxury-950'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Brands */}
      {facets.brands && facets.brands.length > 0 && (
        <div className="space-y-3 border-t border-luxury-200 pt-6">
          <h4 className="text-xs uppercase tracking-widest font-semibold text-luxury-950">
            Designers & Brands
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {facets.brands.map((brand) => {
              const isChecked = selectedBrands.includes(brand);
              return (
                <label
                  key={brand}
                  className="flex items-center gap-2.5 text-xs text-luxury-700 hover:text-luxury-950 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleBrand(brand)}
                    className="w-4 h-4 rounded-none border-luxury-300 text-luxury-950 focus:ring-0 cursor-pointer"
                  />
                  <span className="uppercase tracking-wider text-[11px] font-medium">
                    {brand}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Sizes */}
      {facets.sizes && facets.sizes.length > 0 && (
        <div className="space-y-3 border-t border-luxury-200 pt-6">
          <h4 className="text-xs uppercase tracking-widest font-semibold text-luxury-950">
            Size
          </h4>
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((s) => {
              const isSelected = selectedSizes.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onToggleSize(s)}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium border transition-colors ${
                    isSelected
                      ? 'border-luxury-950 bg-luxury-950 text-white'
                      : 'border-luxury-200 bg-white text-luxury-700 hover:border-luxury-800'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Colors */}
      {facets.colors && facets.colors.length > 0 && (
        <div className="space-y-3 border-t border-luxury-200 pt-6">
          <h4 className="text-xs uppercase tracking-widest font-semibold text-luxury-950">
            Color Palette
          </h4>
          <div className="flex flex-wrap gap-2">
            {facets.colors.map((c) => {
              const isSelected = selectedColors.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => onToggleColor(c)}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium border transition-colors ${
                    isSelected
                      ? 'border-luxury-950 bg-luxury-950 text-white'
                      : 'border-luxury-200 bg-white text-luxury-700 hover:border-luxury-800'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-3 border-t border-luxury-200 pt-6">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase tracking-widest font-semibold text-luxury-950">
            Maximum Price
          </h4>
          <span className="text-xs font-semibold text-luxury-950">
            {formatCurrency(priceRange.max)}
          </span>
        </div>
        <input
          type="range"
          min="10000"
          max="200000"
          step="5000"
          value={priceRange.max}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full accent-luxury-950 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-luxury-500 uppercase tracking-widest">
          <span>₹10,000</span>
          <span>₹200,000+</span>
        </div>
      </div>

      {/* Reset Button */}
      <div className="border-t border-luxury-200 pt-6">
        <Button
          variant="outline"
          onClick={onResetFilters}
          className="w-full text-xs"
        >
          Reset All Filters
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter Column */}
      <div className="hidden lg:block w-64 shrink-0 pr-8">
        {content}
      </div>

      {/* Mobile Filter Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white shadow-2xl flex flex-col">
              <div className="px-6 py-5 border-b border-luxury-200 flex items-center justify-between bg-luxury-50">
                <h3 className="font-serif text-lg tracking-wider text-luxury-950 font-semibold uppercase">
                  Filters
                </h3>
                <button
                  onClick={onClose}
                  className="p-1.5 text-luxury-500 hover:text-luxury-950"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {content}
              </div>
              <div className="p-4 border-t border-luxury-200 bg-luxury-50">
                <Button onClick={onClose} className="w-full">
                  Show {totalResults} Pieces
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterDrawer;
