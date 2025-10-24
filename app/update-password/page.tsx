'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Input from '@/app/components/Input';
import Button from '@/app/components/Button';
import { useSearchParams, useRouter } from 'next/navigation';

export default function UpdatePasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const accessToken = searchParams.get('access_token') || '';
  const refreshToken = searchParams.get('refresh_token') || '';

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!accessToken || !refreshToken) {
      setError('Invalid or missing access/refresh token.');
      setLoading(false);
      return;
    }

    // Postavi sesiju sa tokenom
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (sessionError) {
      setError(sessionError.message);
      setLoading(false);
      return;
    }

    // Update lozinke
    const { error: updateError } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (updateError) setError(updateError.message);
    else {
      setMessage('Password updated successfully!');
      setTimeout(() => router.push('/login'), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Update Password</h1>
      <form
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
        onSubmit={handleUpdatePassword}
      >
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {message && <p className="text-green-500 mb-4">{message}</p>}
        <Input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
      </form>
    </div>
  );
}
