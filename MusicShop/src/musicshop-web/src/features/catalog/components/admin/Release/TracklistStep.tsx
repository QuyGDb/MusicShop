import { ListMusic, Music, Plus, Clock, Trash2 } from 'lucide-react';
import { UseFormRegister, Control, FieldErrors } from 'react-hook-form';
import { Button } from '@/shared/components';
import { ReleaseFormValues } from '../../../types/release';

interface TracklistStepProps {
  register: UseFormRegister<ReleaseFormValues>;
  control: Control<ReleaseFormValues>;
  errors: FieldErrors<ReleaseFormValues>;
  fields: any[]; // Fields from useFieldArray
  onAddTrack: () => void;
  onRemoveTrack: (index: number) => void;
}

export function TracklistStep({ register, fields, onAddTrack, onRemoveTrack }: TracklistStepProps) {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <ListMusic className="h-5 w-5 text-primary" />
          Tracklist
        </h3>
        <Button type="button" onClick={onAddTrack} variant="outline" size="sm" className="rounded-xl flex gap-2">
          <Plus className="h-4 w-4" /> Add Track
        </Button>
      </div>

      <div className="space-y-3">
        {fields.length === 0 ? (
          <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center text-muted-foreground">
            <Music className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No tracks added yet. Start by adding the first song.</p>
          </div>
        ) : (
          fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-4 bg-muted/10 p-3 rounded-2xl border border-border/50 group hover:border-primary/30 transition-all">
              <span className="w-10 h-10 flex items-center justify-center bg-muted rounded-xl font-black text-xs text-subtle">
                {index + 1}
                <input type="hidden" {...register(`tracks.${index}.position` as const, { valueAsNumber: true })} />
              </span>

              <div className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-lg w-16">
                <input
                  type="text"
                  placeholder="Side"
                  {...register(`tracks.${index}.side` as const)}
                  className="w-full bg-transparent border-none focus:outline-none text-xs font-bold text-center uppercase"
                  maxLength={2}
                />
              </div>
              
              <input
                type="text"
                placeholder="Track Title"
                {...register(`tracks.${index}.title` as const)}
                className="flex-1 bg-transparent border-none focus:outline-none font-bold placeholder:font-normal"
              />

              <div className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-lg">
                <Clock className="h-3 w-3 text-subtle" />
                <input
                  type="number"
                  placeholder="0"
                  {...register(`tracks.${index}.durationSeconds` as const, { valueAsNumber: true })}
                  className="w-12 bg-transparent border-none focus:outline-none text-xs font-mono text-right"
                />
                <span className="text-[10px] text-muted-foreground">sec</span>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemoveTrack(index)}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 transition-all rounded-lg h-10 w-10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

