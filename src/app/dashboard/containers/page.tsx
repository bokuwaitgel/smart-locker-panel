'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import { Package, MapPin, Plus, RefreshCw, X, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Container {
    id: number;
    boardId: string;
    location: string;
    status: string;
    description?: string;
}

export default function ContainersPage() {
    const { isAuthenticated } = useAuth();
    const [containers, setContainers] = useState<Container[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        boardId: '',
        location: '',
        description: '',
    });

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchContainers();
    }, [isAuthenticated]);

    const fetchContainers = async () => {
        try {
            const response = await api.get('/containers');
            setContainers(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            console.error('Failed to fetch containers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/containers', formData);
            setFormData({ boardId: '', location: '', description: '' });
            setShowForm(false);
            fetchContainers();
        } catch (error) {
            console.error('Failed to create container:', error);
        }
    };

    const updateStatus = async (id: number, status: string) => {
        try {
            await api.put(`/containers/${id}/status`, { status });
            fetchContainers();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading containers...</p>
                </div>
            </div>
        );
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <CheckCircle size={16} className="text-green-600" />;
            case 'INACTIVE':
                return <XCircle size={16} className="text-red-600" />;
            case 'MAINTENANCE':
                return <AlertCircle size={16} className="text-yellow-600" />;
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-3">
                    <button
                        onClick={fetchContainers}
                        className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-sm border border-gray-200 transition-colors"
                    >
                        <RefreshCw size={18} />
                        <span>Refresh</span>
                    </button>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
                    >
                        {showForm ? <X size={18} /> : <Plus size={18} />}
                        <span>{showForm ? 'Cancel' : 'Add Container'}</span>
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Container</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Board ID</label>
                            <input
                                type="text"
                                required
                                value={formData.boardId}
                                onChange={(e) => setFormData({ ...formData, boardId: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all"
                                placeholder="Enter board ID"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <input
                                type="text"
                                required
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all"
                                placeholder="Enter location"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all"
                                rows={3}
                                placeholder="Enter description (optional)"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all"
                        >
                            Create Container
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {containers.map((container) => (
                    <div key={container.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Package size={24} className="text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white">
                                        {container.boardId}
                                    </h3>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-5 space-y-4">
                            <div className="flex items-start space-x-2">
                                <MapPin size={18} className="text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{container.location}</p>
                                    {container.description && (
                                        <p className="text-sm text-gray-500 mt-1">{container.description}</p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Status</span>
                                    <div className="flex items-center space-x-2">
                                        {getStatusIcon(container.status)}
                                        <span
                                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                                container.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-800'
                                                    : container.status === 'INACTIVE'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                        >
                                            {container.status}
                                        </span>
                                    </div>
                                </div>
                                
                                <select
                                    value={container.status}
                                    onChange={(e) => updateStatus(container.id, e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all"
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                    <option value="MAINTENANCE">Maintenance</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {containers.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl shadow-md">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No containers found</h3>
                    <p className="text-gray-600 mb-4">Get started by adding your first container</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all"
                    >
                        <Plus size={18} />
                        <span>Add Container</span>
                    </button>
                </div>
            )}
        </div>
    );
}
