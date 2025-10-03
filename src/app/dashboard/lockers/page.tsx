'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import { isAxiosError } from 'axios';

interface Locker {
  id: number;
  lockerNumber: string;
  status: string;
  boardId: string;
  description?: string;
}

export default function LockersPage() {
  const { isAuthenticated } = useAuth();
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBoardId, setSelectedBoardId] = useState('');
  const [actionLockerId, setActionLockerId] = useState<number | null>(null);
  const [actionMessage, setActionMessage] = useState<
    | { type: 'success' | 'error'; text: string }
    | null
  >(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchLockers();
  }, [isAuthenticated]);

  const fetchLockers = async () => {
    try {
      const response = await api.get('/lockers');
      
      setLockers(response.data.data);
      setActionMessage(null);
    } catch (error) {
      console.error('Failed to fetch lockers:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/lockers/${id}/status`, { status });
      fetchLockers();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleOpenLocker = async (locker: Locker) => {
    setActionLockerId(locker.id);
    setActionMessage(null);
    try {
      const response = await api.post('/lockers/open', {
        lockerNumber: locker.lockerNumber,
        boardId: locker.boardId,
      });

      setActionMessage({
        type: 'success',
        text:
          response.data?.message ||
          `Locker ${locker.lockerNumber} open request sent successfully.`,
      });
    } catch (error) {
      console.error('Failed to open locker:', error);
      let message = 'Failed to open locker. Please try again.';

      if (isAxiosError(error)) {
        const responseMessage = (error.response?.data as {
          message?: string;
        })?.message;
        if (responseMessage) {
          message = responseMessage;
        }
      } else if (error instanceof Error && error.message) {
        message = error.message;
      }

      setActionMessage({ type: 'error', text: message });
    } finally {
      setActionLockerId(null);
    }
  };

  const filteredLockers = selectedBoardId
    ? lockers.filter(locker => locker.boardId === selectedBoardId)
    : lockers;

  const uniqueBoardIds = [...new Set(lockers.map(l => l.boardId))];

  if (loading) {
    return <div className="text-center py-8">Loading lockers...</div>;
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Locker Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Monitor and manage your smart lockers
        </p>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Container
        </label>
        <select
          value={selectedBoardId}
          onChange={(e) => setSelectedBoardId(e.target.value)}
          className="border-gray-300 border-2 text-black rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Containers</option>
          {uniqueBoardIds.map(boardId => (
            <option key={boardId} value={boardId}>{boardId}</option>
          ))}
        </select>
      </div>

      {actionMessage && (
        <div
          className={`mb-6 rounded-md border p-4 text-sm ${
            actionMessage.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {actionMessage.text}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">
            {filteredLockers.length}
          </div>
          <div className="text-sm text-gray-500">Total Lockers</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {filteredLockers.filter(l => l.status === 'AVAILABLE').length}
          </div>
          <div className="text-sm text-gray-500">Available</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">
            {filteredLockers.filter(l => l.status === 'OCCUPIED').length}
          </div>
          <div className="text-sm text-gray-500">Occupied</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">
            {filteredLockers.filter(l => l.status === 'MAINTENANCE').length}
          </div>
          <div className="text-sm text-gray-500">Maintenance</div>
        </div>
      </div>

      {/* Lockers Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredLockers.map((locker) => (
          <div key={locker.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {locker.lockerNumber}
              </h3>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  locker.status === 'AVAILABLE'
                    ? 'bg-green-100 text-green-800'
                    : locker.status === 'OCCUPIED'
                    ? 'bg-blue-100 text-blue-800'
                    : locker.status === 'MAINTENANCE'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {locker.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-2">
              Container: {locker.boardId}
            </p>

            {locker.description && (
              <p className="text-sm text-gray-500 mb-4">
                {locker.description}
              </p>
            )}

            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <select
                value={locker.status}
                onChange={(e) => updateStatus(locker.id, e.target.value)}
                className="flex-1 text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black border-2"
              >
                <option value="AVAILABLE">Available</option>
                <option value="OCCUPIED">Occupied</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="PENDING">Pending</option>
              </select>
              <button
                onClick={() => handleOpenLocker(locker)}
                disabled={actionLockerId === locker.id}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  actionLockerId === locker.id
                    ? 'cursor-not-allowed bg-blue-300'
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                }`}
              >
                {actionLockerId === locker.id ? 'Opening...' : 'Open Locker'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
