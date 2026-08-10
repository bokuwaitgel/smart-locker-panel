'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { 
  Package, 
  PackageCheck, 
  Lock, 
  LockOpen, 
  TrendingUp,
  ArrowRight,
  Activity,
  Sparkles,
  ChartNoAxesColumn,
  ShieldCheck
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
      try {
        const [containerRes, lockerRes] = await Promise.all([
          api.get('/containers/stats'),
          api.get('/lockers/stats'),
        ]);

        setStats({
          totalContainers: containerRes.data.totalContainers || 0,
          activeContainers: containerRes.data.activeContainers || 0,
          totalLockers: lockerRes.data.totalLockers || 0,
          availableLockers: lockerRes.data.availableLockers || 0,
          occupiedLockers: lockerRes.data.occupiedLockers || 0,
        });
      } catch {
        setStats({ totalContainers: 0, activeContainers: 0, totalLockers: 0, availableLockers: 0, occupiedLockers: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
          <p className="mt-4 text-sm font-medium text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Containers',
      value: stats?.totalContainers || 0,
      icon: Package,
      gradient: 'from-[#1C1F26] to-[#111827]',
      bgColor: 'bg-[#ede9fe]',
      iconColor: 'text-[#1C1F26]',
    },
    {
      title: 'Active Containers',
      value: stats?.activeContainers || 0,
      icon: PackageCheck,
      gradient: 'from-[#f2cd54] to-[#c89612]',
      bgColor: 'bg-[#fef3c7]',
      iconColor: 'text-[#a16207]',
    },
    {
      title: 'Total Lockers',
      value: stats?.totalLockers || 0,
      icon: Lock,
      gradient: 'from-[#1C1F26] to-[#111827]',
      bgColor: 'bg-[#ede9fe]',
      iconColor: 'text-[#1C1F26]',
    },
    {
      title: 'Available Lockers',
      value: stats?.availableLockers || 0,
      icon: LockOpen,
      gradient: 'from-[#f2cd54] to-[#d4a514]',
      bgColor: 'bg-[#fef3c7]',
      iconColor: 'text-[#a16207]',
    },
  ];

  const occupancyRate = stats?.totalLockers 
    ? ((stats.occupiedLockers / stats.totalLockers) * 100).toFixed(1)
    : 0;

  const insights = [
    {
      title: 'Occupancy trend',
      value: `${occupancyRate}%`,
      description: 'Current locker usage across the network',
      icon: ChartNoAxesColumn,
    },
    {
      title: 'Available now',
      value: `${stats?.availableLockers || 0}`,
      description: 'Lockers ready for the next delivery',
      icon: ShieldCheck,
    },
  ];

  const quickActions = [
    {
      title: 'Manage Containers',
      description: 'Add, edit, and monitor containers',
      href: '/dashboard/containers',
      icon: Package,
      gradient: 'from-[#1C1F26] to-[#111827]',
    },
    {
      title: 'Manage Lockers',
      description: 'View and update locker status',
      href: '/dashboard/lockers',
      icon: Lock,
      gradient: 'from-[#f2cd54] to-[#c89612]',
    },
    {
      title: 'Delivery Orders',
      description: 'Manage orders and pickup codes',
      href: '/dashboard/orders',
      icon: Activity,
      gradient: 'from-[#1C1F26] to-[#111827]',
    },
  ];

  return (
    <div className="space-y-4">
   
      {/* Welcome Section */}
      <div className="grid gap-3 xl:min-h-[20vh] xl:grid-cols-[1.55fr_0.95fr]">
        <Card className="overflow-hidden border-slate-200/70 bg-[radial-gradient(circle_at_top_left,_rgba(107,70,193,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(242,205,84,0.18),_transparent_28%),linear-gradient(135deg,_#ffffff_0%,_#faf5ff_55%,_#fffbea_100%)]">
          <CardContent className="grid h-full gap-3 p-3.5 lg:grid-cols-[1.3fr_0.85fr] lg:p-4">
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                <Sparkles className="h-3.5 w-3.5" />
                Smart locker overview
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">Welcome back!</h1>
                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-600 sm:text-sm">
                  Here&apos;s what&apos;s happening with your smart locker system today. Monitor infrastructure health, track occupancy, and jump into the most important operations faster.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <div className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm sm:text-sm">
                  <TrendingUp className="h-3.5 w-3.5 text-[#1C1F26]" />
                  Active containers: {stats?.activeContainers || 0}
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm sm:text-sm">
                  <LockOpen className="h-3.5 w-3.5 text-[#a16207]" />
                  Available lockers: {stats?.availableLockers || 0}
                </div>
              </div>
            </div>

            <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
              {insights.map((insight) => {
                const InsightIcon = insight.icon;

                return (
                  <div key={insight.title} className="rounded-[20px] border border-white/70 bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-950 text-white">
                        <InsightIcon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Live</span>
                    </div>
                    <p className="mt-2 text-xs font-medium text-slate-500 sm:text-sm">{insight.title}</p>
                    <p className="mt-0.5 text-lg font-semibold text-slate-950 sm:text-xl">{insight.value}</p>
                    <p className="mt-1 text-[11px] leading-4 text-slate-500 sm:text-xs">{insight.description}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/70 bg-white/95">
          <CardContent className="h-full p-3.5 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Network summary</p>
                <h2 className="mt-1 text-sm font-semibold text-slate-950 sm:text-base">System health</h2>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <Activity className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="mt-2.5 space-y-1.5">
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1.5">
                <span className="text-xs font-medium text-slate-500 sm:text-sm">Total containers</span>
                <span className="text-xs font-semibold text-slate-950 sm:text-sm">{stats?.totalContainers || 0}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1.5">
                <span className="text-xs font-medium text-slate-500 sm:text-sm">Total lockers</span>
                <span className="text-xs font-semibold text-slate-950 sm:text-sm">{stats?.totalLockers || 0}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1.5">
                <span className="text-xs font-medium text-slate-500 sm:text-sm">Occupied lockers</span>
                <span className="text-xs font-semibold text-slate-950 sm:text-sm">{stats?.occupiedLockers || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

     {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {statsCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <Card
              key={index}
              className="group relative min-h-[5vh] overflow-hidden border-slate-200/70 bg-white/95 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]"
            >
              <CardContent className="relative flex h-full items-center justify-center gap-3 px-3 py-4 mt-2">
                <div className={`flex h-9 w-9 items-center justify-center rounded-2xl border border-white/60 ${card.bgColor} shadow-sm`}>
                  <Icon size={16} className={card.iconColor} />
                </div>

                <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                  <p className="truncate text-[11px] font-medium leading-4 text-slate-500 sm:text-xs">
                    {card.title}
                  </p>
                  <p className="shrink-0 text-lg font-semibold tracking-tight text-slate-950 sm:text-xl mr-2">
                    {card.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    
      {/* Quick Actions */}
      <div>
       
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;

            return (
              <Link
                key={index}
                href={action.href}
                className="group"
              >
                <Card className="h-full overflow-hidden border-slate-200/70 bg-white/95 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]">
                  <CardContent className="p-5 mt-4">
                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r ${action.gradient}`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-slate-950 transition-colors group-hover:text-[#1C1F26]">
                      {action.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-5 text-slate-500">
                      {action.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm font-medium text-[#1C1F26]">
                      <span>Open section</span>
                      <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
