'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) setMessage(`❌ ${error.message}`);
    else setMessage('✅ Proveri email da resetuješ lozinku.');
  };

  return (
    <div className="flex min-h-screen bg-gray-100 justify-center items-center p-4">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Resetuj lozinku</h2>
        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email adresa"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <button className="bg-yellow-500 text-white py-3 rounded font-semibold hover:bg-yellow-600 transition">
            Pošalji link
          </button>
        </form>

        {message && <p className="text-center mt-3 text-gray-700">{message}</p>}

        <p className="text-center mt-4">
          <a href="/login" className="text-blue-600 hover:underline">
            Vrati se na prijavu
          </a>
        </p>
      </div>
    </div>
  );
}

