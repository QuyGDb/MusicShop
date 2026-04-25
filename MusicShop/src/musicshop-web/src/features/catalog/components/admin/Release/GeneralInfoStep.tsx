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
}

export function GeneralInfoStep({ register, control, errors, artistsData, loadingArtists }: GeneralInfoStepProps) {
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
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Album Title</label>
              <input
                type="text"
                {...register('title')}
                className="w-full h-14 bg-muted/20 border border-border rounded-2xl px-5 focus:outline-none focus:border-primary transition-all text-lg font-bold"
                placeholder="e.g. Random Access Memories"
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
              )}
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
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Type</label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  {['Album', 'EP', 'Single', 'Compilation'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => field.onChange(t)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                        field.value === t ? "bg-primary/10 border-primary text-primary" : "border-border hover:border-primary/50"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.type && (
              <p className="text-xs text-red-500 mt-1">{errors.type.message}</p>
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

