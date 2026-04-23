import { CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

import { ReactFormApi } from '@tanstack/react-form';
import { ProductFormValues } from '../../../types/product';

interface AvailabilitySectionProps {
  form: any;
}

export function AvailabilitySection({ form }: AvailabilitySectionProps) {
  return (
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
            children={(field: any) => (
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
                  className="toggle-checkbox h-5 w-5 accent-primary"
                />
              </div>
            )}
          />

          <form.Subscribe
            selector={(state: any) => state.values.isLimited}
            children={(isLimited: boolean) => isLimited && (
              <form.Field
                name="limitedQty"
                children={(field: any) => (
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
            children={(field: any) => (
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
                  className="toggle-checkbox h-5 w-5 accent-primary"
                />
              </div>
            )}
          />

          <form.Subscribe
            selector={(state: any) => state.values.isPreorder}
            children={(isPreorder: boolean) => isPreorder && (
              <form.Field
                name="preorderReleaseDate"
                children={(field: any) => (
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
  );
}
