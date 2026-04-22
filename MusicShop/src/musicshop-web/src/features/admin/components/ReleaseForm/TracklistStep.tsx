import { ListMusic, Music, Plus, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components';

interface TracklistStepProps {
  form: any;
  onAddTrack: () => void;
  onRemoveTrack: (index: number) => void;
}

export function TracklistStep({ form, onAddTrack, onRemoveTrack }: TracklistStepProps) {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <ListMusic className="h-5 w-5 text-primary" />
          Tracklist
        </h3>
        <Button onClick={onAddTrack} variant="outline" size="sm" className="rounded-xl flex gap-2">
          <Plus className="h-4 w-4" /> Add Track
        </Button>
      </div>

      <div className="space-y-3">
        <form.Subscribe
          selector={(state: any) => state.values.tracks}
          children={(tracks: any[]) => {
            if (tracks.length === 0) {
              return (
                <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center text-muted-foreground">
                  <Music className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No tracks added yet. Start by adding the first song.</p>
                </div>
              );
            }

            return tracks.map((track, index) => (
              <div key={index} className="flex items-center gap-4 bg-muted/10 p-3 rounded-2xl border border-border/50 group hover:border-primary/30 transition-all">
                <span className="w-10 h-10 flex items-center justify-center bg-muted rounded-xl font-black text-xs text-subtle">
                  {track.position}
                </span>
                
                <form.Field
                  name={`tracks[${index}].title`}
                  children={(field: any) => (
                    <input
                      type="text"
                      placeholder="Track Title"
                      className="flex-1 bg-transparent border-none focus:outline-none font-bold placeholder:font-normal"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                />

                <div className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-lg">
                  <Clock className="h-3 w-3 text-subtle" />
                  <form.Field
                    name={`tracks[${index}].durationSeconds`}
                    children={(field: any) => (
                      <input
                        type="number"
                        placeholder="0"
                        className="w-12 bg-transparent border-none focus:outline-none text-xs font-mono text-right"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(parseInt(e.target.value) || 0)}
                      />
                    )}
                  />
                  <span className="text-[10px] text-muted-foreground">sec</span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveTrack(index)}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 transition-all rounded-lg h-10 w-10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ));
          }}
        />
      </div>
    </div>
  );
}
