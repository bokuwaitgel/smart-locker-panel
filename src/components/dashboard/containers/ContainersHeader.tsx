import { BellRing, Plus, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface ContainersHeaderProps {
  totalContainers: number;
  activeContainers: number;
  maintenanceContainers: number;
  onRefresh: () => void;
  onToggleForm: () => void;
  showForm: boolean;
}

export function ContainersHeader({
  totalContainers,
  activeContainers,
  maintenanceContainers,
  onRefresh,
  onToggleForm,
  showForm,
}: ContainersHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <Card className="overflow-hidden border-slate-200/70 bg-[radial-gradient(circle_at_top_left,_rgba(107,70,193,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(242,205,84,0.16),_transparent_28%),linear-gradient(135deg,_#ffffff_0%,_#faf5ff_55%,_#fffbea_100%)]">
          <CardContent className="p-0">
            <div className="flex-row gap-8 p-6 lg:grid-cols-[1.3fr_0.9fr] lg:p-8">
              <div className="space-y-5">
                <div className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 backdrop-blur-sm">
                  Container operations
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={onToggleForm}
                    className="rounded-2xl bg-[#1C1F26] px-5 text-white hover:bg-[#1C1F26]/90"
                  >
                    <Plus className="h-4 w-4" />
                    {showForm ? 'Close form' : 'Add container'}
                  </Button>
                  <Button
                    onClick={onRefresh}
                    variant="outline"
                    className="rounded-2xl border-slate-200 bg-white/80 px-5"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </div>

              <div className="space-y-4 rounded-[28px] border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur xl:p-5">
                
                <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Total</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-950">{totalContainers}</p>
                    <p className="mt-1 text-sm text-slate-500">registered containers</p>
                  </div>
                  <div className="rounded-2xl border border-[#ddd6fe] bg-[#ede9fe]/80 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#1C1F26]">Active</p>
                    <p className="mt-3 text-3xl font-semibold text-[#1C1F26]">{activeContainers}</p>
                    <p className="mt-1 text-sm text-[#1C1F26]">ready for operations</p>
                  </div>
                  <div className="rounded-2xl border border-[#f2cd54]/45 bg-[#fef3c7]/80 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#a16207]">Maintenance</p>
                    <p className="mt-3 text-3xl font-semibold text-[#a16207]">{maintenanceContainers}</p>
                    <p className="mt-1 text-sm text-[#a16207]">needs attention</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/70 bg-white/90">
          <CardContent className="flex h-full flex-col justify-between p-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Dashboard</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                A compact overview inspired by your wireframe with clean spacing and clear visual hierarchy.
              </p>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-500">Containers</span>
                <span className="text-lg font-semibold text-slate-950">{totalContainers}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-500">Operational</span>
                <span className="text-lg font-semibold text-slate-950">{activeContainers}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-500">Service queue</span>
                <span className="text-lg font-semibold text-slate-950">{maintenanceContainers}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
