import { CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { UseFormRegister, Control, useWatch } from 'react-hook-form';
import { ProductFormValues } from '../../../types/product';

interface AvailabilitySectionProps {
  register: any;
  control: any;
}


export function AvailabilitySection({ register, control }: any) {

  const isLimited = useWatch({
    control,
    name: 'isLimited',
  });

  const isPreorder = useWatch({
    control,
    name: 'isPreorder',
  });

  return (
    <section className="space-y-6 pt-10 border-t border-border">
      <div className="flex items-center gap-2 mb-4">
        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">3</span>
        <h3 className="text-sm font-bold uppercase tracking-wider">Availability & Tags</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Limited Edition */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-border">
            <div className="flex items-center gap-3">
              <CheckCircle2 className={cn("h-5 w-5", isLimited ? "text-amber-500" : "text-subtle")} />
              <div>
                <p className="text-sm font-bold text-foreground">Limited Edition</p>
                <p className="text-[10px] text-muted-foreground uppercase">Scarce/Numbered Item</p>
              </div>
            </div>
            <input 
              type="checkbox"
              {...register('isLimited')}
              className="toggle-checkbox h-5 w-5 accent-primary"
            />
          </div>

          {isLimited && (
            <div className="space-y-2 animate-in slide-in-from-top-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-subtle">Total Quantity Ever Made</label>
              <input 
                type="number"
                {...register('limitedQty', { valueAsNumber: true })}
                placeholder="e.g. 500"
                className="w-full h-12 bg-surface border border-border rounded-xl px-4 text-sm"
              />
            </div>
          )}
        </div>

        {/* Pre-order */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-border">
            <div className="flex items-center gap-3">
              <Loader2 className={cn("h-5 w-5", isPreorder ? "text-primary" : "text-subtle")} />
              <div>
                <p className="text-sm font-bold text-foreground">Pre-order Mode</p>
                <p className="text-[10px] text-muted-foreground uppercase">Scheduled Release</p>
              </div>
            </div>
            <input 
              type="checkbox"
              {...register('isPreorder')}
              className="toggle-checkbox h-5 w-5 accent-primary"
            />
          </div>

          {isPreorder && (
            <div className="space-y-2 animate-in slide-in-from-top-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-subtle">Target Release Date</label>
              <input 
                type="date"
                {...register('preorderReleaseDate')}
                className="w-full h-12 bg-surface border border-border rounded-xl px-4 text-sm"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

