import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../../services/apiClient.js';
import { API_ENDPOINTS } from '../../../services/apiEndpoints.js';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle.js';

export const ForgotPasswordPage = () => {
  useDocumentTitle('Reset Password');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      setError('');
      const data = await apiClient.post('/auth/forgot-password', { email });
      setMessage(data.message || 'If an account exists, a reset link has been dispatched.');
    } catch (err) {
      setError(err.message || 'Error requesting reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-widest text-luxury-500 font-semibold">
          Security Assistance
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-luxury-950 font-normal">
          Reset Your Password
        </h2>
        <p className="text-xs text-luxury-600 font-sans">
          Enter your registered email address and our concierge system will dispatch instructions to securely restore your access.
        </p>
      </div>

      {error && <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700">{error}</div>}
      {message && <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Registered Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="audrey@example.com"
        />

        <Button type="submit" isLoading={loading} size="lg" className="w-full">
          Send Recovery Instructions
        </Button>
      </form>

      <div className="pt-4 border-t border-luxury-200 text-center text-xs text-luxury-600 font-sans">
        Remembered your credentials?{' '}
        <Link to="/login" className="text-luxury-950 font-semibold underline hover:text-luxury-700">
          Return to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
