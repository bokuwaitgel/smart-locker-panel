import { Bell, Menu, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardTopbarProps {
  title: string;
  isMobile: boolean;
  onOpenSidebar: () => void;
}

export function DashboardTopbar({ title, isMobile, onOpenSidebar }: DashboardTopbarProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 rounded-[32px] border border-slate-200/70 bg-white/85 p-4 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-5">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button
              onClick={onOpenSidebar}
              variant="outline"
              size="icon"
              className="h-11 w-11 rounded-2xl border-slate-200 bg-white"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Dashboard panel</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{title}</h2>
          </div>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="relative w-[320px] xl:w-[380px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input readOnly value="" placeholder="Search panel sections..." className="h-12 rounded-2xl border-slate-200 bg-white pl-11" />
          </div>
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-slate-200 bg-white">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-slate-200/70 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_35%),linear-gradient(135deg,_#ffffff_0%,_#f8fafc_55%,_#eef2ff_100%)]">
        <CardContent className="grid gap-5 p-6 lg:grid-cols-[1.35fr_0.85fr] lg:p-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              <Sparkles className="h-3.5 w-3.5" />
              Modern workspace
            </div>
            <div>
              <h3 className="text-3xl font-semibold tracking-tight text-slate-950">Clean navigation, better hierarchy, faster scanning.</h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                This shell redesign aligns the whole dashboard with the modern container experience using softer cards, cleaner spacing, and a more premium admin-panel structure.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-slate-200 bg-white/85 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Navigation</p>
              <p className="mt-3 text-lg font-semibold text-slate-950">Focused</p>
              <p className="mt-1 text-sm text-slate-500">Clear active states and balanced spacing</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/85 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Header</p>
              <p className="mt-3 text-lg font-semibold text-slate-950">Modern</p>
              <p className="mt-1 text-sm text-slate-500">Search-style utility bar and better page framing</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/85 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Experience</p>
              <p className="mt-3 text-lg font-semibold text-slate-950">Consistent</p>
              <p className="mt-1 text-sm text-slate-500">Shared visual system for future dashboard pages</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
