'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import { isAxiosError } from 'axios';
import { Grid2x2, List, Lock, Filter, Search } from 'lucide-react';
import { createLogger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { LockerCard } from '@/components/LockerCard';

const log = createLogger('Lockers');

interface Locker {
  id: number;
  lockerNumber: string;
  status: string;
  boardId: string;
  description?: string;
}

export default function LockersPage() {
  const { isAuthenticated } = useAuth();
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchLockerNumber, setSearchLockerNumber] = useState('');
  const [selectedBoardId, setSelectedBoardId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [actionLockerId, setActionLockerId] = useState<number | null>(null);
  const [actionMessage, setActionMessage] = useState<
    | { type: 'success' | 'error'; text: string }
    | null
  >(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchLockers();
  }, [isAuthenticated]);

  const fetchLockers = async () => {
    try {
      const response = await api.get('/lockers');
      
      setLockers(response.data.data);
      setActionMessage(null);
    } catch (error) {
      log.error('Failed to fetch lockers', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/lockers/${id}/status`, { status });
      fetchLockers();
    } catch (error) {
      log.error('Failed to update locker status', error);
    }
  };

  const handleOpenLocker = async (locker: Locker) => {
    setActionLockerId(locker.id);
    setActionMessage(null);
    try {
      const response = await api.post('/lockers/open', {
        lockerNumber: locker.lockerNumber,
        boardId: locker.boardId,
      });

      setActionMessage({
        type: 'success',
        text:
          response.data?.message ||
          `Locker ${locker.lockerNumber} open request sent successfully.`,
      });
    } catch (error) {
      log.error('Failed to open locker', error);
      let message = 'Failed to open locker. Please try again.';

      if (isAxiosError(error)) {
        const responseMessage = (error.response?.data as {
          message?: string;
        })?.message;
        if (responseMessage) {
          message = responseMessage;
        }
      } else if (error instanceof Error && error.message) {
        message = error.message;
      }

      setActionMessage({ type: 'error', text: message });
    } finally {
      setActionLockerId(null);
    }
  };

  const filteredLockers = lockers.filter((locker) => {
    const matchesSearch = searchLockerNumber
      ? locker.lockerNumber.toLowerCase().includes(searchLockerNumber.toLowerCase())
      : true;
    const matchesBoard = selectedBoardId ? locker.boardId === selectedBoardId : true;
    const matchesStatus = selectedStatus ? locker.status === selectedStatus : true;

    return matchesSearch && matchesBoard && matchesStatus;
  });

  const uniqueBoardIds = [...new Set(lockers.map(l => l.boardId))];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
          <p className="mt-4 text-sm font-medium text-slate-500">Loading lockers...</p>
        </div>
      </div>
    );
  }

  const availableCount = filteredLockers.filter((locker) => locker.status === 'AVAILABLE').length;
  const occupiedCount = filteredLockers.filter((locker) => locker.status === 'OCCUPIED').length;
  const maintenanceCount = filteredLockers.filter((locker) => locker.status === 'MAINTENANCE').length;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <Card className="w-full overflow-hidden border-slate-200/70 bg-[radial-gradient(circle_at_top_left,_rgba(107,70,193,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(242,205,84,0.16),_transparent_28%),linear-gradient(135deg,_#ffffff_0%,_#faf5ff_55%,_#fffbea_100%)]">
          <CardContent className="grid w-full gap-6 p-6 lg:grid-cols-[1.2fr_0.95fr] lg:p-5">
            <div className="rounded-[18px] border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Filter className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Filter</p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-950">Locker filters</h2>
                </div>
              </div>
              <div className="mt-5 grid gap-3 lg:grid-cols-3">
                <div className="space-y-2 lg:col-span-3">
                  <label className="text-sm font-medium text-slate-700">Search locker number</label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={searchLockerNumber}
                      onChange={(e) => setSearchLockerNumber(e.target.value)}
                      placeholder="Search by locker number"
                      className="rounded-2xl border-slate-200 bg-white pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Select container</label>
                  <Select
                    value={selectedBoardId}
                    onChange={(e) => setSelectedBoardId(e.target.value)}
                    className="rounded-2xl border-slate-200"
                  >
                    <option value="">All Containers</option>
                    {uniqueBoardIds.map((boardId) => (
                      <option key={boardId} value={boardId}>{boardId}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Locker status</label>
                  <Select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="rounded-2xl border-slate-200"
                  >
                    <option value="">All Statuses</option>
                    <option value="AVAILABLE">Available</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="PENDING">Pending</option>
                  </Select>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                Showing {filteredLockers.length} locker{filteredLockers.length === 1 ? '' : 's'} in the current view.
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">View mode</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">Choose grid or list</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    onClick={() => setViewMode('list')}
                    className="rounded-xl"
                  >
                    <List className="h-4 w-4" />
                    List
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    onClick={() => setViewMode('grid')}
                    className="rounded-xl"
                  >
                    <Grid2x2 className="h-4 w-4" />
                    Grid
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-500">Total lockers</span>
                <span className="text-lg font-semibold text-slate-950">{filteredLockers.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-[#ddd6fe] bg-[#ede9fe]/80 px-4 py-3">
                <span className="text-sm font-medium text-[#1C1F26]">Available</span>
                <span className="text-lg font-semibold text-[#1C1F26]">{availableCount}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-[#ddd6fe] bg-[#ede9fe]/80 px-4 py-3">
                <span className="text-sm font-medium text-[#1C1F26]">Occupied</span>
                <span className="text-lg font-semibold text-[#1C1F26]">{occupiedCount}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-[#f2cd54]/45 bg-[#fef3c7]/80 px-4 py-3">
                <span className="text-sm font-medium text-[#a16207]">Maintenance</span>
                <span className="text-lg font-semibold text-[#a16207]">{maintenanceCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {actionMessage && (
        <div
          className={`rounded-3xl border p-4 text-sm font-medium ${
            actionMessage.type === 'success'
              ? 'border-slate-200 bg-slate-100 text-[#1C1F26]'
              : 'border-rose-200 bg-rose-50 text-rose-800'
          }`}
        >
          {actionMessage.text}
        </div>
      )}

      <div className={viewMode === 'grid' ? 'grid gap-3 md:grid-cols-2 xl:grid-cols-3' : 'space-y-2'}>
        {filteredLockers.map((locker) => (
          <LockerCard
            key={locker.id}
            locker={locker}
            onStatusChange={updateStatus}
            onOpenLocker={() => handleOpenLocker(locker)}
            isOpening={actionLockerId === locker.id}
            variant={viewMode}
          />
        ))}
      </div>

      {filteredLockers.length === 0 && (
        <Card className="border-dashed border-slate-300 bg-white/85">
          <CardContent className="py-14 text-center">
            <Lock className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-xl font-semibold text-slate-950">No lockers found</h3>
            <p className="mt-2 text-sm text-slate-500">Try adjusting your locker number, container, or status filter to see available lockers.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
