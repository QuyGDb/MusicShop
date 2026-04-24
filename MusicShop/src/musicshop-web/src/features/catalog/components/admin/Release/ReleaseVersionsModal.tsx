import { X, Package, Plus, Loader2, Trash2 } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent, Skeleton } from '@/shared/components';
import { useLabels } from '@/features/catalog/hooks/useLabels';
import { useReleaseVersions, useCreateReleaseVersion, useDeleteReleaseVersion } from '@/features/catalog/hooks/useReleases';
import { Release } from '@/features/catalog/types';

interface ReleaseVersionsModalProps {
  release: Release;
  onClose: () => void;
}

export function ReleaseVersionsModal({ release, onClose }: ReleaseVersionsModalProps) {
  const { data: labelsData } = useLabels(1, 100);
  const { data: versionsData, isLoading: loadingVersions } = useReleaseVersions(release.id);
  const addVersionMutation = useCreateReleaseVersion();
  const deleteVersionMutation = useDeleteReleaseVersion();

  const handleAddVersion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    
    addVersionMutation.mutate({
      releaseId: release.id,
      labelId: data.get('labelId'),
      format: data.get('format'),
      catalogNumber: data.get('catalogNumber'),
      pressingCountry: data.get('pressingCountry'),
      pressingYear: parseInt(data.get('pressingYear') as string),
      notes: data.get('notes')
    });
    
    form.reset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-3xl bg-surface border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        <CardHeader className="border-b border-border bg-muted/20 flex flex-row items-center justify-between p-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">Manage Editions</CardTitle>
              <p className="text-xs text-muted-foreground">Release: <span className="font-bold text-foreground">{release.title}</span></p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-6 w-6" />
          </Button>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto space-y-8">
          <Card className="border-border bg-muted/5 shadow-none">
            <CardHeader className="py-4">
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
                <Skeleton className="h-32 w-full rounded-2xl" />
              ) : versionsData?.length === 0 ? (
                <div className="col-span-full py-8 text-center text-muted-foreground text-sm border-2 border-dashed border-border rounded-2xl">
                  No editions registered yet.
                </div>
              ) : (
                versionsData?.map((v: any) => (
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
                        onClick={() => deleteVersionMutation.mutate({ id: v.id, releaseId: release.id })}
                        disabled={deleteVersionMutation.isPending}
                      >
                        {deleteVersionMutation.isPending && deleteVersionMutation.variables.id === v.id ? <Loader2 className="h-3 w-3 animate-spin"/> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
