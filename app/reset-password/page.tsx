'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Input from '@/app/components/Input';
import Button from '@/app/components/Button';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get('access_token') || '';
  const refreshToken = searchParams.get('refresh_token') || '';

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token || !refreshToken) {
      setError('Invalid or missing tokens');
      return;
    }

    const { error: sessionError } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: refreshToken,
    });

    if (sessionError) {
      setError(sessionError.message);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) setError(updateError.message);
    else {
      setMessage('Password updated successfully!');
      setTimeout(() => router.push('/login'), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Reset Password</h1>
      <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={handleReset}>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {message && <p className="text-green-500 mb-4">{message}</p>}
        <Input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Update Password</Button>
      </form>
    </div>
  );
}
