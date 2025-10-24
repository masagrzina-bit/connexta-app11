'use client';

import React, { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ForgotPasswordPage() {
  const supabase = createClientComponentClient();
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://connexta.app';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(identifier, {
      redirectTo: `${siteUrl}/update-password`,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage('Please check your email for a message with your code / reset link. The code is 6 numbers long.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-2">Find your account</h2>
        <p className="text-sm text-gray-600 mb-4">
          Please enter your email to search for your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email address"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            {loading ? 'Sending...' : 'Search'}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
}
