'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Upload, Image as ImageIcon, Video, AlertCircle } from 'lucide-react';

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
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError('Failed to save banner');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Upload size={20} className="text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Upload Banner</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Banner Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType('image')}
              className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all ${
                type === 'image'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <ImageIcon size={18} />
              <span className="font-medium">Image</span>
            </button>
            <button
              type="button"
              onClick={() => setType('video')}
              className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all ${
                type === 'video'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <Video size={18} />
              <span className="font-medium">Video</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {type === 'image' ? 'Select Image' : 'Select Video'}
          </label>
          <div className="relative">
            <input 
              type="file" 
              accept={type === 'image' ? 'image/*' : 'video/*'}
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
            />
          </div>
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading || !file}
          className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium shadow-md transition-all ${
            loading || !file
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
          }`}
        >
          <Upload size={18} />
          <span>{loading ? 'Uploading...' : 'Upload Banner'}</span>
        </button>
      </div>
    </form>
  );
}
