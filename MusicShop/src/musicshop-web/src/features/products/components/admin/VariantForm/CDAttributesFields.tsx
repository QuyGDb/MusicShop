import { cn } from '@/shared/lib/utils';

import { ReactFormApi } from '@tanstack/react-form';
import { VariantFormValues } from '../../../types/variant';

interface CDAttributesFieldsProps {
  form: any;
}

export function CDAttributesFields({ form }: CDAttributesFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-right-4">
      <form.Field
        name="cdAttributes.edition"
        children={(field: any) => (
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">Edition Type</label>
            <select 
              value={field.state.value} 
              onChange={(e) => field.handleChange(e.target.value as any)}
              className="w-full h-11 bg-muted/30 border border-border rounded-xl px-4 text-sm"
            >
              <option value="standard">Standard CD</option>
              <option value="deluxe">Deluxe / Digipak</option>
              <option value="box_set">Box Set</option>
            </select>
          </div>
        )}
      />
      <form.Field
        name="cdAttributes.isJapanEdition"
        children={(field: any) => (
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">Japan Market</label>
            <div 
              onClick={() => field.handleChange(!field.state.value)}
              className="h-11 bg-muted/20 border border-border rounded-xl px-4 flex items-center gap-3 cursor-pointer hover:bg-muted/30"
            >
              <div className={cn("h-4 w-4 rounded-full border-2", field.state.value ? "bg-primary border-primary" : "border-subtle")} />
              <span className="text-xs font-bold text-foreground">Japan Edition</span>
            </div>
          </div>
        )}
      />
    </div>
  );
}
