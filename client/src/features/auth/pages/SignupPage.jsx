import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { registerUser, clearAuthError } from '../authSlice.js';
import { syncGuestCartToBackend, fetchCart } from '../../cart/cartSlice.js';
import { fetchWishlist } from '../../wishlist/wishlistSlice.js';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';

export const SignupPage = () => {
  useDocumentTitle('Create Atelier Account');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    dispatch(clearAuthError());
    const result = await dispatch(
      registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      })
    );
    if (registerUser.fulfilled.match(result)) {
      await dispatch(syncGuestCartToBackend());
      await dispatch(fetchCart());
      await dispatch(fetchWishlist());
      navigate(redirect);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-widest text-luxury-500 font-semibold">
          Exclusive Membership
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-luxury-950 font-normal">
          Create Your Atelier Account
        </h2>
        <p className="text-xs text-luxury-600 font-sans">
          Register to unlock private runway previews, order tracking, and complimentary bespoke concierge services.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 font-sans">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Legal Name"
          type="text"
          placeholder="Audrey Sinclair"
          required
          error={errors.name?.message}
          {...register('name', { required: 'Please provide your full name' })}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="audrey@example.com"
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

        <Input
          label="Create Password"
          type="password"
          placeholder="Minimum 6 characters"
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

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          required
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
        />

        <div className="text-[11px] text-luxury-500 leading-relaxed font-sans">
          By registering, you agree to the Maison Étoile Terms of Service and acknowledge our Luxury Privacy Protocols.
        </div>

        <Button type="submit" isLoading={loading} size="lg" className="w-full">
          Complete Registration
        </Button>
      </form>

      <div className="pt-4 border-t border-luxury-200 text-center text-xs text-luxury-600 font-sans">
        Already a registered client?{' '}
        <Link
          to={`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
          className="text-luxury-950 font-semibold underline hover:text-luxury-700"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignupPage;
