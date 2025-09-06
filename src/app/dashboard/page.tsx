'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Stats {
  totalContainers: number;
  activeContainers: number;
  totalLockers: number;
  availableLockers: number;
  occupiedLockers: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
        const [containerRes, lockerRes] = await Promise.all([
            api.get('/containers/stats'),
            api.get('/lockers/stats'),
        ]);

        console.log(containerRes.data);
        console.log(lockerRes.data);    

        const fetchedData = {
            totalContainers: containerRes.data.totalContainers || 0,
            activeContainers: containerRes.data.activeContainers || 0,
            totalLockers: lockerRes.data.totalLockers || 0,
            availableLockers: lockerRes.data.availableLockers || 0,
            occupiedLockers: lockerRes.data.occupiedLockers || 0,
        }

        setStats(fetchedData);
        if (loading) setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-600">
          Monitor your smart locker system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">C</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Containers
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.totalContainers || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Containers
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.activeContainers || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">L</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Lockers
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.totalLockers || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Available Lockers
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats?.availableLockers || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/dashboard/containers"
            className="relative block w-full bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">📦</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Manage Containers</h3>
                <p className="text-sm text-gray-500">Add, edit, and monitor containers</p>
              </div>
            </div>
          </a>

          <a
            href="/dashboard/lockers"
            className="relative block w-full bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">🔒</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Manage Lockers</h3>
                <p className="text-sm text-gray-500">View and update locker status</p>
              </div>
            </div>
          </a>

          <a
            href="/dashboard/orders"
            className="relative block w-full bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">�</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Delivery Orders</h3>
                <p className="text-sm text-gray-500">Manage orders and pickup codes</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
