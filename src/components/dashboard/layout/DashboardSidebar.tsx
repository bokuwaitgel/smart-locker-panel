import Link from 'next/link';
import { LogOut, type LucideIcon, PanelLeftClose, PanelLeftOpen, User2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  current: boolean;
}

interface DashboardSidebarProps {
  navigation: NavigationItem[];
  sidebarOpen: boolean;
  isMobile: boolean;
  userName: string;
  userEmail?: string;
  onToggleSidebar: () => void;
  onCloseMobile: () => void;
  onLogout: () => void;
}

export function DashboardSidebar({
  navigation,
  sidebarOpen,
  isMobile,
  userName,
  userEmail,
  onToggleSidebar,
  onCloseMobile,
  onLogout,
}: DashboardSidebarProps) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200/70 bg-white/90 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-all duration-300',
        isMobile ? (sidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72') : sidebarOpen ? 'w-72' : 'w-24'
      )}
    >
      <div className="flex h-24 items-center justify-between border-b border-slate-200/70 px-5">
        <div className={cn('min-w-0', !sidebarOpen && !isMobile && 'hidden')}>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Workspace</p>
          <h1 className="mt-2 truncate text-lg font-semibold tracking-tight text-slate-950">24/7 Delivery Box</h1>
          <p className="mt-1 text-sm text-slate-500">Smart locker control</p>
        </div>
        <Button
          onClick={onToggleSidebar}
          variant="outline"
          size="icon"
          className="h-11 w-11 rounded-2xl border-slate-200 bg-white"
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => isMobile && onCloseMobile()}
                className={cn(
                  'group flex min-h-[56px] items-center rounded-2xl border px-3 transition-all duration-200',
                  item.current
                    ? 'border-slate-900 bg-slate-950 text-white shadow-[0_18px_30px_-18px_rgba(15,23,42,0.65)]'
                    : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950',
                  sidebarOpen || isMobile ? 'justify-start gap-3.5' : 'justify-center'
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl',
                    item.current ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500 group-hover:text-slate-900'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                {(sidebarOpen || isMobile) && (
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className={cn('truncate text-xs', item.current ? 'text-slate-300' : 'text-slate-400')}>
                      Open {item.name.toLowerCase()}
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-200/70 p-4">
        <div className={cn('rounded-[28px] border border-slate-200 bg-slate-50/80 p-4', !sidebarOpen && !isMobile && 'p-3')}>
          <div className={cn('flex items-center', sidebarOpen || isMobile ? 'gap-3' : 'justify-center')}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <User2 className="h-5 w-5" />
            </div>
            {(sidebarOpen || isMobile) && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-950">{userName}</p>
                <p className="truncate text-xs text-slate-500">{userEmail}</p>
              </div>
            )}
          </div>
          {(sidebarOpen || isMobile) && (
            <Button
              onClick={onLogout}
              variant="outline"
              className="mt-4 h-11 w-full justify-center rounded-2xl border-slate-200 bg-white text-slate-700"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
