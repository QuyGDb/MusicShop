import { Control, UseFormRegister, Controller, FieldErrors } from 'react-hook-form';
import { ImageUpload } from '@/shared/components';
import { cn } from '@/shared/lib/utils';
import { ReleaseFormValues } from '../../../types/release';

interface GeneralInfoStepProps {
  register: UseFormRegister<ReleaseFormValues>;
  control: Control<ReleaseFormValues>;
  errors: FieldErrors<ReleaseFormValues>;
  artistsData: any;
  loadingArtists: boolean;
  genresData: any;
  loadingGenres: boolean;
  onTitleChange: (title: string) => void;
  onToggleGenre: (genreId: string) => void;
}

export function GeneralInfoStep({ 
  register, 
  control, 
  errors, 
  artistsData, 
  loadingArtists, 
  genresData,
  loadingGenres,
  onTitleChange,
  onToggleGenre
}: GeneralInfoStepProps) {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-4">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Release Artwork</label>
          <Controller
            name="coverUrl"
            control={control}
            render={({ field }) => (
              <ImageUpload
                value={field.value as string | File}
                onChange={(url) => field.onChange(url)}
                onRemove={() => field.onChange('')}
                folder="releases"
                immediate={false}
              />
            )}
          />
          {errors.coverUrl && (
            <p className="text-xs text-red-500 mt-1">{errors.coverUrl.message as string}</p>
          )}
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Album Title</label>
                <input
                  type="text"
                  {...register('title')}
                  onChange={(e) => onTitleChange(e.target.value)}
                  className="w-full h-14 bg-muted/20 border border-border rounded-2xl px-5 focus:outline-none focus:border-primary transition-all text-lg font-bold"
                  placeholder="e.g. Random Access Memories"
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">URL Slug</label>
                <input
                  type="text"
                  {...register('slug')}
                  className="w-full h-14 bg-muted/20 border border-border rounded-2xl px-5 focus:outline-none focus:border-primary transition-all font-mono text-sm"
                  placeholder="album-title-slug"
                />
                {errors.slug && (
                  <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Artist</label>
                <select
                  {...register('artistId')}
                  className="w-full h-14 bg-muted/20 border border-border rounded-2xl px-5 focus:outline-none focus:border-primary transition-all appearance-none"
                  disabled={loadingArtists}
                >
                  <option value="">Select Artist</option>
                  {artistsData?.items.map((a: any) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
                {errors.artistId && (
                  <p className="text-xs text-red-500 mt-1">{errors.artistId.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Year</label>
                <input
                  type="number"
                  {...register('year', { valueAsNumber: true })}
                  className="w-full h-14 bg-muted/20 border border-border rounded-2xl px-5 focus:outline-none focus:border-primary transition-all font-bold"
                />
                {errors.year && (
                  <p className="text-xs text-red-500 mt-1">{errors.year.message}</p>
                )}
              </div>
            </div>
          </div>


          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Genres</label>
            <Controller
              name="genreIds"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {loadingGenres ? (
                    <p className="text-xs text-muted-foreground">Loading genres...</p>
                  ) : (
                    genresData?.items.map((genre: any) => (
                      <button
                        key={genre.id}
                        type="button"
                        onClick={() => onToggleGenre(genre.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all uppercase tracking-wider",
                          field.value?.includes(genre.id)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted/10 border-border hover:border-primary/50"
                        )}
                      >
                        {genre.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            />
            {errors.genreIds && (
              <p className="text-xs text-red-500 mt-1">{errors.genreIds.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Description / Liner Notes</label>
            <textarea
              rows={4}
              {...register('description')}
              className="w-full bg-muted/20 border border-border rounded-2xl p-5 focus:outline-none focus:border-primary transition-all resize-none text-sm"
              placeholder="Tell the story of this release..."
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

