'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Input from '@/app/components/Input';
import Button from '@/app/components/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://connexta.app/reset-password',
    });
    setLoading(false);

    if (error) setError(error.message);
    else setMessage('Check your email for the reset link!');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Forgot Password</h1>
      <form
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
        onSubmit={handleSendReset}
      >
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {message && <p className="text-green-500 mb-4">{message}</p>}

        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Email'}
        </Button>
      </form>
    </div>
  );
}

