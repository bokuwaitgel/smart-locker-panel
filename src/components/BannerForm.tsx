'use client';

import { useState } from 'react';
import api from '@/lib/api';

interface Props {
  onSaved?: () => void;
}

export default function BannerForm({ onSaved }: Props) {
  const [type, setType] = useState<'image' | 'video'>('image');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      await api.post('/banner', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onSaved && onSaved();
      setFile(null);
      setType('image');
    } catch (err) {
      setError('Failed to save banner');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 bg-white p-4 rounded shadow">
      {error && <div className="text-black">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-black">Banner Type</label>
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value as 'image' | 'video')} 
          className="mt-1 block w-full border rounded px-2 py-1"
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-black">
          {type === 'image' ? 'Image File' : 'Video File'}
        </label>
        <input 
          type="file" 
          accept={type === 'image' ? 'image/*' : 'video/*'}
          onChange={(e) => setFile(e.target.files?.[0] || null)} 
          className="mt-1 block w-full border rounded px-2 py-1" 
        />
      </div>

      <div>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? 'Uploading...' : 'Upload Banner'}
        </button>
      </div>
    </form>
  );
}
