'use client';

import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login');
        return;
      }
      setUser(data.user);
      setLoading(false);
    });
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Welcome, {user?.user_metadata?.full_name || user?.email}</h1>
          <button onClick={handleLogout} className="text-red-500">Log out</button>
        </div>

        <section className="mt-6">
          <h2 className="font-semibold">Account info</h2>
          <pre className="mt-2 text-sm bg-gray-100 p-3 rounded">
            {JSON.stringify(user, null, 2)}
          </pre>
        </section>
      </div>
    </div>
  );
}
