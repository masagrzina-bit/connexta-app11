'use client';

import { useEffect, useState } from 'react';
import Post from '../Post/Post';
import { supabase } from '@/lib/supabaseClient';

interface PostType {
  id: string;
  user: string;
  content: string;
  created_at: string;
}

export default function Feed() {
  const [posts, setPosts] = useState<PostType[]>([]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setPosts(data as PostType[]);
  };

  useEffect(() => {
    fetchPosts();

    const subscription = supabase
      .channel('public:posts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => {
          setPosts((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  const handleEdit = async (id: string, newContent: string) => {
    const { error } = await supabase
      .from('posts')
      .update({ content: newContent })
      .eq('id', id);

    if (error) console.error(error);
    else
      setPosts((prev) =>
        prev.map((post) => (post.id === id ? { ...post, content: newContent } : post))
      );
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) console.error(error);
    else setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center">Još nema postova...</p>
      ) : (
        posts.map((post) => (
          <Post
            key={post.id}
            {...post}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}
