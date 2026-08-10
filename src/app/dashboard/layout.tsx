'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Lock, ShoppingCart, Image as ImageIcon } from 'lucide-react';
import { DashboardSidebar } from '@/components/dashboard/layout/DashboardSidebar';
import { DashboardTopbar } from '@/components/dashboard/layout/DashboardTopbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Handle responsive sidebar
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_30%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)]">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
          <p className="mt-4 text-sm font-medium text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: pathname === '/dashboard' },
    { name: 'Containers', href: '/dashboard/containers', icon: Package, current: pathname === '/dashboard/containers' },
    { name: 'Lockers', href: '/dashboard/lockers', icon: Lock, current: pathname === '/dashboard/lockers' },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart, current: pathname === '/dashboard/orders' },
    { name: 'Banner', href: '/dashboard/banner', icon: ImageIcon, current: pathname === '/dashboard/banner' },
  ];

  const activeTitle = navigation.find((item) => item.current)?.name || 'Dashboard';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.08),_transparent_20%),linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)]">
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <DashboardSidebar
        navigation={navigation}
        sidebarOpen={sidebarOpen}
        isMobile={isMobile}
        userName={user?.name || user?.email || 'Operator'}
        userEmail={user?.email}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onCloseMobile={() => setSidebarOpen(false)}
        onLogout={logout}
      />

      <main
        className={`transition-all duration-300 ${
          isMobile ? 'ml-0' : sidebarOpen ? 'ml-72' : 'ml-24'
        }`}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          {/* <DashboardTopbar
            title={activeTitle}
            isMobile={isMobile}
            onOpenSidebar={() => setSidebarOpen(true)}
          /> */}

          <div className="mt-6">
          {children}
          </div>
        </div>
      </main>
    </div>
  );
}
