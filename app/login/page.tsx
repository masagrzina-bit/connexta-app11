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

    if (error) setMessage('❌ Pogrešan email ili lozinka.');
    else router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left side */}
      <div className="hidden md:flex w-1/2 bg-blue-600 text-white flex-col justify-center items-center p-10">
        <h1 className="text-6xl font-bold mb-6">Connexta</h1>
        <p className="text-xl">
          Poveži se sa svetom i deli trenutke sa prijateljima.
        </p>
      </div>

      {/* Right side */}
      <div className="flex w-full md:w-1/2 justify-center items-center p-8">
        <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Prijavi se</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email adresa"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Lozinka"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button className="bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition">
              Prijavi se
            </button>
          </form>

          {message && <p className="text-center text-red-500 mt-3">{message}</p>}

          <div className="flex justify-between mt-4">
            <a href="/reset-password" className="text-blue-600 hover:underline">
              Zaboravljena lozinka?
            </a>
            <a href="/register" className="text-green-600 hover:underline">
              Napravi nalog
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
