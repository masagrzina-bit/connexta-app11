'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Post from '../components/Post/Post';
import { useRouter } from 'next/navigation';

interface PostType {
  id: string;
  user: string;
  content: string;
  created_at: string;
}

export default function ProfilePage() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [userFullName, setUserFullName] = useState<string | null>(null);
  const router = useRouter();

  const fetchUserPosts = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const fullName = userData.user?.user_metadata.full_name;
    if (!fullName) {
      router.push('/login');
      return;
    }
    setUserFullName(fullName);

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user', fullName)
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setPosts(data as PostType[]);
  };

  const handleEdit = async (id: string, newContent: string) => {
    const { error } = await supabase
      .from('posts')
      .update({ content: newContent })
      .eq('id', id);

    if (error) console.error(error);
    else setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, content: newContent } : post))
    );
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) console.error(error);
    else setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  useEffect(() => {
    fetchUserPosts();

    // Real-time subscription za nove postove korisnika
    const subscription = supabase
      .channel('public:posts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => {
          if (payload.new.user === userFullName) {
            setPosts((prev) => [payload.new, ...prev]);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, [userFullName]);

  if (!userFullName) return <p className="text-center mt-20">Učitavanje...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-3xl font-semibold mb-6 text-center">{userFullName}'s Profile</h1>

      {posts.length === 0 && (
        <p className="text-gray-500 text-center">Još nema tvojih postova...</p>
      )}

      {posts.map((post) => (
        <Post
          key={post.id}
          {...post}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
