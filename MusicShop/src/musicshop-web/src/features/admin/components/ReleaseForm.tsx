import { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Music,
  Calendar,
  UserCircle,
  Tag,
  Disc,
  ListMusic,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Clock,
  Building,
  Loader2,
  Package
} from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Skeleton
} from '@/shared/components';
import { ImageUpload } from '@/shared/components/ui/ImageUpload';
import { cn } from '@/shared/lib/utils';
import { useArtists } from '@/features/catalog/hooks/useArtists';
import { useGenres } from '@/features/catalog/hooks/useGenres';
import { useLabels } from '@/features/catalog/hooks/useLabels';
import { 
  useCreateRelease, 
  useUpdateRelease,
  useReleaseVersions,
  useCreateReleaseVersion,
  useDeleteReleaseVersion
} from '@/features/catalog/hooks/useReleases';
import { Release, Track, ReleaseVersion } from '@/features/catalog/types';

interface ReleaseFormProps {
  onCancel: () => void;
  initialData?: Release | null;
}

export function ReleaseForm({ onCancel, initialData }: ReleaseFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    artistId: '',
    year: new Date().getFullYear(),
    type: 'Album',
    description: '',
    coverUrl: '',
    genreIds: [] as string[],
    tracks: [] as { position: number; title: string; durationSeconds: number }[]
  });

  // Dependencies
  const { data: artistsData, isLoading: loadingArtists } = useArtists(1, 100);
  const { data: genresData, isLoading: loadingGenres } = useGenres(1, 100);
  const { data: labelsData, isLoading: loadingLabels } = useLabels(1, 100);

  // Mutations
  const createReleaseMutation = useCreateRelease();
  const updateReleaseMutation = useUpdateRelease();
  
  // Versions (managed separately if release exists)
  const { data: versionsData, isLoading: loadingVersions } = useReleaseVersions(initialData?.id || '');
  const addVersionMutation = useCreateReleaseVersion();
  const deleteVersionMutation = useDeleteReleaseVersion();

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        slug: initialData.slug,
        artistId: initialData.artistId,
        year: initialData.year,
        type: initialData.type,
        description: initialData.description || '',
        coverUrl: initialData.coverUrl || '',
        genreIds: [], // Need to fetch if not in the basic release object
        tracks: [] // Tracks are usually fetched via detail or on edit
      });
    }
  }, [initialData]);

  const handleAddTrack = () => {
    setFormData({
      ...formData,
      tracks: [...formData.tracks, { position: formData.tracks.length + 1, title: '', durationSeconds: 0 }]
    });
  };

  const handleRemoveTrack = (index: number) => {
    const newTracks = formData.tracks.filter((_, i) => i !== index)
      .map((t, i) => ({ ...t, position: i + 1 }));
    setFormData({ ...formData, tracks: newTracks });
  };

  const handleSave = () => {
    if (!formData.title || !formData.artistId) return;

    const payload = {
      ...formData,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-')
    };

    if (initialData) {
      updateReleaseMutation.mutate(
        { id: initialData.id, data: payload },
        { onSuccess: () => onCancel() }
      );
    } else {
      createReleaseMutation.mutate(payload, {
        onSuccess: () => onCancel()
      });
    }
  };

  const handleAddVersion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!initialData) return;
    
    const form = e.currentTarget;
    const data = new FormData(form);
    
    addVersionMutation.mutate({
      releaseId: initialData.id,
      labelId: data.get('labelId'),
      format: data.get('format'),
      catalogNumber: data.get('catalogNumber'),
      pressingCountry: data.get('pressingCountry'),
      pressingYear: parseInt(data.get('pressingYear') as string),
      notes: data.get('notes')
    });
    
    form.reset();
  };

  const isPending = createReleaseMutation.isPending || updateReleaseMutation.isPending;

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
              <span className={cn("h-1.5 w-8 rounded-full", step >= 3 ? "bg-primary" : "bg-muted")} />
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
              { id: 2, name: 'Tracklist', icon: ListMusic },
              { id: 3, name: 'Editions / Versions', icon: Package }
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
            {step === 1 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-1 space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Release Artwork</label>
                    <ImageUpload
                      value={formData.coverUrl}
                      onChange={(url) => setFormData({ ...formData, coverUrl: url })}
                      onRemove={() => setFormData({ ...formData, coverUrl: '' })}
                    />
                  </div>
                  <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Album Title</label>
                        <input
                          type="text"
                          className="w-full h-14 bg-muted/20 border border-border rounded-2xl px-5 focus:outline-none focus:border-primary transition-all text-lg font-bold"
                          placeholder="e.g. Random Access Memories"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Artist</label>
                          <select
                            className="w-full h-14 bg-muted/20 border border-border rounded-2xl px-5 focus:outline-none focus:border-primary transition-all appearance-none"
                            value={formData.artistId}
                            onChange={(e) => setFormData({ ...formData, artistId: e.target.value })}
                            disabled={loadingArtists}
                          >
                            <option value="">Select Artist</option>
                            {artistsData?.items.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Year</label>
                          <input
                            type="number"
                            className="w-full h-14 bg-muted/20 border border-border rounded-2xl px-5 focus:outline-none focus:border-primary transition-all font-bold"
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Type</label>
                      <div className="flex gap-2">
                        {['Album', 'EP', 'Single', 'Compilation'].map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setFormData({ ...formData, type: t })}
                            className={cn(
                              "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                              formData.type === t ? "bg-primary/10 border-primary text-primary" : "border-border hover:border-primary/50"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Description / Liner Notes</label>
                      <textarea
                        rows={4}
                        className="w-full bg-muted/20 border border-border rounded-2xl p-5 focus:outline-none focus:border-primary transition-all resize-none text-sm"
                        placeholder="Tell the story of this release..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <ListMusic className="h-5 w-5 text-primary" />
                    Tracklist
                  </h3>
                  <Button onClick={handleAddTrack} variant="outline" size="sm" className="rounded-xl flex gap-2">
                    <Plus className="h-4 w-4" /> Add Track
                  </Button>
                </div>

                <div className="space-y-3">
                  {formData.tracks.length === 0 && (
                    <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center text-muted-foreground">
                      <Music className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>No tracks added yet. Start by adding the first song.</p>
                    </div>
                  )}
                  {formData.tracks.map((track, index) => (
                    <div key={index} className="flex items-center gap-4 bg-muted/10 p-3 rounded-2xl border border-border/50 group hover:border-primary/30 transition-all">
                      <span className="w-10 h-10 flex items-center justify-center bg-muted rounded-xl font-black text-xs text-subtle">
                        {track.position}
                      </span>
                      <input
                        type="text"
                        placeholder="Track Title"
                        className="flex-1 bg-transparent border-none focus:outline-none font-bold placeholder:font-normal"
                        value={track.title}
                        onChange={(e) => {
                          const newTracks = [...formData.tracks];
                          newTracks[index].title = e.target.value;
                          setFormData({ ...formData, tracks: newTracks });
                        }}
                      />
                      <div className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-lg">
                        <Clock className="h-3 w-3 text-subtle" />
                        <input
                          type="text"
                          placeholder="0"
                          className="w-12 bg-transparent border-none focus:outline-none text-xs font-mono text-right"
                          value={track.durationSeconds}
                          onChange={(e) => {
                            const newTracks = [...formData.tracks];
                            newTracks[index].durationSeconds = parseInt(e.target.value) || 0;
                            setFormData({ ...formData, tracks: newTracks });
                          }}
                        />
                        <span className="text-[10px] text-muted-foreground">sec</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveTrack(index)}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 transition-all rounded-lg h-10 w-10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                {!initialData ? (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
                     <Package className="h-10 w-10 text-amber-500" />
                     <div className="space-y-1">
                        <h4 className="font-bold text-amber-500">Save Release First</h4>
                        <p className="text-sm text-muted-foreground">
                          Please create the release before adding specific editions (Vinyl, CD, etc.).
                        </p>
                     </div>
                  </div>
                ) : (
                  <>
                    <Card className="border-border bg-muted/5">
                      <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Add New Edition</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleAddVersion} className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-subtle">Label</label>
                            <select name="labelId" className="w-full h-10 bg-surface border border-border rounded-lg px-3 text-sm focus:border-primary outline-none" required>
                              <option value="">Select Label</option>
                              {labelsData?.items.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-subtle">Format</label>
                            <select name="format" className="w-full h-10 bg-surface border border-border rounded-lg px-3 text-sm focus:border-primary outline-none" required>
                              <option value="Vinyl">Vinyl</option>
                              <option value="CD">CD</option>
                              <option value="Cassette">Cassette</option>
                              <option value="Digital">Digital</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-subtle">Cat Number</label>
                            <input name="catalogNumber" type="text" className="w-full h-10 bg-surface border border-border rounded-lg px-3 text-sm focus:border-primary outline-none" placeholder="e.g. WARP123" required />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-subtle">Country</label>
                            <input name="pressingCountry" type="text" className="w-full h-10 bg-surface border border-border rounded-lg px-3 text-sm focus:border-primary outline-none" placeholder="e.g. EU" required />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-subtle">Year</label>
                            <input name="pressingYear" type="number" className="w-full h-10 bg-surface border border-border rounded-lg px-3 text-sm focus:border-primary outline-none" defaultValue={new Date().getFullYear()} required />
                          </div>
                          <div className="flex items-end">
                            <Button type="submit" disabled={addVersionMutation.isPending} className="w-full h-10 rounded-lg bg-primary text-white">
                              {addVersionMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                              Add Edition
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>

                    <div className="space-y-4">
                      <h3 className="font-bold border-l-4 border-primary pl-3">Registered Editions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {loadingVersions ? (
                          <Skeleton className="h-32 w-full" />
                        ) : versionsData?.map(v => (
                          <Card key={v.id} className="bg-surface border-border group relative">
                             <CardContent className="p-4 flex justify-between items-center">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-black text-foreground">{v.format}</span>
                                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-bold">{v.catalogNumber}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">{v.labelName} • {v.pressingCountry} ({v.pressingYear})</p>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100"
                                  onClick={() => deleteVersionMutation.mutate({ id: v.id, releaseId: initialData.id })}
                                  disabled={deleteVersionMutation.isPending}
                                >
                                  {deleteVersionMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin"/> : <Trash2 className="h-4 w-4" />}
                                </Button>
                             </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <div className="border-t border-border p-6 bg-muted/10 flex items-center justify-between">
        <Button
          variant="outline"
          className="h-12 rounded-xl px-6"
          onClick={() => step > 1 ? setStep(step - 1) : onCancel()}
          disabled={isPending}
        >
          {step > 1 ? <ChevronLeft className="h-5 w-5 mr-1" /> : null}
          {step > 1 ? 'Previous' : 'Cancel'}
        </Button>
        
        <div className="flex items-center gap-3">
          {step < 3 ? (
            <Button className="h-12 rounded-xl px-10 bg-primary text-white" onClick={() => setStep(step + 1)}>
              Next Step
              <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
          ) : (
            <Button className="h-12 rounded-xl px-12 bg-primary text-white shadow-xl shadow-primary/30" onClick={handleSave} disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {initialData ? 'Save Changes' : 'Publish Release'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function Package({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
  );
}
