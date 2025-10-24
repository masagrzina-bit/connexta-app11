'use client';

import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function UpdatePasswordPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'ready' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Parse access_token and refresh_token from the URL hash (if present)
    if (typeof window === 'undefined') return;

    const hash = window.location.hash; // like #access_token=...&refresh_token=...&...
    if (!hash) {
      setStatus('error');
      setMessage('No reset token found in URL. Make sure you opened the link from the email in the same browser.');
      return;
    }

    const params = new URLSearchParams(hash.replace(/^#/, ''));
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (access_token && refresh_token) {
      (async () => {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        } as any);
        if (error) {
          setStatus('error');
          setMessage(error.message);
          return;
        }
        setStatus('ready');
      })();
    } else {
      setStatus('error');
      setMessage('Reset token not present in URL. Use the link from the email in the same browser.');
    }
  }, [supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage(error.message);
      return;
    }
    setStatus('done');
    setMessage('Password updated. Redirecting to dashboard...');
    setTimeout(() => router.push('/dashboard'), 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-2">Enter a new password</h2>

        {status === 'error' && <p className="text-sm text-red-500 mb-3">{message}</p>}

        {status === 'ready' && (
          <form onSubmit={handleSave} className="space-y-3">
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
            {message && <p className="text-sm text-red-500">{message}</p>}
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
              Save password
            </button>
          </form>
        )}

        {status === 'idle' && <p className="text-sm text-gray-600">Checking reset link...</p>}
        {status === 'done' && <p className="text-sm text-green-600">{message}</p>}
      </div>
    </div>
  );
}
