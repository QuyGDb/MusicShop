import { useState } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Disc, Calendar, Loader2 } from 'lucide-react';
import { Button, Card, CardContent, Skeleton } from '@/shared/components';
import { useReleases, useDeleteRelease } from '../../../hooks/useReleases';
import { Release } from '../../../types';
import { ReleaseForm } from './ReleaseForm';

export function ReleaseManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingRelease, setEditingRelease] = useState<Release | null>(null);
  const [page, setPage] = useState(1);

  const { data: releasesData, isLoading } = useReleases(page, 10);
  const deleteReleaseMutation = useDeleteRelease();

  const handleOpenCreate = () => {
    setEditingRelease(null);
    setShowForm(true);
  };

  const handleOpenEdit = (release: Release) => {
    setEditingRelease(release);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this release? This will remove all associated versions and tracks.')) {
      deleteReleaseMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Releases Catalog</h1>
          <p className="text-muted-foreground">Manage your musical catalog, tracklists, and physical editions.</p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-primary hover:bg-primary-dark text-primary-foreground h-12 px-6 rounded-xl shadow-lg shadow-primary/20"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Release
        </Button>
      </div>

      {showForm ? (
        <div className="animate-in zoom-in-95 duration-300">
          <ReleaseForm
            initialData={editingRelease}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : (
        <>
          {/* Filters Bar */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
              <input
                type="text"
                placeholder="Search releases, artists, or labels..."
                className="w-full h-14 bg-surface border border-border rounded-2xl pl-12 pr-4 focus:outline-none focus:border-primary transition-all shadow-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="h-14 px-5 rounded-2xl bg-surface border-border flex gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <Button variant="outline" className="h-14 px-5 rounded-2xl bg-surface border-border flex gap-2">
                <Calendar className="h-4 w-4" />
                Latest
              </Button>
            </div>
          </div>

          {/* Releases List */}
          <div className="grid grid-cols-1 gap-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-2xl bg-muted/50" />
              ))
            ) : (
              releasesData?.items.map((release) => (
                <Card key={release.id} className="bg-surface border-border overflow-hidden hover:shadow-md transition-all group p-0">
                  <CardContent className="p-0 flex flex-col md:flex-row items-stretch">
                    {/* Cover Art */}
                    <div className="w-full md:w-32 aspect-square relative shrink-0">
                      {release.coverUrl ? (
                        <img
                          src={release.coverUrl}
                          alt={release.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Disc className="h-8 w-8 text-muted-foreground/20" />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                    </div>

                    {/* Information Cluster */}
                    <div className="flex-1 p-5 flex flex-col justify-center">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-foreground leading-tight">{release.title}</h3>
                            <span className="px-2 py-0.5 bg-muted border border-border rounded text-[10px] font-bold text-muted-foreground uppercase">
                              {release.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="font-semibold text-primary">{release.artistName}</span>
                            <span className="text-subtle">•</span>
                            <span>{release.year}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-muted-foreground hover:text-primary rounded-xl"
                            onClick={() => handleOpenEdit(release)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-muted-foreground hover:text-red-500 rounded-xl"
                            onClick={() => handleDelete(release.id)}
                            disabled={deleteReleaseMutation.isPending}
                          >
                            {deleteReleaseMutation.isPending && deleteReleaseMutation.variables === release.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {!isLoading && (releasesData?.items.length ?? 0) === 0 && (
            <div className="text-center py-20 bg-muted/10 border-2 border-dashed border-border rounded-3xl">
              <Disc className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">Your catalog is silent. Create your first release!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
