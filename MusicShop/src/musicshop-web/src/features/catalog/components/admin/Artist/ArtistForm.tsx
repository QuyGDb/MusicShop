import { X, Loader2 } from 'lucide-react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  ImageUpload
} from '@/shared/components';
import { cn } from '@/shared/lib/utils';
import { Artist } from '@/features/catalog/types';
import { useArtistForm } from '../../../hooks/useArtistForm';
import { useGenres } from '@/features/catalog/hooks/useGenres';

interface ArtistFormProps {
  editingArtist: Artist | null;
  onClose: () => void;
}

export function ArtistForm({ editingArtist, onClose }: ArtistFormProps) {
  const { data: genresData } = useGenres(1, 100);
  const { 
    form, 
    handleNameChange, 
    toggleGenre, 
    isPending 
  } = useArtistForm({ 
    editingArtist, 
    onSuccess: onClose 
  });

  return (
    <Card className="bg-surface border-primary/20 shadow-2xl animate-in zoom-in-95 duration-300">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/20">
        <CardTitle className="text-xl font-bold text-foreground">
           {editingArtist ? `Update ${editingArtist.name}` : 'Register New Artist'}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <form.Field
            name="imageUrl"
            children={(field: any) => (
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Artist Photo</label>
                <ImageUpload 
                  value={field.state.value} 
                  onChange={(url) => field.handleChange(url)}
                  onRemove={() => field.handleChange('')}
                  label="Drop artist photo here"
                  folder="artists"
                />
              </div>
            )}
          />
          
          <form.Field
            name="bio"
            children={(field: any) => (
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Biography</label>
                <textarea 
                  placeholder="Tell the artist's story..."
                  className="w-full h-32 bg-muted/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-foreground resize-none text-sm"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          />
        </div>

        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <form.Field
              name="name"
              children={(field: any) => (
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Display Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Daft Punk"
                    className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-colors text-foreground"
                    value={field.state.value}
                    onChange={(e) => handleNameChange(e.target.value)}
                  />
                  {field.state.meta.errors && (
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{field.state.meta.errors}</p>
                  )}
                </div>
              )}
            />

            <form.Field
              name="slug"
              children={(field: any) => (
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Custom URL Slug</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="e.g. daft-punk"
                      className="w-full h-12 bg-muted/30 border border-border rounded-xl pl-4 pr-12 focus:outline-none focus:border-primary transition-colors text-foreground font-mono text-xs"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/50 uppercase">/artists/</div>
                  </div>
                </div>
              )}
            />

            <form.Field
              name="country"
              children={(field: any) => (
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Origin Country</label>
                  <input 
                    type="text" 
                    placeholder="e.g. France"
                    className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-colors text-foreground"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            />
            
            <form.Field
              name="genreIds"
              children={(field: any) => (
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
                          field.state.value.includes(genre.id)
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "bg-surface text-muted-foreground border-border hover:border-primary/50"
                        )}
                      >
                        {genre.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            />
          </div>

          <div className="flex items-center gap-3 pt-6 border-t border-border">
            <Button 
              variant="outline" 
              className="flex-1 h-12 rounded-xl" 
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button 
              className="flex-[2] h-12 rounded-xl bg-primary text-white" 
              onClick={() => form.handleSubmit()}
              disabled={isPending}
            >
              {isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {editingArtist ? 'Save Profile' : 'Register Artist'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
