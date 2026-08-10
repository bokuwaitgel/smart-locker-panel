import { Plus, PackageOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ContainersEmptyStateProps {
  onAddContainer: () => void;
}

export function ContainersEmptyState({ onAddContainer }: ContainersEmptyStateProps) {
  return (
    <Card className="border-dashed border-slate-300 bg-white/80">
      <CardContent className="flex flex-col items-center justify-center py-14 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <PackageOpen className="h-8 w-8" />
        </div>
        <h3 className="mt-5 text-xl font-semibold text-slate-950">No containers yet</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          Start by creating your first container. Once added, you can manage its status directly from the vertical list below.
        </p>
        <Button onClick={onAddContainer} className="mt-6 rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-800">
          <Plus className="h-4 w-4" />
          Add container
        </Button>
      </CardContent>
    </Card>
  );
}
