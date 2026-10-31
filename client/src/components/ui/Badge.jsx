import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  const variants = {
    neutral: 'bg-luxury-900 text-luxury-50',
    sale: 'bg-rose-700 text-white',
    gold: 'bg-luxury-gold text-luxury-950 font-medium',
    outline: 'border border-luxury-900 text-luxury-900 bg-transparent',
    success: 'bg-emerald-100 text-emerald-900 border border-emerald-200',
    warning: 'bg-amber-100 text-amber-900 border border-amber-200',
  };

  return (
    <span
      className={`inline-block px-2.5 py-1 text-[10px] uppercase font-sans tracking-widest font-medium ${
        variants[variant] || variants.neutral
      } ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
