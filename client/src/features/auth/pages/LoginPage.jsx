import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { loginUser, clearAuthError } from '../authSlice.js';
import { syncGuestCartToBackend, fetchCart } from '../../cart/cartSlice.js';
import { fetchWishlist } from '../../wishlist/wishlistSlice.js';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';

export const LoginPage = () => {
  useDocumentTitle('Client Atelier Sign In');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    dispatch(clearAuthError());
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      await dispatch(syncGuestCartToBackend());
      await dispatch(fetchCart());
      await dispatch(fetchWishlist());
      navigate(redirect);
    }
  };

  const handleDemoFill = (email, password) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-widest text-luxury-500 font-semibold">
          Private Client Access
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-luxury-950 font-normal">
          Sign In to Your Atelier
        </h2>
        <p className="text-xs text-luxury-600 font-sans">
          Access your saved runway pieces, white-glove orders, and personalized couture fittings.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 font-sans">
          {error}
        </div>
      )}

      {/* Quick Demo Credentials Selector for Portfolio Reviewers */}
      <div className="p-3.5 bg-luxury-100 border border-luxury-200 text-xs space-y-2">
        <p className="text-[10px] uppercase tracking-wider font-semibold text-luxury-700">
          Portfolio Demo Credentials:
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleDemoFill('audrey@maisonetoile.com', 'Customer@123456')}
            className="px-2.5 py-1 text-[11px] bg-white border border-luxury-300 hover:border-luxury-900 text-luxury-900 font-medium"
          >
            👤 Demo Customer (Audrey)
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill('admin@maisonetoile.com', 'Admin@123456')}
            className="px-2.5 py-1 text-[11px] bg-white border border-luxury-300 hover:border-luxury-900 text-luxury-900 font-medium"
          >
            👑 Demo Admin (Atelier Staff)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="your.email@domain.com"
          required
          error={errors.email?.message}
          {...register('email', {
            required: 'Email address is required',
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: 'Please enter a valid email address',
            },
          })}
        />

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
          <div className="flex justify-end mt-1">
            <Link
              to="/forgot-password"
              className="text-[11px] text-luxury-500 hover:text-luxury-950 underline tracking-wide"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button type="submit" isLoading={loading} size="lg" className="w-full">
          Sign In
        </Button>
      </form>

      <div className="pt-4 border-t border-luxury-200 text-center text-xs text-luxury-600 font-sans">
        New to Maison Étoile?{' '}
        <Link
          to={`/signup${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
          className="text-luxury-950 font-semibold underline hover:text-luxury-700"
        >
          Create an Atelier Account
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
