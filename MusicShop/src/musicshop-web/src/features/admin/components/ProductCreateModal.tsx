import { useState, useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { 
  X, 
  Package, 
  Music, 
  Info, 
  Layers, 
  AlertCircle,
  Loader2,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/shared/components';
import { cn } from '@/shared/lib/utils';
import { useReleases, useReleaseVersions } from '@/features/catalog/hooks/useReleases';
import { useCreateProduct } from '@/features/products/hooks/useProducts';
import { ReleaseFormat } from '@/features/products/types';
import { useNavigate } from 'react-router-dom';

const productSchema = z.object({
  releaseVersionId: z.string().uuid('Please select a specific release version'),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().optional(),
  coverUrl: z.string().optional(),
  format: z.nativeEnum(ReleaseFormat),
  isLimited: z.boolean().default(false),
  limitedQty: z.number().optional().nullable(),
  isPreorder: z.boolean().default(false),
  preorderReleaseDate: z.string().optional().nullable(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductCreateModalProps {
  onClose: () => void;
}

export function ProductCreateModal({ onClose }: ProductCreateModalProps) {
  const [selectedReleaseId, setSelectedReleaseId] = useState<string>('');
  const navigate = useNavigate();
  const createProduct = useCreateProduct();

  // Data fetching for dropdowns
  const { data: releasesData, isLoading: loadingReleases } = useReleases(1, 50);
  const { data: versionsData, isLoading: loadingVersions } = useReleaseVersions(selectedReleaseId);

  const form = useForm({
    defaultValues: {
      releaseVersionId: '',
      name: '',
      slug: '',
      description: '',
      coverUrl: '',
      format: ReleaseFormat.Vinyl,
      isLimited: false,
      limitedQty: null,
      isPreorder: false,
      preorderReleaseDate: null,
    } as ProductFormValues,
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      createProduct.mutate(value, {
        onSuccess: (newProductId) => {
          // Success toast is handled in the hook
          onClose();
          // Navigate to details page to add variants (Step 2)
          navigate(`/admin/products/${newProductId}`);
        }
      });
    },
  });

  // Effect to auto-fill name/slug/cover when a version is selected
  const handleVersionChange = (versionId: string) => {
    const version = versionsData?.find(v => v.id === versionId);
    const release = releasesData?.items.find(r => r.id === selectedReleaseId);
    
    if (version && release) {
      form.setFieldValue('name', `${release.title} (${version.notes || version.pressingCountry})`);
      form.setFieldValue('slug', `${release.slug}-${version.pressingCountry.toLowerCase()}-${version.id.slice(0, 4)}`);
      form.setFieldValue('coverUrl', release.coverUrl || '');
      form.setFieldValue('format', version.format);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-3xl bg-surface border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        <CardHeader className="border-b border-border bg-muted/20 flex flex-row items-center justify-between p-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">New Product Listing</CardTitle>
              <p className="text-xs text-muted-foreground">Step 1: Define Master Product info from Catalog</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-6 w-6" />
          </Button>
        </CardHeader>

        <CardContent className="p-0 overflow-y-auto">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="p-8 space-y-10"
          >
            {/* Step Selection: Catalog Hook */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">1</span>
                <h3 className="text-sm font-bold uppercase tracking-wider">Select Catalog Reference</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Release Dropdown */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-subtle">Release (Album)</label>
                    <select 
                      value={selectedReleaseId}
                      onChange={(e) => setSelectedReleaseId(e.target.value)}
                      className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-all text-sm"
                    >
                      <option value="">Choose a Release...</option>
                      {loadingReleases ? (
                        <option disabled>Loading releases...</option>
                      ) : (
                        releasesData?.items.map(r => (
                          <option key={r.id} value={r.id}>{r.title} - {r.artistName}</option>
                        ))
                      )}
                    </select>
                 </div>

                 {/* Version Dropdown */}
                 <form.Field
                   name="releaseVersionId"
                   children={(field) => (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-subtle">Specific Version (Pressing)</label>
                      <select 
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          handleVersionChange(e.target.value);
                        }}
                        disabled={!selectedReleaseId}
                        className={cn(
                          "w-full h-12 bg-muted/50 border rounded-xl px-4 focus:outline-none transition-all text-sm",
                          field.state.meta.errors.length ? "border-red-500" : "border-border focus:border-primary"
                        )}
                      >
                        <option value="">Select a variant from catalog...</option>
                        {loadingVersions ? (
                          <option disabled>Loading versions...</option>
                        ) : (
                          versionsData?.map(v => (
                            <option key={v.id} value={v.id}>{v.pressingCountry} ({v.pressingYear}) - {v.labelName}</option>
                          ))
                        )}
                      </select>
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-tight">{field.state.meta.errors[0]}</p>
                      )}
                    </div>
                   )}
                 />
              </div>
            </section>

            {/* General Info */}
            <section className="space-y-6 pt-10 border-t border-border">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">2</span>
                <h3 className="text-sm font-bold uppercase tracking-wider">Store Presentation</h3>
              </div>

              <div className="space-y-6">
                <form.Field
                  name="name"
                  children={(field) => (
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-subtle">Product Title (Display Name)</label>
                       <input 
                         name={field.name}
                         value={field.state.value}
                         onBlur={field.handleBlur}
                         onChange={(e) => field.handleChange(e.target.value)}
                         placeholder="e.g. Dark Side of the Moon (Japan Pressing)"
                         className="w-full h-14 bg-surface border border-border rounded-2xl px-6 focus:outline-none focus:border-primary transition-all shadow-sm"
                       />
                       {field.state.meta.errors.length > 0 && (
                        <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-tight">{field.state.meta.errors[0]}</p>
                      )}
                    </div>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <form.Field
                    name="slug"
                    children={(field) => (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-subtle">URL Slug</label>
                        <input 
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value.toLowerCase().replace(/ /g, '-'))}
                          className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 text-sm font-mono"
                        />
                      </div>
                    )}
                  />

                  <form.Field
                    name="format"
                    children={(field) => (
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-subtle">Product Format</label>
                         <div className="h-12 bg-muted/30 border border-border rounded-xl px-4 flex items-center text-sm font-bold text-primary italic">
                            <Layers className="h-4 w-4 mr-2" />
                            {ReleaseFormat[field.state.value]}
                         </div>
                      </div>
                    )}
                  />
                </div>
              </div>
            </section>

            {/* Status & Options */}
            <section className="space-y-6 pt-10 border-t border-border">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">3</span>
                <h3 className="text-sm font-bold uppercase tracking-wider">Availability & Tags</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Limited Edition */}
                <div className="space-y-4">
                  <form.Field
                    name="isLimited"
                    children={(field) => (
                      <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-border">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className={cn("h-5 w-5", field.state.value ? "text-amber-500" : "text-subtle")} />
                          <div>
                            <p className="text-sm font-bold text-foreground">Limited Edition</p>
                            <p className="text-[10px] text-muted-foreground uppercase">Scarce/Numbered Item</p>
                          </div>
                        </div>
                        <input 
                          type="checkbox"
                          checked={field.state.value}
                          onChange={(e) => field.handleChange(e.target.checked)}
                          className="toggle-checkbox" // Assuming we have a standard toggle style
                        />
                      </div>
                    )}
                  />

                  <form.Subscribe
                    selector={(state) => state.values.isLimited}
                    children={(isLimited) => isLimited && (
                      <form.Field
                        name="limitedQty"
                        children={(field) => (
                          <div className="space-y-2 animate-in slide-in-from-top-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-subtle">Total Quantity Ever Made</label>
                            <input 
                              type="number"
                              value={field.state.value || ''}
                              onChange={(e) => field.handleChange(parseInt(e.target.value))}
                              placeholder="e.g. 500"
                              className="w-full h-12 bg-surface border border-border rounded-xl px-4 text-sm"
                            />
                          </div>
                        )}
                      />
                    )}
                  />
                </div>

                {/* Pre-order */}
                <div className="space-y-4">
                  <form.Field
                    name="isPreorder"
                    children={(field) => (
                      <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-border">
                        <div className="flex items-center gap-3">
                          <Loader2 className={cn("h-5 w-5", field.state.value ? "text-primary" : "text-subtle")} />
                          <div>
                            <p className="text-sm font-bold text-foreground">Pre-order Mode</p>
                            <p className="text-[10px] text-muted-foreground uppercase">Scheduled Release</p>
                          </div>
                        </div>
                        <input 
                          type="checkbox"
                          checked={field.state.value}
                          onChange={(e) => field.handleChange(e.target.checked)}
                          className="toggle-checkbox"
                        />
                      </div>
                    )}
                  />

                  <form.Subscribe
                    selector={(state) => state.values.isPreorder}
                    children={(isPreorder) => isPreorder && (
                      <form.Field
                        name="preorderReleaseDate"
                        children={(field) => (
                          <div className="space-y-2 animate-in slide-in-from-top-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-subtle">Target Release Date</label>
                            <input 
                              type="date"
                              value={field.state.value || ''}
                              onChange={(e) => field.handleChange(e.target.value)}
                              className="w-full h-12 bg-surface border border-border rounded-xl px-4 text-sm"
                            />
                          </div>
                        )}
                      />
                    )}
                  />
                </div>
              </div>
            </section>
          </form>
        </CardContent>

        <div className="p-6 border-t border-border bg-muted/20 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-4 text-xs text-muted-foreground">
             <Info className="h-4 w-4 text-primary" />
             <p>Listing a product creates a retail entry. <strong>Variants</strong> will be managed in next step.</p>
           </div>
           
           <div className="flex gap-3">
              <Button variant="ghost" className="h-12 px-6 rounded-xl hover:bg-muted" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={() => form.handleSubmit()}
                disabled={createProduct.isPending}
                className="h-12 px-8 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 flex items-center gap-2 group"
              >
                {createProduct.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Next: Add Variants
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
           </div>
        </div>
      </Card>
    </div>
  );
}
