'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleHash = async () => {
      const hash = window.location.hash;

      if (!hash || !hash.includes('access_token')) {
        setMessage('❌ Nevažeći link za reset lozinke.');
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(hash);

      if (error) setMessage('❌ Link istekao ili nije validan.');
      else setReady(true);
    };

    const timeout = setTimeout(handleHash, 300);
    return () => clearTimeout(timeout);
  }, []);

  const handleUpdate = async () => {
    if (!ready) return setMessage('❌ Sesija nije dostupna.');

    const { error } = await supabase.auth.updateUser({ password });

    if (error) setMessage(`❌ ${error.message}`);
    else {
      setMessage('✅ Lozinka promenjena! Preusmeravanje na login...');
      setTimeout(() => router.push('/login'), 2000);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 justify-center items-center p-4">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center mb-4">Promeni lozinku</h2>
        <input
          type="password"
          placeholder="Nova lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button
          onClick={handleUpdate}
          disabled={!ready}
          className={`py-3 rounded font-semibold text-white transition ${
            ready ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Promeni lozinku
        </button>
        {message && <p className="text-center mt-3 text-gray-700">{message}</p>}
      </div>
    </div>
  );
}
