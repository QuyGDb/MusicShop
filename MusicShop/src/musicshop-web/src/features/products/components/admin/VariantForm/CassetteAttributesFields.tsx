import { ReactFormApi } from '@tanstack/react-form';
import { VariantFormValues } from '../../../types/variant';

interface CassetteAttributesFieldsProps {
  form: any;
}

export function CassetteAttributesFields({ form }: CassetteAttributesFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-right-4">
      <form.Field
        name="cassetteAttributes.tapeColor"
        children={(field: any) => (
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">Tape Shield Color</label>
            <select 
              value={field.state.value} 
              onChange={(e) => field.handleChange(e.target.value as any)}
              className="w-full h-11 bg-muted/30 border border-border rounded-xl px-4 text-sm"
            >
              <option value="black">Coal Black</option>
              <option value="clear">Transparent</option>
              <option value="white">Ghost White</option>
              <option value="colored">Custom Color</option>
            </select>
          </div>
        )}
      />
      <form.Field
        name="cassetteAttributes.edition"
        children={(field: any) => (
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">Tier</label>
            <select 
              value={field.state.value} 
              onChange={(e) => field.handleChange(e.target.value as any)}
              className="w-full h-11 bg-muted/30 border border-border rounded-xl px-4 text-sm"
            >
              <option value="standard">Standard Batch</option>
              <option value="limited">Limited Run</option>
            </select>
          </div>
        )}
      />
    </div>
  );
}
