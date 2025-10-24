'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Input from '@/app/components/Input';
import Button from '@/app/components/Button';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    setLoading(false);

    if (error) setError(error.message);
    else router.push('/dashboard');
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://connexta.app/dashboard',
      },
    });
    if (error) setError(error.message);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-6">Connexta</h1>
      <form
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
        onSubmit={handleRegister}
      >
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </Button>

        <Button
          variant="secondary"
          onClick={handleGoogleLogin}
          className="mt-3 bg-blue-500 hover:bg-blue-600 text-white"
        >
          Continue with Google
        </Button>

        <p className="mt-4 text-sm text-center">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Log In
          </a>
        </p>
      </form>
    </div>
  );
}

    

