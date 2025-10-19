'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage('❌ Pogrešan email ili lozinka.');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100">
      {/* Left side - logo and tagline */}
      <div className="text-center md:text-left md:w-1/2 p-6">
        <h1 className="text-blue-600 text-5xl font-bold">Connexta</h1>
        <p className="text-lg mt-3">
          Poveži se sa svetom i deli trenutke sa prijateljima.
        </p>
      </div>

      {/* Right side - login form */}
      <div className="bg-white p-6 rounded-xl shadow-md w-80">
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email adresa"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Lozinka"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          >
            Prijavi se
          </button>
        </form>

        {message && <p className="text-center text-red-500 mt-2">{message}</p>}

        <p className="text-center mt-3">
          <a href="/reset-password" className="text-blue-600 hover:underline">
            Zaboravljena lozinka?
          </a>
        </p>

        <hr className="my-4" />

        <button
          onClick={() => router.push('/register')}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded w-full"
        >
          Napravi novi nalog
        </button>
      </div>
    </div>
  );
}
