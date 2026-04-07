'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import { CalendarDays, Package, Search, Filter, Sparkles, X } from 'lucide-react';
import { createLogger } from '@/lib/logger';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const log = createLogger('Orders');

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
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, isLoading]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('delivery/deliveries');
      setOrders(response.data.data);
    } catch (error) {
      log.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const normalizedSearch = searchInput.trim().toLowerCase();
    const matchesSearch = normalizedSearch
      ? [
          String(order.id),
          order.boardId,
          order.lockerId,
          order.pickupCode,
          order.status,
          order.paymentStatus,
          order.pickupMobile,
        ].some((value) => value.toLowerCase().includes(normalizedSearch))
      : true;

    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    const orderDate = order.createdAt.slice(0, 10);
    const matchesDateFrom = dateFrom ? orderDate >= dateFrom : true;
    const matchesDateTo = dateTo ? orderDate <= dateTo : true;

    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
  });
  const waitingCount = filteredOrders.filter((order) => order.status === 'WAITING').length;
  const pendingCount = filteredOrders.filter((order) => order.status === 'PENDING').length;
  const deliveredCount = filteredOrders.filter((order) => order.status === 'DELIVERED').length;
  const pickedUpCount = filteredOrders.filter((order) => order.status === 'PICKED_UP').length;

  const formatDateTime = (value?: string) => {
    if (!value) return '—';

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'success' as const;
      case 'WAITING':
        return 'warning' as const;
      case 'PICKED_UP':
        return 'default' as const;
      case 'CANCELLED':
        return 'destructive' as const;
      default:
        return 'secondary' as const;
    }
  };

  const getPaymentVariant = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'PAID':
      case 'SUCCESS':
        return 'success' as const;
      case 'FAILED':
      case 'UNPAID':
        return 'warning' as const;
      default:
        return 'outline' as const;
    }
  };

  const dateRangeLabel = dateFrom || dateTo
    ? `${dateFrom || 'Start'} - ${dateTo || 'End'}`
    : 'Choose date range';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
          <p className="mt-4 text-sm font-medium text-slate-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-visible border-slate-200/70 bg-[radial-gradient(circle_at_top_left,_rgba(107,70,193,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(242,205,84,0.16),_transparent_28%),linear-gradient(135deg,_#ffffff_0%,_#faf5ff_55%,_#fffbea_100%)]">
        <CardContent className="flex min-h-[30vh] flex-col gap-5 p-5 lg:p-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              <Sparkles className="h-3.5 w-3.5" />
              Delivery operations
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Orders management</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Review delivery progress, inspect pickup details, and filter orders by status, date, and search terms from one clean operations panel.
              </p>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
            <div className="rounded-[26px] border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Package className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Status</p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-950">Status summary</h2>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Total</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{filteredOrders.length}</p>
                </div>
                <div className="rounded-2xl border border-[#f2cd54]/45 bg-[#fef3c7]/80 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#a16207]">Waiting</p>
                  <p className="mt-2 text-xl font-semibold text-[#a16207]">{waitingCount}</p>
                </div>
                <div className="rounded-2xl border border-[#ddd6fe] bg-[#ede9fe]/80 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#1C1F26]">Pending</p>
                  <p className="mt-2 text-xl font-semibold text-[#1C1F26]">{pendingCount}</p>
                </div>
                <div className="rounded-2xl border border-[#ddd6fe] bg-[#ede9fe]/80 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#1C1F26]">Delivered</p>
                  <p className="mt-2 text-xl font-semibold text-[#1C1F26]">{deliveredCount}</p>
                </div>
                <div className="rounded-2xl border border-[#ddd6fe] bg-[#ede9fe]/80 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#1C1F26]">Picked up</p>
                  <p className="mt-2 text-xl font-semibold text-[#1C1F26]">{pickedUpCount}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/70 bg-white/80 p-4 mt-4 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Filter className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Filter</p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-950">Filter orders</h2>
                </div>
              </div>

              <div className="mt-4 flex-col gap-3 sm:flex-col xl:flex xl:items-start">
                <div className="space-y-2 sm:col-span-2 xl:col-span-1">
                  <label className="text-sm font-medium text-slate-700">Search filter</label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search order, board, locker, code, mobile"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Filter by status</label>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-2xl border-slate-200"
                  >
                    <option value="">All Statuses</option>
                    <option value="WAITING">Waiting</option>
                    <option value="PENDING">Pending</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="PICKED_UP">Picked Up</option>
                    <option value="CANCELLED">Cancelled</option>
                  </Select>
                </div>

                <div className="space-y-2 sm:col-span-2 xl:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Filter by date</label>
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between rounded-2xl border-slate-200 bg-white text-slate-700"
                      onClick={() => setIsDateDialogOpen((prev) => !prev)}
                    >
                      <span className="truncate">{dateRangeLabel}</span>
                      <CalendarDays className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

              </div>

              {isDateDialogOpen && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1F26]/12 backdrop-blur-[2px]"
                  onClick={() => setIsDateDialogOpen(false)}
                >
                  <div
                    className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_32px_80px_-32px_rgba(15,23,42,0.28)]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">Calendar filter</p>
                        <p className="mt-1 text-xs text-slate-500">Filter orders by creation date.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsDateDialogOpen(false)}
                        className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-5 space-y-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">From</label>
                          <Input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="rounded-2xl border-slate-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">To</label>
                          <Input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="rounded-2xl border-slate-200"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-2xl border-slate-200 bg-white"
                          onClick={() => {
                            setDateFrom('');
                            setDateTo('');
                          }}
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200/70 bg-white/95">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Order</TableHead>
                <TableHead>Board / Locker</TableHead>
                <TableHead>Pickup code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>SMS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-950">#{order.id}</p>
                      <p className="text-xs text-slate-500">{order.deliveredAt ? `Delivered ${formatDateTime(order.deliveredAt)}` : 'Awaiting lifecycle update'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-slate-950">Board {order.boardId}</p>
                      <p className="text-xs text-slate-500">Locker {order.lockerId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-semibold tracking-[0.16em] text-slate-950">{order.pickupCode}</p>
                      <p className="text-xs text-slate-500">Picked up {formatDateTime(order.pickedUpAt)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)} className="rounded-full px-1 py-1 uppercase tracking-[0.16em]">
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPaymentVariant(order.paymentStatus)} className="rounded-full px-1 py-1 uppercase tracking-[0.16em]">
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-slate-700">{order.pickupMobile}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-700">{formatDateTime(order.createdAt)}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.isSendSMS ? 'success' : 'secondary'} className="rounded-full px-3 py-1 uppercase tracking-[0.16em]">
                      {order.isSendSMS ? 'Sent' : 'Pending'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredOrders.length === 0 && (
        <Card className="border-dashed border-slate-300 bg-white/85">
          <CardContent className="py-14 text-center">
            <Package className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-xl font-semibold text-slate-950">No orders found</h3>
            <p className="mt-2 text-sm text-slate-500">Try adjusting your filters to see active delivery orders.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
