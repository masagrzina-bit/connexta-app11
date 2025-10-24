'use client';

import React from 'react';
import Button from '@/app/components/Button';

interface PostProps {
  id: string;
  user: string;
  content: string;
  created_at: string;
  onEdit?: (id: string, newContent: string) => void;
  onDelete?: (id: string) => void;
}

const Post: React.FC<PostProps> = ({ id, user, content, created_at, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (onDelete) onDelete(id);
  };

  return (
    <div className="bg-white p-4 rounded shadow-md w-full max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">{user}</h2>
        <span className="text-xs text-gray-500">{new Date(created_at).toLocaleString()}</span>
      </div>
      <p className="mb-4">{content}</p>
      <div className="flex gap-2">
        {onEdit && <Button variant="secondary" onClick={() => onEdit(id, prompt('Edit post:', content) || content)}>Edit</Button>}
        {onDelete && <Button variant="secondary" onClick={handleDelete}>Delete</Button>}
      </div>
    </div>
  );
};

export default Post;
