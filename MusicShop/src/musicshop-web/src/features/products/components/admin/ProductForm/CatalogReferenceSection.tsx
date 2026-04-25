import { cn } from '@/shared/lib/utils';
import { Release, ReleaseVersion } from '@/features/catalog/types';
import { UseFormRegister, Control, Controller } from 'react-hook-form';
import { ProductFormValues } from '../../../types/product';

interface CatalogReferenceSectionProps {
  register: any;
  control: any;
  selectedReleaseId: string;
  setSelectedReleaseId: (id: string) => void;
  loadingReleases: boolean;
  releasesData: { items: Release[] } | undefined;
  loadingVersions: boolean;
  versionsData: ReleaseVersion[] | undefined;
  onVersionChange: (id: string) => void;
}


export function CatalogReferenceSection({
  register,
  control,
  selectedReleaseId,
  setSelectedReleaseId,
  loadingReleases,
  releasesData,
  loadingVersions,
  versionsData,
  onVersionChange,
}: any) {

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">1</span>
        <h3 className="text-sm font-bold uppercase tracking-wider">Select Catalog Reference</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              releasesData?.items.map((r: any) => (
                <option key={r.id} value={r.id}>{r.title} - {r.artistName}</option>
              ))
            )}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-subtle">Specific Version (Pressing)</label>
          <Controller
            name="releaseVersionId"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <select 
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    onVersionChange(e.target.value);
                  }}
                  disabled={!selectedReleaseId}
                  className={cn(
                    "w-full h-12 bg-muted/50 border rounded-xl px-4 focus:outline-none transition-all text-sm",
                    fieldState.error ? "border-red-500" : "border-border focus:border-primary"
                  )}
                >
                  <option value="">Select a variant from catalog...</option>
                  {loadingVersions ? (
                    <option disabled>Loading versions...</option>
                  ) : (
                    versionsData?.map((v: any) => (
                      <option key={v.id} value={v.id}>{v.pressingCountry} ({v.pressingYear}) - {v.labelName}</option>
                    ))
                  )}
                </select>
                {fieldState.error && (
                  <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-tight">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>
      </div>
    </section>
  );
}

