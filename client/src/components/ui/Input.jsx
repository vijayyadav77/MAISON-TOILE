import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  id,
  required = false,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[11px] uppercase tracking-wider font-medium text-luxury-700"
        >
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        required={required}
        className={`w-full px-4 py-3 bg-white border text-sm text-luxury-900 placeholder:text-luxury-400 focus:outline-none transition-colors duration-200 ${
          error
            ? 'border-rose-500 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
            : 'border-luxury-200 focus:border-luxury-900'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-[11px] text-rose-600 mt-1">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
