import { useState } from 'react';
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
  Clock
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/shared/components';
import { ImageUpload } from '@/shared/components/ui/ImageUpload';
import { cn } from '@/shared/lib/utils';

interface Track {
  id: string;
  position: number;
  title: string;
  duration: string;
}

interface ReleaseVersion {
  id: string;
  format: 'Vinyl' | 'CD' | 'Digital';
  price: number;
  stock: number;
  labelId: string;
  description: string;
}

interface ReleaseFormProps {
  onCancel: () => void;
  initialData?: any;
}

export default function ReleaseForm({ onCancel, initialData }: ReleaseFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    artistId: initialData?.artistId || '',
    labelId: initialData?.labelId || '',
    year: initialData?.year || new Date().getFullYear(),
    type: initialData?.type || 'Album',
    description: initialData?.description || '',
    coverUrl: initialData?.coverUrl || '',
    genreIds: initialData?.genreIds || [] as string[],
    tracks: initialData?.tracks || [] as Track[],
    versions: initialData?.versions || [] as ReleaseVersion[]
  });

  const handleAddTrack = () => {
    const newTrack: Track = {
      id: Math.random().toString(36).substr(2, 9),
      position: formData.tracks.length + 1,
      title: '',
      duration: ''
    };
    setFormData({ ...formData, tracks: [...formData.tracks, newTrack] });
  };

  const handleRemoveTrack = (id: string) => {
    setFormData({ ...formData, tracks: formData.tracks.filter(t => t.id !== id) });
  };

  const handleAddVersion = () => {
    const newVersion: ReleaseVersion = {
      id: Math.random().toString(36).substr(2, 9),
      format: 'Vinyl',
      price: 0,
      stock: 0,
      labelId: formData.labelId,
      description: ''
    };
    setFormData({ ...formData, versions: [...formData.versions, newVersion] });
  };

  const handleSave = () => {
    console.log('Saving Release:', formData);
    onCancel();
  };

  return (
    <Card className="bg-surface border-primary/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <CardHeader className="border-b border-border bg-muted/20 flex flex-row items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Disc className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
               {initialData ? 'Edit Release' : 'Create New Release'}
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
               { id: 3, name: 'Inventory & Versions', icon: Package }
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
                        onChange={(url) => setFormData({...formData, coverUrl: url})}
                        onRemove={() => setFormData({...formData, coverUrl: ''})}
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
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Artist</label>
                              <select 
                                className="w-full h-14 bg-muted/20 border border-border rounded-2xl px-5 focus:outline-none focus:border-primary transition-all appearance-none"
                                value={formData.artistId}
                                onChange={(e) => setFormData({...formData, artistId: e.target.value})}
                              >
                                <option value="">Select Artist</option>
                                <option value="1">The Midnight</option>
                                <option value="2">Gunship</option>
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Year</label>
                              <input 
                                type="number" 
                                className="w-full h-14 bg-muted/20 border border-border rounded-2xl px-5 focus:outline-none focus:border-primary transition-all"
                                value={formData.year}
                                onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                              />
                           </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Description / Liner Notes</label>
                        <textarea 
                          rows={6}
                          className="w-full bg-muted/20 border border-border rounded-2xl p-5 focus:outline-none focus:border-primary transition-all resize-none"
                          placeholder="Tell the story of this release..."
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                    <div key={track.id} className="flex items-center gap-4 bg-muted/10 p-3 rounded-2xl border border-border/50 group hover:border-primary/30 transition-all">
                       <span className="w-10 h-10 flex items-center justify-center bg-muted rounded-xl font-black text-xs text-subtle">
                         {index + 1}
                       </span>
                       <input 
                         type="text" 
                         placeholder="Track Title"
                         className="flex-1 bg-transparent border-none focus:outline-none font-bold"
                         value={track.title}
                         onChange={(e) => {
                            const newTracks = [...formData.tracks];
                            newTracks[index].title = e.target.value;
                            setFormData({...formData, tracks: newTracks});
                         }}
                       />
                       <div className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-lg">
                          <Clock className="h-3 w-3 text-subtle" />
                          <input 
                            type="text" 
                            placeholder="3:45"
                            className="w-12 bg-transparent border-none focus:outline-none text-xs font-mono"
                            value={track.duration}
                            onChange={(e) => {
                                const newTracks = [...formData.tracks];
                                newTracks[index].duration = e.target.value;
                                setFormData({...formData, tracks: newTracks});
                            }}
                          />
                       </div>
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         onClick={() => handleRemoveTrack(track.id)}
                         className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 transition-all rounded-lg"
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between">
                   <h3 className="text-xl font-bold flex items-center gap-2">
                     <Package className="h-5 w-5 text-primary" />
                     Inventory Versions
                   </h3>
                   <Button onClick={handleAddVersion} variant="outline" size="sm" className="rounded-xl flex gap-2">
                      <Plus className="h-4 w-4" /> Add Format
                   </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {formData.versions.map((version, index) => (
                     <Card key={version.id} className="bg-surface border-border shadow-sm border-l-4 border-l-primary animate-in fade-in duration-300">
                        <CardContent className="p-6 space-y-4">
                           <div className="flex items-center justify-between">
                              <select 
                                className="bg-transparent font-black text-lg focus:outline-none text-foreground"
                                value={version.format}
                                onChange={(e) => {
                                  const newVersions = [...formData.versions];
                                  newVersions[index].format = e.target.value as any;
                                  setFormData({...formData, versions: newVersions});
                                }}
                              >
                                <option>Vinyl</option>
                                <option>CD</option>
                                <option>Digital</option>
                              </select>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setFormData({...formData, versions: formData.versions.filter(v => v.id !== version.id)})}
                                className="text-red-500 h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-subtle">Price ($)</label>
                                <input 
                                  type="number" 
                                  className="w-full bg-muted/20 border-b border-border py-1 focus:border-primary outline-none font-bold"
                                  value={version.price}
                                  onChange={(e) => {
                                    const newVersions = [...formData.versions];
                                    newVersions[index].price = parseFloat(e.target.value);
                                    setFormData({...formData, versions: newVersions});
                                  }}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-subtle">Stock</label>
                                <input 
                                  type="number" 
                                  className="w-full bg-muted/20 border-b border-border py-1 focus:border-primary outline-none font-bold"
                                  value={version.stock}
                                  onChange={(e) => {
                                    const newVersions = [...formData.versions];
                                    newVersions[index].stock = parseInt(e.target.value);
                                    setFormData({...formData, versions: newVersions});
                                  }}
                                />
                              </div>
                           </div>
                           <input 
                              type="text" 
                              placeholder="Version description (e.g. 180g Red Marble)"
                              className="w-full text-xs bg-transparent border-none outline-none text-muted-foreground italic"
                              value={version.description}
                              onChange={(e) => {
                                const newVersions = [...formData.versions];
                                newVersions[index].description = e.target.value;
                                setFormData({...formData, versions: newVersions});
                              }}
                           />
                        </CardContent>
                     </Card>
                   ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <div className="border-t border-border p-6 bg-muted/10 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="h-12 rounded-xl px-6"
              onClick={() => step > 1 ? setStep(step - 1) : onCancel()}
            >
               {step > 1 ? <ChevronLeft className="h-5 w-5 mr-2" /> : null}
               {step > 1 ? 'Previous' : 'Cancel'}
            </Button>
         </div>
         <div className="flex items-center gap-3">
            {step < 3 ? (
               <Button className="h-12 rounded-xl px-10 bg-primary text-white" onClick={() => setStep(step + 1)}>
                 Next Step
                 <ChevronRight className="h-5 w-5 ml-2" />
               </Button>
            ) : (
               <Button className="h-12 rounded-xl px-12 bg-primary text-white shadow-xl shadow-primary/30" onClick={handleSave}>
                 Publish Release
               </Button>
            )}
         </div>
      </div>
    </Card>
  );
}

function Package({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
  );
}
