'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/update-password`,
      },
    });

    if (error) setMessage(`❌ ${error.message}`);
    else setMessage('✅ Proveri svoj email da potvrdiš nalog.');
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
          <h2 className="text-2xl font-bold mb-6 text-center">Napravi novi nalog</h2>
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Ime i prezime"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="email"
              placeholder="Email adresa"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="password"
              placeholder="Nova lozinka"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <button className="bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700 transition">
              Registruj se
            </button>
          </form>

          {message && <p className="text-center text-gray-700 mt-3">{message}</p>}

          <p className="text-center mt-4">
            Već imaš nalog?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Prijavi se
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
