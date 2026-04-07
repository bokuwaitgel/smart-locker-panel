import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  CreditCard,
  Package,
  Smartphone,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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

interface OrderCardProps {
  order: DeliveryOrder;
}

const statusConfig = {
  WAITING: {
    icon: Clock3,
    iconClassName: 'text-[#a16207]',
    badgeVariant: 'warning' as const,
    badgeLabel: 'Waiting',
    panelClassName: 'border-[#f2cd54]/45 bg-[#fef3c7]/80',
    dotClassName: 'bg-[#f2cd54]',
  },
  PENDING: {
    icon: Package,
    iconClassName: 'text-[#1C1F26]',
    badgeVariant: 'default' as const,
    badgeLabel: 'Pending',
    panelClassName: 'border-[#ddd6fe] bg-[#ede9fe]/80',
    dotClassName: 'bg-[#1C1F26]',
  },
  DELIVERED: {
    icon: CheckCircle2,
    iconClassName: 'text-[#1C1F26]',
    badgeVariant: 'success' as const,
    badgeLabel: 'Delivered',
    panelClassName: 'border-[#ddd6fe] bg-[#ede9fe]/80',
    dotClassName: 'bg-[#1C1F26]',
  },
  PICKED_UP: {
    icon: CheckCircle2,
    iconClassName: 'text-[#1C1F26]',
    badgeVariant: 'secondary' as const,
    badgeLabel: 'Picked up',
    panelClassName: 'border-[#ddd6fe] bg-[#ede9fe]/80',
    dotClassName: 'bg-[#1C1F26]',
  },
  CANCELLED: {
    icon: XCircle,
    iconClassName: 'text-rose-600',
    badgeVariant: 'destructive' as const,
    badgeLabel: 'Cancelled',
    panelClassName: 'border-rose-100 bg-rose-50/80',
    dotClassName: 'bg-rose-500',
  },
};

export function OrderCard({ order }: OrderCardProps) {
  const currentStatus = statusConfig[order.status as keyof typeof statusConfig] ?? statusConfig.PENDING;
  const StatusIcon = currentStatus.icon;

  return (
    <Card className="overflow-hidden border-slate-200/70 bg-white/95">
      <CardContent className="p-0">
        <div className="grid gap-0 lg:grid-cols-[1.35fr_0.9fr]">
          <div className="border-b border-slate-200/70 p-6 lg:border-b-0 lg:border-r">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
                  <Package className="h-6 w-6" />
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Order</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">#{order.id}</h3>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600">
                    <Package className="h-4 w-4 text-slate-400" />
                    <span>Container {order.boardId} / Locker {order.lockerId}</span>
                  </div>
                </div>
              </div>

              <Badge variant={currentStatus.badgeVariant} className="self-start rounded-full px-3.5 py-1.5 text-xs uppercase tracking-[0.18em]">
                {currentStatus.badgeLabel}
              </Badge>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Pickup code</p>
                <p className="mt-3 font-mono text-lg font-semibold text-slate-950">{order.pickupCode}</p>
              </div>
              <div className={cn('rounded-2xl border p-4', currentStatus.panelClassName)}>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Current state</p>
                <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <StatusIcon className={cn('h-4 w-4', currentStatus.iconClassName)} />
                  {order.status}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Payment</p>
                <p className="mt-3 text-sm font-semibold text-slate-900">{order.paymentStatus}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">SMS</p>
                <p className="mt-3 text-sm font-semibold text-slate-900">{order.isSendSMS ? 'Sent' : 'Not sent'}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  <Smartphone className="h-4 w-4" />
                  Pickup mobile
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">{order.pickupMobile}</p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  <CalendarClock className="h-4 w-4" />
                  Created at
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Tracking</p>
                <h4 className="mt-2 text-lg font-semibold text-slate-950">Delivery timeline</h4>
              </div>
              <div className={cn('h-3 w-3 rounded-full', currentStatus.dotClassName)} />
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Created</p>
                    <p className="mt-1 text-sm text-slate-500">Order was generated</p>
                  </div>
                  <span className="text-sm font-medium text-slate-700">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Delivered</p>
                    <p className="mt-1 text-sm text-slate-500">Parcel placed in locker</p>
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : 'Pending'}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Picked up</p>
                    <p className="mt-1 text-sm text-slate-500">Customer collected parcel</p>
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {order.pickedUpAt ? new Date(order.pickedUpAt).toLocaleDateString() : 'Pending'}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                  <CreditCard className="h-4 w-4 text-slate-400" />
                  Payment checkpoint
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  The current payment state is <span className="font-medium text-slate-700">{order.paymentStatus}</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
