import { useState } from 'react';
import { X, Package, Plus, Loader2, Trash2, Edit2, History, Globe, Tag, Info } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent, Skeleton } from '@/shared/components';
import { useLabels } from '@/features/catalog/hooks/useLabels';
import { useReleaseVersions, useDeleteReleaseVersion, useReleaseFormats } from '@/features/catalog/hooks/useReleases';
import { Release } from '@/features/catalog/types';
import { useReleaseVersionForm } from '../../../hooks/useReleaseVersionForm';
import { cn } from '@/shared/lib/utils';

interface ReleaseVersionsModalProps {
  release: Release;
  onClose: () => void;
}

export function ReleaseVersionsModal({ release, onClose }: ReleaseVersionsModalProps) {
  const [editingVersion, setEditingVersion] = useState<any | null>(null);
  const { data: labelsData } = useLabels(1, 100);
  const { data: versionsData, isLoading: loadingVersions } = useReleaseVersions(release.id);
  const { data: formats = [], isLoading: loadingFormats } = useReleaseFormats();
  const deleteVersionMutation = useDeleteReleaseVersion();

  const {
    register,
    handleSubmit,
    errors,
    isPending,
    reset
  } = useReleaseVersionForm({
    releaseId: release.id,
    editingVersion,
    onSuccess: () => setEditingVersion(null)
  });

  const handleCancelEdit = () => {
    setEditingVersion(null);
    reset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-4xl bg-surface border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        <CardHeader className="border-b border-border bg-muted/20 flex flex-row items-center justify-between p-6 shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 p-3 rounded-2xl shadow-inner">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">Manage Editions</CardTitle>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                Release: <span className="font-bold text-primary">{release.title}</span>
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors">
            <X className="h-6 w-6" />
          </Button>
        </CardHeader>

        <CardContent className="p-0 overflow-hidden flex flex-col lg:flex-row min-h-[500px]">
          {/* Form Section */}
          <div className="w-full lg:w-[400px] border-r border-border p-6 bg-muted/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-sm uppercase tracking-widest text-primary flex items-center gap-2">
                {editingVersion ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editingVersion ? 'Edit Edition' : 'New Edition'}
              </h3>
              {editingVersion && (
                <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="h-7 text-[10px] uppercase font-bold">
                  Cancel
                </Button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                  <Tag className="h-3 w-3" /> Label
                </label>
                <select
                  {...register('labelId')}
                  className={cn(
                    "w-full h-11 bg-surface border border-border rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none",
                    errors.labelId && "border-red-500 bg-red-500/5"
                  )}
                >
                  <option value="">Select Label</option>
                  {labelsData?.items.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
                {errors.labelId && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.labelId.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                    <Package className="h-3 w-3" /> Format
                  </label>
                  <select
                    {...register('format')}
                    className="w-full h-11 bg-surface border border-border rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                  >
                    {loadingFormats ? <option>Loading...</option> : formats.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                    <History className="h-3 w-3" /> Year
                  </label>
                  <input
                    {...register('pressingYear', { valueAsNumber: true })}
                    type="number"
                    className="w-full h-11 bg-surface border border-border rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3" /> Catalog Number
                </label>
                <input
                  {...register('catalogNumber')}
                  type="text"
                  className={cn(
                    "w-full h-11 bg-surface border border-border rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all",
                    errors.catalogNumber && "border-red-500 bg-red-500/5"
                  )}
                  placeholder="e.g. WARP123"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                  <Globe className="h-3 w-3" /> Pressing Country
                </label>
                <input
                  {...register('pressingCountry')}
                  type="text"
                  className="w-full h-11 bg-surface border border-border rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="e.g. United Kingdom"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                  Notes
                </label>
                <textarea
                  {...register('notes')}
                  className="w-full h-20 bg-surface border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                  placeholder="Optional details..."
                />
              </div>

              <Button type="submit" disabled={isPending} className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all group">
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {editingVersion ? <Edit2 className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />}
                    {editingVersion ? 'Update Edition' : 'Add Edition'}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* List Section */}
          <div className="flex-1 p-6 overflow-y-auto bg-surface custom-scrollbar">
            <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
              Registered Editions
              <span className="bg-muted px-2 py-0.5 rounded-full text-[10px]">{versionsData?.length || 0}</span>
            </h3>

            {loadingVersions ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
              </div>
            ) : versionsData?.length === 0 ? (
              <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-border rounded-3xl bg-muted/5">
                <div className="bg-muted p-4 rounded-full">
                  <Package className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <p className="text-muted-foreground text-sm font-medium">No editions registered yet.<br />Add one to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {versionsData?.map((v: any) => (
                  <Card key={v.id} className={cn(
                    "bg-muted/10 border-border/50 group hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 rounded-2xl overflow-hidden",
                    editingVersion?.id === v.id && "border-primary bg-primary/5 ring-1 ring-primary/20"
                  )}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-surface flex items-center justify-center border border-border shadow-sm">
                          <span className="text-[10px] font-black">{v.format.substring(0, 3).toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">{v.format}</span>
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                              {v.catalogNumber}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                            {v.labelName} • {v.pressingCountry} ({v.pressingYear})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-primary/20 hover:text-primary"
                          onClick={() => setEditingVersion(v)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-red-500/20 hover:text-red-500"
                          onClick={() => deleteVersionMutation.mutate({ id: v.id, releaseId: release.id })}
                          disabled={deleteVersionMutation.isPending}
                        >
                          {deleteVersionMutation.isPending && deleteVersionMutation.variables?.id === v.id ?
                            <Loader2 className="h-4 w-4 animate-spin" /> :
                            <Trash2 className="h-4 w-4" />
                          }
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
