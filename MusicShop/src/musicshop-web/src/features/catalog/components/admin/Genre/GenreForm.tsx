import { X, Loader2, Tag } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/shared/components';
import { Genre } from '@/features/catalog/types';
import { useGenreForm } from '../../../hooks/useGenreForm';

interface GenreFormProps {
  editingGenre: Genre | null;
  onClose: () => void;
}

export function GenreForm({ editingGenre, onClose }: GenreFormProps) {
  const {
    register,
    handleSubmit,
    errors,
    handleNameChange,
    isPending
  } = useGenreForm({
    editingGenre,
    onSuccess: onClose
  });

  return (
    <Card className="bg-surface border-primary/20 shadow-2xl max-w-lg animate-in zoom-in-95 duration-300">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/20">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
          <Tag className="h-5 w-5 text-primary" />
          {editingGenre ? 'Update Genre' : 'New Genre'}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Genre Name</label>
            <input 
              type="text" 
              {...register('name')}
              placeholder="e.g. Dream Pop"
              autoFocus
              className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-colors text-foreground"
              onChange={(e) => handleNameChange(e.target.value)}
            />
            {errors.name && (
              <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">URL Slug</label>
            <div className="relative">
              <input 
                type="text" 
                {...register('slug')}
                placeholder="dream-pop"
                className="w-full h-12 bg-muted/30 border border-border rounded-xl pl-4 pr-12 focus:outline-none focus:border-primary transition-colors text-foreground font-mono text-xs"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/50 uppercase">/genres/</div>
            </div>
            {errors.slug && (
              <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{errors.slug.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-border">
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
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            {editingGenre ? 'Update' : 'Create'} Genre
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
