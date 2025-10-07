'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import { isAxiosError } from 'axios';
import { Lock, LockOpen, AlertCircle, Filter, Unlock, Package } from 'lucide-react';

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
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lockers...</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <LockOpen size={20} className="text-green-600" />;
      case 'OCCUPIED':
        return <Lock size={20} className="text-blue-600" />;
      case 'MAINTENANCE':
        return <AlertCircle size={20} className="text-yellow-600" />;
      default:
        return <Lock size={20} className="text-gray-600" />;
    }
  };

  return (
    <div>
      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Filter size={20} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filter Lockers</h3>
        </div>
        <select
          value={selectedBoardId}
          onChange={(e) => setSelectedBoardId(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all"
        >
          <option value="">All Containers</option>
          {uniqueBoardIds.map(boardId => (
            <option key={boardId} value={boardId}>{boardId}</option>
          ))}
        </select>
      </div>

      {actionMessage && (
        <div
          className={`mb-6 rounded-xl border-2 p-4 text-sm font-medium ${
            actionMessage.type === 'success'
              ? 'border-green-300 bg-green-50 text-green-800'
              : 'border-red-300 bg-red-50 text-red-800'
          }`}
        >
          {actionMessage.text}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Lock size={24} className="text-gray-600" />
            <div className="text-3xl font-bold text-gray-900">
              {filteredLockers.length}
            </div>
          </div>
          <div className="text-sm font-medium text-gray-600">Total Lockers</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <LockOpen size={24} className="text-green-600" />
            <div className="text-3xl font-bold text-green-700">
              {filteredLockers.filter(l => l.status === 'AVAILABLE').length}
            </div>
          </div>
          <div className="text-sm font-medium text-green-700">Available</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Lock size={24} className="text-blue-600" />
            <div className="text-3xl font-bold text-blue-700">
              {filteredLockers.filter(l => l.status === 'OCCUPIED').length}
            </div>
          </div>
          <div className="text-sm font-medium text-blue-700">Occupied</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-md p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle size={24} className="text-yellow-600" />
            <div className="text-3xl font-bold text-yellow-700">
              {filteredLockers.filter(l => l.status === 'MAINTENANCE').length}
            </div>
          </div>
          <div className="text-sm font-medium text-yellow-700">Maintenance</div>
        </div>
      </div>

      {/* Lockers Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredLockers.map((locker) => (
          <div key={locker.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            <div className={`p-4 ${
              locker.status === 'AVAILABLE' 
                ? 'bg-gradient-to-r from-green-500 to-green-600' 
                : locker.status === 'OCCUPIED'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                : locker.status === 'MAINTENANCE'
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                : 'bg-gradient-to-r from-gray-500 to-gray-600'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    {getStatusIcon(locker.status)}
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {locker.lockerNumber}
                  </h3>
                </div>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/30 text-white backdrop-blur-sm">
                  {locker.status}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center space-x-2 text-sm">
                <Package size={16} className="text-gray-400" />
                <span className="text-gray-700 font-medium">Container: {locker.boardId}</span>
              </div>

              {locker.description && (
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {locker.description}
                </p>
              )}

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <select
                  value={locker.status}
                  onChange={(e) => updateStatus(locker.id, e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="OCCUPIED">Occupied</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="PENDING">Pending</option>
                </select>
                
                <button
                  onClick={() => handleOpenLocker(locker)}
                  disabled={actionLockerId === locker.id}
                  className={`w-full flex items-center justify-center space-x-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all ${
                    actionLockerId === locker.id
                      ? 'cursor-not-allowed bg-gray-400'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                  }`}
                >
                  <Unlock size={16} />
                  <span>{actionLockerId === locker.id ? 'Opening...' : 'Open Locker'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLockers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <Lock size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No lockers found</h3>
          <p className="text-gray-600">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
