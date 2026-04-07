import { AlertCircle, ArrowRight, ChevronRight, Lock, LockOpen, Package, Unlock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface LockerCardProps {
  locker: {
    id: number;
    lockerNumber: string;
    status: string;
    boardId: string;
    description?: string;
  };
  onStatusChange: (id: number, status: string) => void;
  onOpenLocker: () => void;
  isOpening: boolean;
  variant?: 'grid' | 'list';
}

const statusConfig = {
  AVAILABLE: {
    icon: LockOpen,
    iconClassName: 'text-[#1C1F26]',
    badgeVariant: 'success' as const,
    badgeLabel: 'Available',
    panelClassName: 'border-[#ddd6fe] bg-[#ede9fe]/80',
    dotClassName: 'bg-[#1C1F26]',
  },
  OCCUPIED: {
    icon: Lock,
    iconClassName: 'text-[#1C1F26]',
    badgeVariant: 'default' as const,
    badgeLabel: 'Occupied',
    panelClassName: 'border-[#ddd6fe] bg-[#ede9fe]/80',
    dotClassName: 'bg-[#1C1F26]',
  },
  MAINTENANCE: {
    icon: AlertCircle,
    iconClassName: 'text-[#a16207]',
    badgeVariant: 'warning' as const,
    badgeLabel: 'Maintenance',
    panelClassName: 'border-[#f2cd54]/45 bg-[#fef3c7]/80',
    dotClassName: 'bg-[#f2cd54]',
  },
  PENDING: {
    icon: Lock,
    iconClassName: 'text-slate-600',
    badgeVariant: 'secondary' as const,
    badgeLabel: 'Pending',
    panelClassName: 'border-slate-200 bg-slate-50/80',
    dotClassName: 'bg-slate-400',
  },
};

export function LockerCard({ locker, onStatusChange, onOpenLocker, isOpening, variant = 'list' }: LockerCardProps) {
  const currentStatus = statusConfig[locker.status as keyof typeof statusConfig] ?? statusConfig.PENDING;
  const StatusIcon = currentStatus.icon;
  const isGrid = variant === 'grid';

  return (
    <Card className="overflow-hidden border-slate-200/70 bg-white/95">
      <CardContent className={cn(isGrid ? 'p-3' : 'p-0')}>
        <div className={cn('grid gap-0', isGrid ? 'grid-cols-1' : 'lg:grid-cols-[1.35fr_0.9fr]')}>
          <div className={cn(isGrid ? 'border-b border-slate-200/70 px-3 pb-3 pt-2' : 'border-b border-slate-200/70 p-4 lg:border-b-0 lg:border-r')}>
            <div className={cn('flex gap-4', isGrid ? 'flex-col' : 'flex-col sm:flex-row sm:items-start sm:justify-between')}>
              <div className="flex min-w-0 items-start gap-3">
                <div className={cn('flex items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm', isGrid ? 'h-11 w-11' : 'h-10 w-10')}>
                  <Lock className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Locker</p>
                    <h3 className={cn('mt-1 font-semibold tracking-tight text-slate-950 [overflow-wrap:anywhere]', isGrid ? 'text-[1.7rem] leading-tight sm:text-3xl' : 'text-lg sm:text-xl')}>
                      {locker.lockerNumber}
                    </h3>
                  </div>
                  <div className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 sm:text-sm">
                    <Package className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">Container {locker.boardId}</span>
                  </div>
                </div>
              </div>

              <Badge variant={currentStatus.badgeVariant} className="self-start rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em]">
                {currentStatus.badgeLabel}
              </Badge>
            </div>

            <div className={cn('mt-4 grid gap-2', isGrid ? 'grid-cols-1 sm:grid-cols-2' : 'md:grid-cols-3')}>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Locker ID</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">#{locker.id}</p>
              </div>
              <div className={cn('rounded-2xl border p-3', currentStatus.panelClassName)}>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Current state</p>
                <div className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                  <StatusIcon className={cn('h-3.5 w-3.5', currentStatus.iconClassName)} />
                  {currentStatus.badgeLabel}
                </div>
              </div>
              <div className={cn('rounded-2xl border border-slate-200 bg-slate-50 p-3', isGrid ? 'sm:col-span-2' : '')}>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Controller</p>
                <p className="mt-2 text-sm font-semibold text-slate-900 [overflow-wrap:anywhere]">Board {locker.boardId}</p>
              </div>
            </div>

            {locker.description && (
              <div className="mt-4 rounded-[20px] border border-slate-200 bg-slate-50/80 p-3">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Description</p>
                <p className="mt-2 text-sm leading-5 text-slate-600 [overflow-wrap:anywhere]">{locker.description}</p>
              </div>
            )}
          </div>

          <div className={cn(isGrid ? 'px-3 pb-3 pt-3' : 'p-4')}>
            <div className="space-y-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">Update status</p>
                    <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">Choose the next controller state</p>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <div className="mt-3">
                  <Select
                    value={locker.status}
                    onChange={(e) => onStatusChange(locker.id, e.target.value)}
                    className="rounded-2xl border-slate-200"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="PENDING">Pending</option>
                  </Select>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">Remote command</p>
                    <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">Send open signal to this locker</p>
                  </div>
                  <Unlock className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <Button
                  onClick={onOpenLocker}
                  disabled={isOpening}
                  className={cn(
                    'mt-3 h-9 w-full justify-center rounded-2xl text-sm text-white shadow-sm',
                    isOpening ? 'cursor-not-allowed bg-slate-400 hover:bg-slate-400' : 'bg-[#1C1F26] hover:bg-[#1C1F26]/90'
                  )}
                >
                  <Unlock className="h-3.5 w-3.5" />
                  {isOpening ? 'Opening...' : 'Open locker'}
                  {!isOpening && <ArrowRight className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
