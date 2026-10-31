import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 py-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 border border-luxury-300 text-luxury-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-luxury-900 hover:text-white transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 text-xs font-medium tracking-wider transition-colors ${
            currentPage === page
              ? 'bg-luxury-950 text-luxury-50 border border-luxury-950'
              : 'border border-luxury-200 text-luxury-800 hover:bg-luxury-100'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 border border-luxury-300 text-luxury-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-luxury-900 hover:text-white transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
