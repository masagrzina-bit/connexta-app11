'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { UserType } from '@/types';
import Feed from '@/components/Feed';

export default function DashboardPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [name, setName] = useState('');
  const [emailProfile, setEmailProfile] = useState('');

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    const u = data?.user;

    if (u) {
      // Mapiramo Supabase User u naš UserType
      const mappedUser: UserType = {
        email: u.email ?? null,
        user_metadata: {
          full_name: u.user_metadata.full_name ?? '',
          avatar_url: u.user_metadata.avatar_url ?? ''
        },
        created_at: u.created_at
      };

      setUser(mappedUser);
      setName(mappedUser.user_metadata.full_name);
      setEmailProfile(mappedUser.email ?? '');
    } else {
      setUser(null);
      setName('');
      setEmailProfile('');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setName('');
    setEmailProfile('');
  };

  return (
    <div className="dashboard-page">
      {user ? (
        <>
          <div className="profile">
            {user.user_metadata.avatar_url && (
              <img
                src={user.user_metadata.avatar_url}
                alt="Avatar"
                className="avatar"
              />
            )}
            <h2>{name}</h2>
            <p>{emailProfile}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <Feed userId={user?.id} />
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}
