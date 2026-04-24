import { X, Disc, ListMusic, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/shared/components';
import { cn } from '@/shared/lib/utils';
import { useArtists } from '@/features/catalog/hooks/useArtists';
import { useGenres } from '@/features/catalog/hooks/useGenres';
import { Release } from '@/features/catalog/types';

// New specialized components and hooks
import { useReleaseForm } from '../../../hooks/useReleaseForm';
import { GeneralInfoStep } from './GeneralInfoStep';
import { TracklistStep } from './TracklistStep';

interface ReleaseFormProps {
  onCancel: () => void;
  initialData?: Release | null;
}

export function ReleaseForm({ onCancel, initialData }: ReleaseFormProps) {
  const {
    form,
    step,
    setStep,
    nextStep,
    prevStep,
    handleAddTrack,
    handleRemoveTrack,
    isPending,
  } = useReleaseForm({
    initialData,
    onSuccess: onCancel
  });

  // Dependencies (Data fetching still in container/page level component is acceptable)
  const { data: artistsData, isLoading: loadingArtists } = useArtists(1, 100);
  const { data: genresData } = useGenres(1, 100);

  return (
    <Card className="bg-surface border-primary/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <CardHeader className="border-b border-border bg-muted/20 flex flex-row items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Disc className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {initialData ? `Edit ${initialData.title}` : 'Create New Release'}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("h-1.5 w-8 rounded-full", step >= 1 ? "bg-primary" : "bg-muted")} />
              <span className={cn("h-1.5 w-8 rounded-full", step >= 2 ? "bg-primary" : "bg-muted")} />
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full">
          <X className="h-6 w-6" />
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row min-h-[600px]">
          {/* Navigation Sidebar */}
          <div className="w-full md:w-64 bg-muted/10 border-r border-border p-6 space-y-2">
            {[
              { id: 1, name: 'General Info', icon: Disc },
              { id: 2, name: 'Tracklist', icon: ListMusic }
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                  step === s.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted/30"
                )}
              >
                <s.icon className="h-4 w-4" />
                {s.name}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="flex-1 p-8 max-h-[800px] overflow-y-auto custom-scrollbar">
            <form.Subscribe
              selector={(state: any) => state.canSubmit}
              children={(canSubmit: boolean) => (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                >
                  {step === 1 && (
                    <GeneralInfoStep
                      form={form}
                      artistsData={artistsData}
                      loadingArtists={loadingArtists}
                    />
                  )}

                  {step === 2 && (
                    <TracklistStep
                      form={form}
                      onAddTrack={handleAddTrack}
                      onRemoveTrack={handleRemoveTrack}
                    />
                  )}
                </form>
              )}
            />
          </div>
        </div>
      </CardContent>

      <div className="border-t border-border p-6 bg-muted/10 flex items-center justify-between">
        <Button
          variant="outline"
          className="h-12 rounded-xl px-6"
          onClick={prevStep}
          disabled={isPending}
        >
          {step > 1 ? <ChevronLeft className="h-5 w-5 mr-1" /> : null}
          {step > 1 ? 'Previous' : 'Cancel'}
        </Button>

        <div className="flex items-center gap-3">
          {step < 2 ? (
            <Button className="h-12 rounded-xl px-10 bg-primary text-white" onClick={nextStep}>
              Next Step
              <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
          ) : (
            <Button
              className="h-12 rounded-xl px-12 bg-primary text-white shadow-xl shadow-primary/30"
              onClick={() => form.handleSubmit()}
              disabled={isPending}
            >
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {initialData ? 'Save Changes' : 'Publish Release'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
