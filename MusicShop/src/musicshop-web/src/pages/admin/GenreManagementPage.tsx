import { useState } from 'react';
import { 
  Hash, 
  Plus, 
  Search, 
  X,
  Edit2, 
  Trash2,
  Tag,
  Loader2
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Skeleton
} from '@/shared/components';
import { cn } from '@/shared/lib/utils';
import { 
  useGenres, 
  useCreateGenre, 
  useUpdateGenre, 
  useDeleteGenre 
} from '@/features/catalog/hooks/useGenres';
import { Genre } from '@/features/catalog/types';

const GENRE_COLORS = [
  'bg-pink-500', 
  'bg-purple-600', 
  'bg-blue-500', 
  'bg-cyan-400', 
  'bg-red-600', 
  'bg-amber-500', 
  'bg-emerald-500'
];

export default function GenreManagementPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [genreName, setGenreName] = useState('');

  const { data: genresData, isLoading } = useGenres();
  const createGenreMutation = useCreateGenre();
  const updateGenreMutation = useUpdateGenre();
  const deleteGenreMutation = useDeleteGenre();

  const handleOpenCreate = () => {
    setEditingGenre(null);
    setGenreName('');
    setShowForm(true);
  };

  const handleOpenEdit = (genre: Genre) => {
    setEditingGenre(genre);
    setGenreName(genre.name);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!genreName) return;

    if (editingGenre) {
      updateGenreMutation.mutate(
        { id: editingGenre.id, name: genreName },
        { onSuccess: () => setShowForm(false) }
      );
    } else {
      createGenreMutation.mutate(genreName, {
        onSuccess: () => setShowForm(false)
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this genre? This might affect artists and products associated with it.')) {
      deleteGenreMutation.mutate(id);
    }
  };

  const getGenreColor = (name: string) => {
    // Deterministic color based on name
    const index = name.length % GENRE_COLORS.length;
    return GENRE_COLORS[index];
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Music Genres</h1>
          <p className="text-muted-foreground">Categorize your catalog with vibrant musical styles.</p>
        </div>
        <Button 
          onClick={handleOpenCreate} 
          className="bg-primary hover:bg-primary-dark text-primary-foreground h-12 px-6 rounded-xl shadow-lg shadow-primary/20"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Genre
        </Button>
      </div>

      {showForm && (
        <Card className="bg-surface border-primary/20 shadow-2xl max-w-lg animate-in zoom-in-95 duration-300">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/20">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              {editingGenre ? 'Update Genre' : 'New Genre'}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Genre Name</label>
              <input 
                type="text" 
                placeholder="e.g. Dream Pop"
                autoFocus
                className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-colors text-foreground"
                value={genreName}
                onChange={(e) => setGenreName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            <div className="flex items-center gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 h-12 rounded-xl" 
                onClick={() => setShowForm(false)}
                disabled={createGenreMutation.isPending || updateGenreMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                className="flex-[2] h-12 rounded-xl bg-primary text-white" 
                onClick={handleSubmit}
                disabled={createGenreMutation.isPending || updateGenreMutation.isPending || !genreName}
              >
                {(createGenreMutation.isPending || updateGenreMutation.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingGenre ? 'Update' : 'Create'} Genre
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl bg-muted/50" />
          ))
        ) : (
          genresData?.items.map((genre) => (
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
                    onClick={() => handleOpenEdit(genre)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-muted-foreground hover:text-red-500"
                    onClick={() => handleDelete(genre.id)}
                    disabled={deleteGenreMutation.isPending}
                  >
                    {deleteGenreMutation.isPending && deleteGenreMutation.variables === genre.id ? (
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
      
      {!isLoading && genresData?.items.length === 0 && (
        <div className="text-center py-20 bg-muted/20 border-2 border-dashed border-border rounded-3xl">
          <Hash className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground font-medium">No genres found. Time to create some style!</p>
        </div>
      )}
    </div>
  );
}
