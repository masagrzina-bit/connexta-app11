
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Input from '@/app/components/Input';
import Button from '@/app/components/Button';
import Post from '@/app/components/Post/Post';

interface PostType {
  id: string;
  user: string;
  content: string;
  created_at: string;
}

interface UserType {
  email: string | null;
  user_metadata: { full_name?: string; avatar_url?: string };
  created_at: string;
}

export default function DashboardPage() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  // Profile state
  const [name, setName] = useState('');
  const [emailProfile, setEmailProfile] = useState('');
  const [passwordProfile, setPasswordProfile] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error(error);
    else setPosts(data as PostType[]);
  };

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      const u: UserType = {
        email: data.user.email ?? null,
        user_metadata: {
          full_name: data.user.user_metadata.full_name ?? '',
          avatar_url: data.user.user_metadata.avatar_url ?? ''
        },
        created_at: data.user.created_at
      };
      setUser(u);
      setName(u.user_metadata.full_name);
      setEmailProfile(u.email ?? '');
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchUser();

    const subscription = supabase
      .channel('public:posts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => setPosts((prev) => [payload.new as PostType, ...prev])
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .insert([{ content: newPost, user: user?.user_metadata.full_name || 'You', created_at: new Date().toISOString() }])
      .select();
    setLoading(false);

    if (error) console.error(error);
    else if (data) setPosts((prev) => [data[0], ...prev]);
    setNewPost('');
  };

  const handleEdit = async (id: string, content: string) => {
    const { error } = await supabase.from('posts').update({ content }).eq('id', id);
    if (error) console.error(error);
    else setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, content } : p)));
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) console.error(error);
    else setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoadingProfile(true);
    setProfileMessage(null);
    setProfileError(null);

    try {
      // Update name and email
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        email: emailProfile,
        password: passwordProfile || undefined,
        data: { full_name: name }
      });

      if (updateError) {
        setProfileError(updateError.message);
      } else {
        setProfileMessage('Profile updated successfully!');
        if (updateData?.user) {
          setUser({
            email: updateData.user.email ?? null,
            user_metadata: {
              full_name: updateData.user.user_metadata.full_name ?? '',
              avatar_url: updateData.user.user_metadata.avatar_url ?? ''
            },
            created_at: updateData.user.created_at
          });
        }
        setPasswordProfile('');
      }
    } catch (err: any) {
      setProfileError(err.message || 'Error updating profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>

      <div className="max-w-md mx-auto mb-6">
        {user && (
          <div className="mb-4 p-4 bg-white rounded shadow flex items-center gap-4">
            {user.user_metadata.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                {user.user_metadata.full_name ? user.user_metadata.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div>
              <p className="font-semibold text-lg">{user.user_metadata.full_name || 'No Name'}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-xs text-gray-400">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        )}

        <Button variant="secondary" onClick={handleLogout} className="mb-4 w-full">
          Log Out
        </Button>

        <form className="flex gap-2" onSubmit={handleCreatePost}>
          <Input placeholder="What's on your mind?" value={newPost} onChange={(e) => setNewPost(e.target.value)} />
          <Button type="submit" disabled={loading}>
            {loading ? 'Posting...' : 'Post'}
          </Button>
        </form>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        {posts.map((post) => (
          <Post key={post.id} {...post} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>

      {/* Profile Settings */}
      <div className="mt-8 max-w-md mx-auto bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>

        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
        <Input label="Email" type="email" value={emailProfile} onChange={(e) => setEmailProfile(e.target.value)} placeholder="Enter your email" />
        <Input label="New Password" type="password" value={passwordProfile} onChange={(e) => setPasswordProfile(e.target.value)} placeholder="Enter new password" />

        <Button onClick={handleUpdateProfile} disabled={loadingProfile}>
          {loadingProfile ? 'Updating...' : 'Update Profile'}
        </Button>

        {profileMessage && <p className="text-green-500 mt-2">{profileMessage}</p>}
        {profileError && <p className="text-red-500 mt-2">{profileError}</p>}
      </div>
    </div>
  );
}
