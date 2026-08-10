'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import { createLogger } from '@/lib/logger';
import ContainerCard from '@/components/ContainerCard';
import { ContainersEmptyState } from '@/components/dashboard/containers/ContainersEmptyState';

const log = createLogger('Containers');

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
            log.error('Failed to fetch containers', error);
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
            log.error('Failed to create container', error);
        }
    };

    const updateStatus = async (id: number, status: string) => {
        try {
            await api.put(`/containers/${id}/status`, { status });
            fetchContainers();
        } catch (error) {
            log.error('Failed to update container status', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
                    <p className="mt-4 text-sm font-medium text-slate-500">Loading containers...</p>
                </div>
            </div>
        );
    }


    return (
        <div className="space-y-6">
            {containers.length > 0 ? (
                <div className="space-y-4">
                    {containers.map((container) => (
                        <ContainerCard
                            key={container.id}
                            container={container}
                            onStatusChange={updateStatus}
                        />
                    ))}
                </div>
            ) : (
                <ContainersEmptyState onAddContainer={() => setShowForm(true)} />
            )}

        </div>
    );
}
