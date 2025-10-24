'use client';

import React, { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [identifier, setIdentifier] = useState(''); // email or phone
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://connexta.app';

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: identifier,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // Redirect to dashboard
    router.push('/dashboard');
  };

  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${siteUrl}/auth/callback` }, // can keep app-level callback if you handle it
    });
    if (error) setErrorMsg(error.message);
    setLoading(false);
  };

  const handleGithub = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${siteUrl}/auth/callback` },
    });
    if (error) setErrorMsg(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Branding */}
        <div className="hidden md:flex flex-col justify-center pl-8">
          <h1 className="text-5xl font-extrabold text-blue-600 mb-4">Connexta</h1>
          <p className="text-gray-700">
            Connect with friends and the world around you.
          </p>
        </div>

        {/* Right: Card */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4">Log Into Connexta</h2>

          <form onSubmit={handleEmailLogin} className="space-y-3">
            <input
              type="text"
              placeholder="Email or phone number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  className="form-checkbox"
                />
                Remember me
              </label>

              <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="my-4 flex items-center gap-2">
            <hr className="flex-1" />
            <span className="text-sm text-gray-400">or</span>
            <hr className="flex-1" />
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGoogle}
              className="w-full border rounded py-2 flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <img src="/images/google.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>

            <button
              onClick={handleGithub}
              className="w-full border rounded py-2 flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <img src="/images/github.svg" alt="GitHub" className="w-5 h-5" />
              Continue with GitHub
            </button>
          </div>

          <div className="mt-6 text-center text-sm">
            <p>
              Don't have an account?{' '}
              <a href="/register" className="text-blue-600 hover:underline">
                Create new account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
