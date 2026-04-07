import { AlertCircle, CheckCircle2, ChevronRight, MapPin, Package2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ContainerCardProps {
  container: {
    id: number;
    boardId: string;
    location: string;
    status: string;
    description?: string;
  };
  onStatusChange: (id: number, status: string) => void;
}

const statusConfig = {
  ACTIVE: {
    badgeVariant: 'success' as const,
    icon: CheckCircle2,
    iconClassName: 'text-[#1C1F26]',
    panelClassName: 'border-[#ddd6fe] bg-[#ede9fe]/70',
    dotClassName: 'bg-[#1C1F26]',
    label: 'Active',
  },
  INACTIVE: {
    badgeVariant: 'destructive' as const,
    icon: XCircle,
    iconClassName: 'text-rose-600',
    panelClassName: 'border-rose-100 bg-rose-50/70',
    dotClassName: 'bg-rose-500',
    label: 'Inactive',
  },
  MAINTENANCE: {
    badgeVariant: 'warning' as const,
    icon: AlertCircle,
    iconClassName: 'text-[#a16207]',
    panelClassName: 'border-[#f2cd54]/45 bg-[#fef3c7]/70',
    dotClassName: 'bg-[#f2cd54]',
    label: 'Maintenance',
  },
};

export default function ContainerCard({ container, onStatusChange }: ContainerCardProps) {
  const currentStatus = statusConfig[container.status as keyof typeof statusConfig] ?? statusConfig.INACTIVE;
  const StatusIcon = currentStatus.icon;

  return (
    <Card className="overflow-hidden border-slate-200/70 bg-white/95">
      <CardContent className="p-0">
        <div className="grid gap-0 lg:grid-cols-[1.35fr_0.9fr]">
          <div className="border-b border-slate-200/70 p-6 lg:border-b-0 lg:border-r">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
                  <Package2 className="h-6 w-6" />
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Container</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{container.boardId}</h3>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>{container.location}</span>
                  </div>
                </div>
              </div>

              <Badge variant={currentStatus.badgeVariant} className="self-start rounded-full px-3.5 py-1.5 text-xs uppercase tracking-[0.18em]">
                {currentStatus.label}
              </Badge>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Container ID</p>
                <p className="mt-3 text-sm font-semibold text-slate-900">#{container.id}</p>
              </div>
              <div className={cn('rounded-2xl border p-4', currentStatus.panelClassName)}>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Current state</p>
                <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <StatusIcon className={cn('h-4 w-4', currentStatus.iconClassName)} />
                  {currentStatus.label}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Location type</p>
                <p className="mt-3 text-sm font-semibold text-slate-900">Site deployment</p>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Description</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {container.description || 'No description was provided for this container yet.'}
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Actions</p>
                <h4 className="mt-2 text-lg font-semibold text-slate-950">Status controls</h4>
              </div>
              <div className={cn('h-3 w-3 rounded-full', currentStatus.dotClassName)} />
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Live status</p>
                    <p className="mt-1 text-sm text-slate-500">Current backend value</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <StatusIcon className={cn('h-4 w-4', currentStatus.iconClassName)} />
                    {container.status}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Update status</p>
                    <p className="mt-1 text-sm text-slate-500">Choose a new state from the list</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
                <div className="mt-4">
                  <Select
                    value={container.status}
                    onChange={(e) => onStatusChange(container.id, e.target.value)}
                    className="rounded-2xl border-slate-200"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </Select>
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-900">Design note</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  This vertical action panel keeps controls aligned in a table-like stack while preserving the existing status update logic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
