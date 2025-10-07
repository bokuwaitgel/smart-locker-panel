'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import { Package, Clock, CheckCircle, XCircle, Search, Filter, Smartphone } from 'lucide-react';

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
  const [boardId, setBoardId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, isLoading]);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (boardId) params.append('boardId', boardId);
      if (statusFilter) params.append('status', statusFilter);
      
      const queryString = params.toString();
      const url = queryString ? `delivery/deliveries?${queryString}` : 'delivery/deliveries';

      const response = await api.get(url);
      console.log('Fetched orders:', response.data);
      setOrders(response.data.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const clearFilters = () => {
    setBoardId('');
    setStatusFilter('');
    fetchOrders();
  };

  // const updateStatus = async (id: number, status: string) => {
  //   try {
  //     await api.put(`/deliveries/${id}/status`, { status });
  //     fetchOrders();
  //   } catch (error) {
  //     console.error('Failed to update status:', error);
  //   }
  // };

  const filteredOrders = selectedStatus
    ? orders.filter(order => order.status === selectedStatus)
    : orders;

  const statusOptions = ['WAITING', 'PENDING', 'DELIVERED', 'PICKED_UP', 'CANCELLED'];
  const uniqueStatuses = [...new Set(orders.map(o => o.status))];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'WAITING':
        return <Clock size={16} className="text-yellow-600" />;
      case 'PENDING':
        return <Package size={16} className="text-blue-600" />;
      case 'DELIVERED':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'PICKED_UP':
        return <CheckCircle size={16} className="text-purple-600" />;
      case 'CANCELLED':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Filter Form */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Filter size={20} className="text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filter Orders</h2>
        </div>
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Board ID
            </label>
            <input
              type="text"
              value={boardId}
              onChange={(e) => setBoardId(e.target.value)}
              placeholder="Enter board ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all"
            >
              <option value="">All Statuses</option>
              <option value="WAITING">Waiting</option>
              <option value="PENDING">Pending</option>
              <option value="DELIVERED">Delivered</option>
              <option value="PICKED_UP">Picked Up</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div className="flex items-end space-x-2">
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium shadow-md transition-all"
            >
              <Search size={18} />
              <span>Search</span>
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300 font-medium transition-colors"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 mb-8">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-md p-5 border border-gray-200">
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {filteredOrders.length}
          </div>
          <div className="text-sm font-medium text-gray-600">Total Orders</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-md p-5 border border-yellow-200">
          <div className="text-3xl font-bold text-yellow-700 mb-1">
            {filteredOrders.filter(o => o.status === 'WAITING').length}
          </div>
          <div className="text-sm font-medium text-yellow-700">Waiting</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-5 border border-blue-200">
          <div className="text-3xl font-bold text-blue-700 mb-1">
            {filteredOrders.filter(o => o.status === 'PENDING').length}
          </div>
          <div className="text-sm font-medium text-blue-700">Pending</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-5 border border-green-200">
          <div className="text-3xl font-bold text-green-700 mb-1">
            {filteredOrders.filter(o => o.status === 'DELIVERED').length}
          </div>
          <div className="text-sm font-medium text-green-700">Delivered</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md p-5 border border-purple-200">
          <div className="text-3xl font-bold text-purple-700 mb-1">
            {filteredOrders.filter(o => o.status === 'PICKED_UP').length}
          </div>
          <div className="text-sm font-medium text-purple-700">Picked Up</div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Package size={20} className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Container:</span>
                      <span className="font-medium text-gray-900">{order.boardId}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Locker:</span>
                      <span className="font-medium text-gray-900">{order.lockerId}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Smartphone size={14} className="text-gray-400" />
                      <span className="font-medium text-gray-900">{order.pickupMobile}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-gray-600">{new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                    <span className="text-sm font-medium text-gray-700">Pickup Code:</span>
                    <span className="text-lg font-bold font-mono text-blue-600">{order.pickupCode}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-3 lg:min-w-[200px]">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span
                      className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full ${
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
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    Payment: <span className="font-medium text-gray-900">{order.paymentStatus}</span>
                  </div>
                  
                  {order.isSendSMS && (
                    <div className="flex items-center space-x-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <Smartphone size={12} />
                      <span>SMS Sent</span>
                    </div>
                  )}

                  <select
                    value={order.status}
                    // onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
