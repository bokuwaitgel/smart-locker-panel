'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import BannerForm from '@/components/BannerForm';

interface Banner {
  id: number;
  type: string;
  url: string;
  status: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function BannerPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBanners = async () => {
    try {
      const res = await api.get('/banner');
      setBanners(res.data.data || []);
    } catch (err) {
      console.error('Failed to load banners', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await api.put(`/banner/${id}`, { status: !currentStatus });
      fetchBanners();
    } catch (err) {
      console.error('Failed to update banner status', err);
    }
  };

  const deleteBanner = async (id: number) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      await api.delete(`/banner/${id}`);
      fetchBanners();
    } catch (err) {
      console.error('Failed to delete banner', err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-black">Manage Banners</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <BannerForm onSaved={fetchBanners} />
        </div>

        <div className="md:col-span-2">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-4">
              {banners.map(b => (
                <div key={b.id} className="bg-white p-4 rounded shadow flex justify-between items-start">
                  <div>
                    <h3 className="font-medium capitalize">{b.type} Banner</h3>
                    <p className="text-sm text-black">
                      {b.type === 'image' ? (
                        <img src={b.url} alt="Banner" className="max-w-32 max-h-20 object-cover rounded" />
                      ) : (
                        <video src={b.url} className="max-w-32 max-h-20 object-cover rounded" controls />
                      )}
                    </p>
                    <p className="text-xs text-black">{new Date(b.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right space-y-2">
                    <div className={`inline-block px-2 py-1 text-xs rounded ${b.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {b.status ? 'Active' : 'Inactive'}
                    </div>
                    <div className="space-x-2">
                      <button 
                        onClick={() => toggleStatus(b.id, b.status)}
                        className="px-2 py-1 text-xs bg-blue-500 text-black rounded hover:bg-blue-600"
                      >
                        {b.status ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => deleteBanner(b.id)}
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
