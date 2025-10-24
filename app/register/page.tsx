'use client';

import React, { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('female');
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://connexta.app';

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const fullName = `${firstName} ${lastName}`.trim();

    const { data, error } = await supabase.auth.signUp({
      email: identifier,
      password,
      options: {
        data: {
          full_name: fullName,
          birthday,
          gender,
        },
        emailRedirectTo: `${siteUrl}/update-password`, // user clicks link -> comes to update-password
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // Supabase will send confirmation email. Show a message and redirect to login
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-4">Create a new account</h2>

        <form onSubmit={handleRegister} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              required
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <input
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Birthday"
            />
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full border rounded px-3 py-2">
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <input
            required
            placeholder="Mobile number or email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          <input
            required
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          <button disabled={loading} type="submit" className="w-full bg-green-600 text-white py-2 rounded">
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
