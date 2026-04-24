import { Plus, Search, MapPin, Music, Users, AlertCircle } from 'lucide-react';
import { Button, Skeleton } from '@/shared/components';
import { ArtistForm } from './ArtistForm';
import { ArtistCard } from './ArtistCard';
import { useArtistManagement } from '../../../hooks/useArtistManagement';

export function ArtistManagement() {
  const {
    artists,
    isLoading,
    error,
    isEmpty,
    form,
    actions
  } = useArtistManagement();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-xl font-bold">Failed to load artists</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Catalog Artists</h1>
          <p className="text-muted-foreground">Manage the creators behind your music collection.</p>
        </div>
        <Button
          onClick={form.openCreate}
          className="bg-primary hover:bg-primary-dark text-primary-foreground h-12 px-6 rounded-xl shadow-lg shadow-primary/20"
        >
          <Plus className="h-5 w-5 mr-2" />
          Register Artist
        </Button>
      </div>

      {form.isOpen && (
        <ArtistForm
          editingArtist={form.editingArtist}
          onClose={form.close}
        />
      )}

      {!form.isOpen && (
        <>
          {/* Filters Bar */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
              <input
                type="text"
                placeholder="Search artists by name, country, or genre..."
                className="w-full h-14 bg-surface border border-border rounded-2xl pl-12 pr-4 focus:outline-none focus:border-primary transition-all shadow-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="h-14 px-5 rounded-2xl bg-surface border-border flex gap-2">
                <MapPin className="h-4 w-4" />
                Origin
              </Button>
              <Button variant="outline" className="h-14 px-5 rounded-2xl bg-surface border-border flex gap-2">
                <Music className="h-4 w-4" />
                Genre
              </Button>
            </div>
          </div>

          {/* Artist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-80 w-full rounded-3xl bg-muted/50" />
              ))
            ) : (
              artists.map((artist) => (
                <ArtistCard
                  key={artist.id}
                  artist={artist}
                  onEdit={form.openEdit}
                  onDelete={actions.delete}
                  isDeleting={actions.isDeleting && actions.deletingId === artist.id}
                />
              ))
            )}
          </div>

          {isEmpty && (
            <div className="text-center py-20 bg-muted/20 border-2 border-dashed border-border rounded-3xl">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">No artists found. Time to discover some talent!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
