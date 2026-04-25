import { X, Loader2, Building, Globe, ExternalLink, Calendar } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/shared/components';
import { Label } from '@/features/catalog/types';
import { useLabelForm } from '../../../hooks/useLabelForm';

interface LabelFormProps {
  editingLabel: Label | null;
  onClose: () => void;
}

export function LabelForm({ editingLabel, onClose }: LabelFormProps) {
  const {
    register,
    handleSubmit,
    errors,
    handleNameChange,
    isPending
  } = useLabelForm({
    editingLabel,
    onSuccess: onClose
  });

  return (
    <Card className="bg-surface border-primary/20 shadow-2xl animate-in zoom-in-95 duration-300">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/20">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
          <Building className="h-5 w-5 text-primary" />
          {editingLabel ? `Edit ${editingLabel.name}` : 'Register New Label'}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Core Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                Label Name
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder="e.g. Blue Note Records"
                className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-colors text-foreground"
                onChange={(e) => handleNameChange(e.target.value)}
              />
              {errors.name && (
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Custom URL Slug</label>
              <div className="relative">
                <input
                  type="text"
                  {...register('slug')}
                  placeholder="e.g. blue-note-records"
                  className="w-full h-12 bg-muted/30 border border-border rounded-xl pl-4 pr-12 focus:outline-none focus:border-primary transition-colors text-foreground font-mono text-xs"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/50 uppercase">/labels/</div>
              </div>
              {errors.slug && (
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{errors.slug.message}</p>
              )}
            </div>
          </div>

          {/* Right Column: Metadata */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Globe className="h-3 w-3" /> Origin Country
              </label>
              <input
                type="text"
                {...register('country')}
                placeholder="e.g. United Kingdom"
                className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-colors text-foreground"
              />
              {errors.country && (
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{errors.country.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> Founded
                </label>
                <input
                  type="number"
                  {...register('foundedYear')}
                  placeholder="1984"
                  className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-colors text-foreground"
                />
                {errors.foundedYear && (
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{errors.foundedYear.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <ExternalLink className="h-3 w-3" /> Website
                </label>
                <input
                  type="text"
                  {...register('website')}
                  placeholder="https://..."
                  className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-colors text-foreground"
                />
                {errors.website && (
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight">{errors.website.message}</p>
                )}
              </div>
            </div>
          </div>
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
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            {editingLabel ? 'Save Changes' : 'Register Label'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
