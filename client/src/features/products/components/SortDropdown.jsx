import React from 'react';
import { ChevronDown } from 'lucide-react';

export const SortDropdown = ({ value, onChange }) => {
  const options = [
    { label: 'Featured & Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-low' },
    { label: 'Price: High to Low', value: 'price-high' },
    { label: 'Most Popular', value: 'popular' },
    { label: 'Top Customer Rated', value: 'rating' },
  ];

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center gap-2">
        <span className="text-[11px] uppercase tracking-widest text-luxury-500 font-medium hidden sm:inline">
          Sort By:
        </span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-white border border-luxury-300 px-4 py-2 pr-8 text-xs uppercase tracking-wider font-medium text-luxury-900 focus:outline-none focus:border-luxury-900 cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-luxury-500 absolute right-3 pointer-events-none" />
      </div>
    </div>
  );
};

export default SortDropdown;
