'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';

interface DeliveryOrder {
  id: number;
  boardId: string;
  lockerId: string;
  pickupCode: string;
  status: string;
  paymentStatus: string;
  pickupMobile: string;
  isSendSMS: boolean;
  createdAt: string;
  deliveredAt?: string;
  pickedUpAt?: string;
}

export default function OrdersPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, isLoading]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/deliveries');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/deliveries/${id}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const filteredOrders = selectedStatus
    ? orders.filter(order => order.status === selectedStatus)
    : orders;

  const statusOptions = ['WAITING', 'PENDING', 'DELIVERED', 'PICKED_UP', 'CANCELLED'];
  const uniqueStatuses = [...new Set(orders.map(o => o.status))];

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Delivery Orders</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage delivery orders and pickup codes
        </p>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Status
        </label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Orders</option>
          {uniqueStatuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-900">
            {filteredOrders.length}
          </div>
          <div className="text-sm text-gray-500">Total Orders</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">
            {filteredOrders.filter(o => o.status === 'WAITING').length}
          </div>
          <div className="text-sm text-gray-500">Waiting</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">
            {filteredOrders.filter(o => o.status === 'PENDING').length}
          </div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {filteredOrders.filter(o => o.status === 'DELIVERED').length}
          </div>
          <div className="text-sm text-gray-500">Delivered</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">
            {filteredOrders.filter(o => o.status === 'PICKED_UP').length}
          </div>
          <div className="text-sm text-gray-500">Picked Up</div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredOrders.map((order) => (
            <li key={order.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Container: {order.boardId} | Locker: {order.lockerId}
                      </p>
                      <p className="text-sm text-gray-500">
                        Mobile: {order.pickupMobile}
                      </p>
                      <p className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        Code: {order.pickupCode}
                      </p>
                      <p className="text-xs text-gray-400">
                        Created: {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'WAITING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'PENDING'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'DELIVERED'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'PICKED_UP'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Payment: {order.paymentStatus}
                    </p>
                    {order.isSendSMS && (
                      <p className="text-xs text-green-600 mt-1">📱 SMS Sent</p>
                    )}
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
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
