'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';

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
        return <div className="text-center py-8">Loading containers...</div>;
    }

    return (
        <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Container Management</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Manage your smart locker containers
                    </p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={fetchContainers}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                        Check Containers
                    </button>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        {showForm ? 'Cancel' : 'Add Container'}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Container</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Board ID</label>
                            <input
                                type="text"
                                required
                                value={formData.boardId}
                                onChange={(e) => setFormData({ ...formData, boardId: e.target.value })}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <input
                                type="text"
                                required
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
                                rows={3}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            Create Container
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {containers.map((container) => (
                        <li key={container.id} className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center">
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-gray-900">
                                                {container.boardId}
                                            </h3>
                                            <p className="text-sm text-gray-500">{container.location}</p>
                                            {container.description && (
                                                <p className="text-sm text-gray-400">{container.description}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            container.status === 'ACTIVE'
                                                ? 'bg-green-100 text-green-800'
                                                : container.status === 'INACTIVE'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                    >
                                        {container.status}
                                    </span>
                                    <select
                                        value={container.status}
                                        onChange={(e) => updateStatus(container.id, e.target.value)}
                                        className="text-sm border-gray-300 text-black rounded-md focus:ring-blue-500 focus:border-blue-500 border-radius-md border-1"
                                    >
                                        <option value="ACTIVE">Active</option>
                                        <option value="INACTIVE">Inactive</option>
                                        <option value="MAINTENANCE">Maintenance</option>
                                    </select>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
