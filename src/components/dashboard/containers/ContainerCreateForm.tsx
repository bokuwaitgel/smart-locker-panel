import { Package2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ContainerCreateFormProps {
  formData: {
    boardId: string;
    location: string;
    description: string;
  };
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: 'boardId' | 'location' | 'description', value: string) => void;
}

export function ContainerCreateForm({ formData, onSubmit, onChange }: ContainerCreateFormProps) {
  return (
    <Card className="border-slate-200/70 bg-white/95">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <Package2 className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Add new container</CardTitle>
            <CardDescription>Create a new container record without changing the current backend flow.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Board ID</label>
            <Input
              required
              value={formData.boardId}
              onChange={(e) => onChange('boardId', e.target.value)}
              placeholder="Enter board ID"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Location</label>
            <Input
              required
              value={formData.location}
              onChange={(e) => onChange('location', e.target.value)}
              placeholder="Enter location"
            />
          </div>
          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Enter description (optional)"
            />
          </div>
          <div className="lg:col-span-2 flex justify-end">
            <Button type="submit" className="rounded-2xl bg-slate-950 px-6 text-white hover:bg-slate-800">
              Create container
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
