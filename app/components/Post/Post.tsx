'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface PostProps {
  id: string;
  user: string;
  content: string;
  created_at: string;
  currentUser?: string; // ime trenutno ulogovanog korisnika
  onDelete?: (id: string) => void; // opcionalna funkcija za obrisati post iz feed-a
  onEdit?: (id: string, newContent: string) => void; // opcionalna funkcija za izmenu posta
}

export default function Post({
  id,
  user,
  content,
  created_at,
  currentUser,
  onDelete,
  onEdit,
}: PostProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleDelete = async () => {
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) console.error(error);
    else onDelete && onDelete(id);
  };

  const handleSave = async () => {
    const { error } = await supabase.from('posts').update({ content: editedContent }).eq('id', id);
    if (error) console.error(error);
    else {
      setIsEditing(false);
      onEdit && onEdit(id, editedContent);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">{user}</h3>
        <span className="text-gray-400 text-sm">{new Date(created_at).toLocaleString()}</span>
      </div>

      {isEditing ? (
        <textarea
          className="w-full border rounded p-2 mb-2"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
        />
      ) : (
        <p>{content}</p>
      )}

      {currentUser === user && (
        <div className="flex gap-2 mt-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
              >
                Sačuvaj
              </button>
              <button
                onClick={() => { setIsEditing(false); setEditedContent(content); }}
                className="bg-gray-400 hover:bg-gray-500 text-white py-1 px-3 rounded"
              >
                Otkaži
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
              >
                Izmeni
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
              >
                Obriši
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
