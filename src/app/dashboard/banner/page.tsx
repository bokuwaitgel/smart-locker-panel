'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import BannerForm from '@/components/BannerForm';
import { Image as ImageIcon, Video, CheckCircle, XCircle, Trash2, Power, Clock } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading banners...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <BannerForm onSaved={fetchBanners} />
        </div>

        {/* Banners List */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {banners.map(b => (
              <div key={b.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="p-5">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Preview */}
                    <div className="flex-shrink-0">
                      <div className="relative w-full md:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden">
                        {b.type === 'image' ? (
                          <img 
                            src={b.url} 
                            alt="Banner" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video 
                            src={b.url} 
                            className="w-full h-full object-cover" 
                            controls
                          />
                        )}
                        <div className="absolute top-2 left-2">
                          <div className="flex items-center space-x-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
                            {b.type === 'image' ? (
                              <ImageIcon size={14} className="text-white" />
                            ) : (
                              <Video size={14} className="text-white" />
                            )}
                            <span className="text-xs text-white font-medium capitalize">{b.type}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Info & Actions */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 capitalize">
                            {b.type} Banner
                          </h3>
                          <div className="flex items-center space-x-2">
                            {b.status ? (
                              <CheckCircle size={18} className="text-green-600" />
                            ) : (
                              <XCircle size={18} className="text-gray-400" />
                            )}
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              b.status 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {b.status ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                          <Clock size={14} />
                          <span>{new Date(b.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => toggleStatus(b.id, b.status)}
                          className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                            b.status
                              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                          }`}
                        >
                          <Power size={16} />
                          <span>{b.status ? 'Deactivate' : 'Activate'}</span>
                        </button>
                        <button 
                          onClick={() => deleteBanner(b.id)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {banners.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No banners yet</h3>
                <p className="text-gray-600">Upload your first banner to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
