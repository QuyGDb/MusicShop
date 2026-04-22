import { ImageUpload } from '@/shared/components/ui/ImageUpload';
import { cn } from '@/shared/lib/utils';
import { ReleaseFormValues } from '../../types/release';

interface GeneralInfoStepProps {
  form: any; // Using any for now to simplify, or could use proper TanStack Form type
  artistsData: any;
  loadingArtists: boolean;
}

export function GeneralInfoStep({ form, artistsData, loadingArtists }: GeneralInfoStepProps) {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-4">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Release Artwork</label>
          <form.Field
            name="coverUrl"
            children={(field: any) => (
              <ImageUpload
                value={field.state.value}
                onChange={(url) => field.handleChange(url)}
                onRemove={() => field.handleChange('')}
                folder="releases"
              />
            )}
          />
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Album Title</label>
              <form.Field
                name="title"
                children={(field: any) => (
                  <input
                    type="text"
                    className="w-full h-14 bg-muted/20 border border-border rounded-2xl px-5 focus:outline-none focus:border-primary transition-all text-lg font-bold"
                    placeholder="e.g. Random Access Memories"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Artist</label>
                <form.Field
                  name="artistId"
                  children={(field: any) => (
                    <select
                      className="w-full h-14 bg-muted/20 border border-border rounded-2xl px-5 focus:outline-none focus:border-primary transition-all appearance-none"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={loadingArtists}
                    >
                      <option value="">Select Artist</option>
                      {artistsData?.items.map((a: any) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Year</label>
                <form.Field
                  name="year"
                  children={(field: any) => (
                    <input
                      type="number"
                      className="w-full h-14 bg-muted/20 border border-border rounded-2xl px-5 focus:outline-none focus:border-primary transition-all font-bold"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(parseInt(e.target.value))}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Type</label>
            <form.Field
              name="type"
              children={(field: any) => (
                <div className="flex gap-2">
                  {['Album', 'EP', 'Single', 'Compilation'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => field.handleChange(t)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                        field.state.value === t ? "bg-primary/10 border-primary text-primary" : "border-border hover:border-primary/50"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Description / Liner Notes</label>
            <form.Field
              name="description"
              children={(field: any) => (
                <textarea
                  rows={4}
                  className="w-full bg-muted/20 border border-border rounded-2xl p-5 focus:outline-none focus:border-primary transition-all resize-none text-sm"
                  placeholder="Tell the story of this release..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
