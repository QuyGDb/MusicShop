import { Hash, Plus, Edit2, Trash2, Tag, Loader2, AlertCircle } from 'lucide-react';
import { Button, Card, CardContent, Skeleton } from '@/shared/components';
import { cn } from '@/shared/lib/utils';
import { GenreForm } from './GenreForm';
import { useGenreManagement } from '../../../hooks/useGenreManagement';

const GENRE_COLORS = [
  'bg-pink-500', 
  'bg-purple-600', 
  'bg-blue-500', 
  'bg-cyan-400', 
  'bg-red-600', 
  'bg-amber-500', 
  'bg-emerald-500'
];

/**
 * Presentational component for genre administration.
 * Logic is delegated to useGenreManagement hook.
 */
export function GenreManagement() {
  const {
    genres,
    isLoading,
    isEmpty,
    error,
    form,
    actions
  } = useGenreManagement();

  const getGenreColor = (name: string) => {
    const index = name.length % GENRE_COLORS.length;
    return GENRE_COLORS[index];
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-xl font-bold">Failed to load genres</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Music Genres</h1>
          <p className="text-muted-foreground">Categorize your catalog with vibrant musical styles.</p>
        </div>
        <Button 
          onClick={form.openCreate} 
          className="bg-primary hover:bg-primary-dark text-primary-foreground h-12 px-6 rounded-xl shadow-lg shadow-primary/20"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Genre
        </Button>
      </div>

      {form.isOpen && (
        <GenreForm 
          editingGenre={form.editingGenre} 
          onClose={form.close} 
        />
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl bg-muted/50" />
          ))
        ) : (
          genres.map((genre) => (
            <Card key={genre.id} className="bg-surface border-border hover:border-primary/30 transition-all group overflow-hidden">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shadow-inner", getGenreColor(genre.name))}>
                    <Hash className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground truncate max-w-[120px]">{genre.name}</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-tight truncate max-w-[120px]">{genre.slug}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-muted-foreground hover:text-primary"
                    onClick={() => form.openEdit(genre)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-muted-foreground hover:text-red-500"
                    onClick={() => actions.delete(genre.id)}
                    disabled={actions.isDeleting}
                  >
                    {actions.isDeleting && actions.deletingId === genre.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {isEmpty && (
        <div className="text-center py-20 bg-muted/20 border-2 border-dashed border-border rounded-3xl">
          <Hash className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground font-medium">No genres found. Time to create some style!</p>
        </div>
      )}
    </div>
  );
}
