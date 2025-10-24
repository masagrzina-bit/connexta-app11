'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Feed from '../../components/Feed/Feed'
interface UserType {
  id: string;
  email: string | null;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
}

export default function Dashboard() {
  const [user, setUser] = useState<UserType | null>(null);
  const [name, setName] = useState('');
  const [emailProfile, setEmailProfile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  // 🔹 Fetch current user
  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) console.error('Error fetching user:', error);
    if (data?.user) {
      const u = data.user;
      setUser({
        id: u.id,
        email: u.email ?? null,
        user_metadata: {
          full_name: u.user_metadata.full_name ?? '',
          avatar_url: u.user_metadata.avatar_url ?? '',
        },
      });
      setName(u.user_metadata.full_name ?? '');
      setEmailProfile(u.email ?? '');
      setAvatarUrl(u.user_metadata.avatar_url ?? '');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // 🔹 Update profile (name/email/password)
  const handleProfileUpdate = async () => {
    setLoading(true);
    const updates: any = {};

    if (name) updates.data = { full_name: name };
    if (emailProfile) updates.email = emailProfile;
    if (password) updates.password = password;

    const { error } = await supabase.auth.updateUser(updates);

    setLoading(false);
    if (error) alert('Greška pri ažuriranju profila: ' + error.message);
    else alert('Profil uspešno ažuriran!');
  };

  // 🔹 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* 🔹 User Profile Section */}
        {user ? (
          <div className="flex flex-col items-center space-y-4 mb-8">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-indigo-200 flex items-center justify-center text-2xl font-bold text-indigo-700">
                {name ? name[0].toUpperCase() : 'U'}
              </div>
            )}

            <div className="w-full">
              <label className="block text-gray-700 font-medium">Ime</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                value={emailProfile}
                onChange={(e) => setEmailProfile(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-700 font-medium">Nova lozinka</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            <button
              onClick={handleProfileUpdate}
              disabled={loading}
              className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              {loading ? 'Ažuriranje...' : 'Sačuvaj promene'}
            </button>
          </div>
        ) : (
          <p className="text-gray-500 text-center">Učitavanje profila...</p>
        )}

        {/* 🔹 Feed Section */}
        <hr className="my-6" />
        <Feed />
      </div>
    </div>
  );
}
