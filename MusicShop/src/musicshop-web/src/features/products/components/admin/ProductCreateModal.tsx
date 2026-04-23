import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Package, Info, Loader2, ChevronRight } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/shared/components';
import { useReleases, useReleaseVersions } from '@/features/catalog/hooks/useReleases';

// New specialized components and hooks
import { useProductForm } from '../../hooks/useProductForm';
import { CatalogReferenceSection } from './ProductForm/CatalogReferenceSection';
import { StorePresentationSection } from './ProductForm/StorePresentationSection';
import { AvailabilitySection } from './ProductForm/AvailabilitySection';

interface ProductCreateModalProps {
  onClose: () => void;
}

export function ProductCreateModal({ onClose }: ProductCreateModalProps) {
  // Data fetching for dropdowns (Shared across components)
  const { data: releasesData, isLoading: loadingReleases } = useReleases(1, 50);
  
  const {
    form,
    selectedReleaseId,
    setSelectedReleaseId,
    handleVersionChange,
    isPending,
  } = useProductForm({
    onSuccess: onClose,
    releasesData,
    versionsData: null, // Will be handled by the hook if we pass the data
  });

  // Re-fetch versions when release changes
  const { data: versionsData, isLoading: loadingVersions } = useReleaseVersions(selectedReleaseId);

  // Update hook's knowledge of versionsData (or we could have put this fetch inside the hook)
  // For simplicity here, we pass handlers down.
  
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
            <CatalogReferenceSection 
              form={form}
              selectedReleaseId={selectedReleaseId}
              setSelectedReleaseId={setSelectedReleaseId}
              loadingReleases={loadingReleases}
              releasesData={releasesData}
              loadingVersions={loadingVersions}
              versionsData={versionsData}
              onVersionChange={(id) => {
                // We need the data here to pass to handleVersionChange if it's not in a unified hook
                const version = versionsData?.find(v => v.id === id);
                const release = releasesData?.items.find(r => r.id === selectedReleaseId);
                if (version && release) {
                   form.setFieldValue('name', `${release.title} (${version.notes || version.pressingCountry})`);
                   form.setFieldValue('slug', `${release.slug}-${version.pressingCountry.toLowerCase()}-${version.id.slice(0, 4)}`);
                   form.setFieldValue('coverUrl', release.coverUrl || '');
                   form.setFieldValue('format', version.format);
                }
              }}
            />

            <StorePresentationSection form={form} />

            <AvailabilitySection form={form} />
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
                disabled={isPending}
                className="h-12 px-8 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 flex items-center gap-2 group"
              >
                {isPending ? (
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
