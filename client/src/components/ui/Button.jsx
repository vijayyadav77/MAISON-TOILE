import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-sans tracking-editorial uppercase text-xs transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:
      'bg-luxury-950 text-luxury-50 hover:bg-luxury-800 active:scale-[0.99] shadow-sm',
    secondary:
      'bg-luxury-100 text-luxury-900 hover:bg-luxury-200 active:scale-[0.99]',
    outline:
      'border border-luxury-900 text-luxury-900 bg-transparent hover:bg-luxury-900 hover:text-luxury-50',
    gold:
      'bg-luxury-gold text-luxury-950 hover:bg-luxury-goldHover font-medium shadow-sm',
    white:
      'bg-white text-luxury-950 hover:bg-luxury-50 shadow-md',
    ghost:
      'bg-transparent text-luxury-900 hover:bg-luxury-100',
    danger:
      'bg-rose-700 text-white hover:bg-rose-800',
  };

  const sizes = {
    sm: 'py-2 px-4 text-[10px]',
    md: 'py-3.5 px-6 text-xs',
    lg: 'py-4 px-8 text-xs font-medium tracking-widest',
    xl: 'py-5 px-10 text-sm tracking-widest font-medium',
    icon: 'p-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
