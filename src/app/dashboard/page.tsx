'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { 
  Package, 
  PackageCheck, 
  Lock, 
  LockOpen, 
  TrendingUp,
  ArrowRight,
  Activity
} from 'lucide-react';

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
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Containers',
      value: stats?.totalContainers || 0,
      icon: Package,
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Active Containers',
      value: stats?.activeContainers || 0,
      icon: PackageCheck,
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Total Lockers',
      value: stats?.totalLockers || 0,
      icon: Lock,
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Available Lockers',
      value: stats?.availableLockers || 0,
      icon: LockOpen,
      gradient: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
  ];

  const quickActions = [
    {
      title: 'Manage Containers',
      description: 'Add, edit, and monitor containers',
      href: '/dashboard/containers',
      icon: Package,
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Manage Lockers',
      description: 'View and update locker status',
      href: '/dashboard/lockers',
      icon: Lock,
      gradient: 'from-green-500 to-green-600',
    },
    {
      title: 'Delivery Orders',
      description: 'Manage orders and pickup codes',
      href: '/dashboard/orders',
      icon: Activity,
      gradient: 'from-purple-500 to-purple-600',
    },
  ];

  const occupancyRate = stats?.totalLockers 
    ? ((stats.occupiedLockers / stats.totalLockers) * 100).toFixed(1)
    : 0;

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-6 sm:mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-sm sm:text-base text-blue-100">
              Here's what's happening with your smart locker system today.
            </p>
          </div>
          <TrendingUp size={36} className="text-blue-200 opacity-50 hidden sm:block sm:w-12 sm:h-12" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group touch-manipulation"
            >
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={`p-2.5 sm:p-3 rounded-lg ${card.bgColor}`}>
                    <Icon size={20} className={`sm:w-6 sm:h-6 ${card.iconColor}`} />
                  </div>
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${card.gradient} animate-pulse`}></div>
                </div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </h3>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>
              <div className={`h-1 bg-gradient-to-r ${card.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
            </div>
          );
        })}
      </div>

      {/* Occupancy Rate Card */}
      <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Locker Occupancy Rate</h3>
          <Activity className="text-gray-400" size={18} />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="text-3xl sm:text-4xl font-bold text-gray-900">{occupancyRate}%</div>
          <div className="text-xs sm:text-sm text-gray-600 sm:pb-2">
            {stats?.occupiedLockers} of {stats?.totalLockers} lockers occupied
          </div>
        </div>
        <div className="mt-4 bg-gray-200 rounded-full h-2.5 sm:h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${occupancyRate}%` }}
          ></div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <a
                key={index}
                href={action.href}
                className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden touch-manipulation active:scale-95"
              >
                <div className="p-5 sm:p-6">
                  <div className={`inline-flex p-2.5 sm:p-3 rounded-lg bg-gradient-to-r ${action.gradient} mb-3 sm:mb-4`}>
                    <Icon size={20} className="text-white sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 sm:mb-4">
                    {action.description}
                  </p>
                  <div className="flex items-center text-blue-600 font-medium text-sm">
                    <span>Get Started</span>
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${action.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
