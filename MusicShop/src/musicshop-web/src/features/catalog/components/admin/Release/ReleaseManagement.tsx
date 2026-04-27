import { Edit2, Trash2, Disc, Loader2, Package } from 'lucide-react';
import { Button, Card, CardContent, Skeleton, ManagementLayout, EmptyState } from '@/shared/components';
import { useReleaseManagement } from '../../../hooks/useReleaseManagement';
import { ReleaseForm } from './ReleaseForm';
import { ReleaseVersionsModal } from './ReleaseVersionsModal';

export function ReleaseManagement() {
  const {
    showForm,
    editingRelease,
    managingVersionsFor,
    releasesData,
    isLoading,
    page,
    setPage,
    totalPages,
    searchQuery,
    setSearchQuery,
    handleOpenCreate,
    handleOpenEdit,
    handleDelete,
    closeForm,
    setManagingVersionsFor,
    closeVersionsModal,
    isDeleting,
    deletingId
  } = useReleaseManagement();

  const releases = releasesData?.items ?? [];
  const isEmpty = !isLoading && releases.length === 0;

  return (
    <ManagementLayout
      title="Releases Catalog"
      subtitle="Manage your musical catalog, tracklists, and physical editions."
      createLabel="Create New Release"
      onCreate={handleOpenCreate}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Search releases, artists, or labels..."
      isLoading={isLoading}
      isEmpty={isEmpty}
      pagination={{ page, totalPages, onPageChange: setPage }}
      skeleton={Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-2xl bg-muted/50" />
      ))}
      emptyState={
        <EmptyState
          icon={Disc}
          title="No releases found"
          description="Your catalog is silent. Create your first release!"
        />
      }

    >
      {showForm ? (
        <div className="animate-in zoom-in-95 duration-300">
          <ReleaseForm
            initialData={editingRelease}
            onCancel={closeForm}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {releases.map((release) => (
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
                        title="Manage Editions"
                        className="h-10 w-10 text-muted-foreground hover:text-amber-500 rounded-xl"
                        onClick={() => setManagingVersionsFor(release)}
                      >
                        <Package className="h-4 w-4" />
                      </Button>
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
                        disabled={isDeleting}
                      >
                        {isDeleting && deletingId === release.id ? (
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
          ))}
        </div>
      )}

      {managingVersionsFor && (
        <ReleaseVersionsModal
          release={managingVersionsFor}
          onClose={closeVersionsModal}
        />
      )}
    </ManagementLayout>
  );
}
