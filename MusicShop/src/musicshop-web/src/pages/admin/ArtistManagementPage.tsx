import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2,
  Globe,
  Loader2,
  X,
  UserCircle
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Skeleton,
  Badge
} from '@/shared/components';
import { ImageUpload } from '@/shared/components/ui/ImageUpload';
import { cn } from '@/shared/lib/utils';
import { 
  useArtists, 
  useCreateArtist, 
  useUpdateArtist, 
  useDeleteArtist 
} from '@/features/catalog/hooks/useArtists';
import { useGenres } from '@/features/catalog/hooks/useGenres';
import { Artist } from '@/features/catalog/types';

export default function ArtistManagementPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    country: '',
    bio: '',
    imageUrl: '',
    genreIds: [] as string[]
  });

  const { data: artistsData, isLoading } = useArtists();
  const { data: genresData } = useGenres(1, 100);
  
  const createArtistMutation = useCreateArtist();
  const updateArtistMutation = useUpdateArtist();
  const deleteArtistMutation = useDeleteArtist();

  const handleOpenCreate = () => {
    setEditingArtist(null);
    setFormData({ name: '', slug: '', country: '', bio: '', imageUrl: '', genreIds: [] });
    setShowForm(true);
  };

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  const handleOpenEdit = (artist: Artist) => {
    setEditingArtist(artist);
    setFormData({ 
      name: artist.name, 
      slug: artist.slug,
      country: artist.country, 
      bio: artist.bio,
      imageUrl: artist.imageUrl || '',
      genreIds: artist.genres.map(g => g.id)
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.slug) return;

    if (editingArtist) {
      updateArtistMutation.mutate(
        { 
          id: editingArtist.id, 
          data: formData
        },
        { onSuccess: () => setShowForm(false) }
      );
    } else {
      createArtistMutation.mutate(formData, {
        onSuccess: () => setShowForm(false)
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this artist profile? This will not delete their releases.')) {
      deleteArtistMutation.mutate(id);
    }
  };

  const toggleGenre = (genreId: string) => {
    setFormData(prev => ({
      ...prev,
      genreIds: prev.genreIds.includes(genreId)
        ? prev.genreIds.filter(id => id !== genreId)
        : [...prev.genreIds, genreId]
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Artists Catalog</h1>
          <p className="text-muted-foreground">Manage the creators and musical icons of your collection.</p>
        </div>
        <Button 
          onClick={handleOpenCreate} 
          className="bg-primary hover:bg-primary-dark text-primary-foreground h-12 px-6 rounded-xl shadow-lg shadow-primary/20"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Artist
        </Button>
      </div>

      {showForm && (
        <Card className="bg-surface border-primary/20 shadow-2xl animate-in zoom-in-95 duration-300">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/20">
            <CardTitle className="text-xl font-bold text-foreground">
               {editingArtist ? `Update ${editingArtist.name}` : 'Register New Artist'}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Artist Photo</label>
                <ImageUpload 
                  value={formData.imageUrl} 
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  onRemove={() => setFormData({ ...formData, imageUrl: '' })}
                  label="Drop artist photo here"
                  folder="artists"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Biography</label>
                <textarea 
                  placeholder="Tell the artist's story..."
                  className="w-full h-32 bg-muted/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-foreground resize-none text-sm"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Display Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Daft Punk"
                    className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-colors text-foreground"
                    value={formData.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        name: newName,
                        slug: editingArtist ? prev.slug : slugify(newName)
                      }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Custom URL Slug</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="e.g. daft-punk"
                      className="w-full h-12 bg-muted/30 border border-border rounded-xl pl-4 pr-12 focus:outline-none focus:border-primary transition-colors text-foreground font-mono text-xs"
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: slugify(e.target.value)})}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/50 uppercase">/artists/</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Origin Country</label>
                  <input 
                    type="text" 
                    placeholder="e.g. France"
                    className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-colors text-foreground"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Genres</label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-border rounded-xl bg-muted/10">
                    {genresData?.items.map((genre) => (
                      <button
                        key={genre.id}
                        type="button"
                        onClick={() => toggleGenre(genre.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                          formData.genreIds.includes(genre.id)
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "bg-surface text-muted-foreground border-border hover:border-primary/50"
                        )}
                      >
                        {genre.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-border">
                <Button 
                  variant="outline" 
                  className="flex-1 h-12 rounded-xl" 
                  onClick={() => setShowForm(false)}
                  disabled={createArtistMutation.isPending || updateArtistMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-[2] h-12 rounded-xl bg-primary text-white" 
                  onClick={handleSubmit}
                  disabled={createArtistMutation.isPending || updateArtistMutation.isPending || !formData.name}
                >
                  {(createArtistMutation.isPending || updateArtistMutation.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingArtist ? 'Save Profile' : 'Register Artist'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] w-full rounded-2xl" />
          ))
        ) : (
          artistsData?.items.map((artist) => (
            <Card key={artist.id} className="bg-surface border-border overflow-hidden hover:shadow-xl transition-all group relative">
              <div className="aspect-[4/3] w-full relative overflow-hidden">
                {artist.imageUrl ? (
                  <img 
                    src={artist.imageUrl} 
                    alt={artist.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <UserCircle className="h-20 w-20 text-muted-foreground/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {artist.genres.slice(0, 2).map(genre => (
                      <span key={genre.id} className="px-2 py-0.5 bg-primary/20 backdrop-blur-md border border-primary/20 rounded text-[9px] font-black uppercase tracking-tighter text-primary">
                        {genre.name}
                      </span>
                    ))}
                    {artist.genres.length > 2 && (
                      <span className="px-2 py-0.5 bg-muted/20 backdrop-blur-md border border-border/20 rounded text-[9px] font-black uppercase tracking-tighter text-white">
                        +{artist.genres.length - 2} More
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight leading-tight">{artist.name}</h3>
                  <div className="flex items-center gap-1.5 text-white/60 text-xs mt-1">
                    <Globe className="h-3 w-3" />
                    {artist.country}
                  </div>
                </div>
              </div>
              <CardContent className="p-4 flex items-center justify-between bg-surface">
                <p className="text-xs text-muted-foreground line-clamp-1 flex-1 pr-4">
                  {artist.bio || 'No biography available.'}
                </p>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={() => handleOpenEdit(artist)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-red-500"
                    onClick={() => handleDelete(artist.id)}
                    disabled={deleteArtistMutation.isPending}
                  >
                    {deleteArtistMutation.isPending && deleteArtistMutation.variables === artist.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {!isLoading && artistsData?.items.length === 0 && (
        <div className="text-center py-24 bg-muted/10 border-2 border-dashed border-border rounded-[2.5rem]">
          <div className="p-6 bg-surface border border-border rounded-3xl w-fit mx-auto mb-6 shadow-sm">
            <UserCircle className="h-12 w-12 text-muted-foreground/40" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No artists found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Your catalog is waiting for its first icon. Click "Add New Artist" to get started.
          </p>
        </div>
      )}
    </div>
  );
}

