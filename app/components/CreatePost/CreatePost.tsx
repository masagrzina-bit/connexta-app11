'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function CreatePost() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!content) return;

    setLoading(true);
    const { data, error } = await supabase.from('posts').insert([
      {
        user: (await supabase.auth.getUser()).data.user?.user_metadata.full_name || 'Anonymous',
        content,
      },
    ]);

    if (error) console.error(error);
    else setContent('');

    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4">
      <textarea
        className="w-full border rounded p-2 mb-2"
        rows={3}
        placeholder="Šta ti je na umu?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={handlePost}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Objavljujem...' : 'Objavi'}
      </button>
    </div>
  );
}
