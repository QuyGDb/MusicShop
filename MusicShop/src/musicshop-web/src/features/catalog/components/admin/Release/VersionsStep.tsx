import { Package, Plus, Loader2, Trash2 } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent, Skeleton } from '@/shared/components';

interface VersionsStepProps {
  initialData: any;
  labelsData: any;
  versionsData: any;
  loadingVersions: boolean;
  addVersionMutation: any;
  deleteVersionMutation: any;
}

export function VersionsStep({
  initialData,
  labelsData,
  versionsData,
  loadingVersions,
  addVersionMutation,
  deleteVersionMutation
}: VersionsStepProps) {
  const handleAddVersion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!initialData) return;
    
    const form = e.currentTarget;
    const data = new FormData(form);
    
    addVersionMutation.mutate({
      releaseId: initialData.id,
      labelId: data.get('labelId'),
      format: data.get('format'),
      catalogNumber: data.get('catalogNumber'),
      pressingCountry: data.get('pressingCountry'),
      pressingYear: parseInt(data.get('pressingYear') as string),
      notes: data.get('notes')
    });
    
    form.reset();
  };

  if (!initialData) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
        <Package className="h-10 w-10 text-amber-500" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-500">Save Release First</h4>
          <p className="text-sm text-muted-foreground">
            Please create the release before adding specific editions (Vinyl, CD, etc.).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <Card className="border-border bg-muted/5">
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Add New Edition</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddVersion} className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-subtle">Label</label>
              <select name="labelId" className="w-full h-10 bg-surface border border-border rounded-lg px-3 text-sm focus:border-primary outline-none" required>
                <option value="">Select Label</option>
                {labelsData?.items.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-subtle">Format</label>
              <select name="format" className="w-full h-10 bg-surface border border-border rounded-lg px-3 text-sm focus:border-primary outline-none" required>
                <option value="Vinyl">Vinyl</option>
                <option value="CD">CD</option>
                <option value="Cassette">Cassette</option>
                <option value="Digital">Digital</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-subtle">Cat Number</label>
              <input name="catalogNumber" type="text" className="w-full h-10 bg-surface border border-border rounded-lg px-3 text-sm focus:border-primary outline-none" placeholder="e.g. WARP123" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-subtle">Country</label>
              <input name="pressingCountry" type="text" className="w-full h-10 bg-surface border border-border rounded-lg px-3 text-sm focus:border-primary outline-none" placeholder="e.g. EU" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-subtle">Year</label>
              <input name="pressingYear" type="number" className="w-full h-10 bg-surface border border-border rounded-lg px-3 text-sm focus:border-primary outline-none" defaultValue={new Date().getFullYear()} required />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={addVersionMutation.isPending} className="w-full h-10 rounded-lg bg-primary text-white">
                {addVersionMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Edition
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="font-bold border-l-4 border-primary pl-3">Registered Editions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loadingVersions ? (
            <Skeleton className="h-32 w-full" />
          ) : versionsData?.map((v: any) => (
            <Card key={v.id} className="bg-surface border-border group relative">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-foreground">{v.format}</span>
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-bold">{v.catalogNumber}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{v.labelName} • {v.pressingCountry} ({v.pressingYear})</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100"
                  onClick={() => deleteVersionMutation.mutate({ id: v.id, releaseId: initialData.id })}
                  disabled={deleteVersionMutation.isPending}
                >
                  {deleteVersionMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin"/> : <Trash2 className="h-4 w-4" />}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
