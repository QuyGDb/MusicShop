import { cn } from '@/shared/lib/utils';
import { UseFormRegister, Control, Controller } from 'react-hook-form';
import { VariantFormValues } from '../../../types/variant';

interface CDAttributesFieldsProps {
  register: any;
  control: any;
}


export function CDAttributesFields({ register, control }: any) {

  return (
    <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-right-4">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">Edition Type</label>
        <select 
          {...register('cdAttributes.edition')}
          className="w-full h-11 bg-muted/30 border border-border rounded-xl px-4 text-sm"
        >
          <option value="standard">Standard CD</option>
          <option value="deluxe">Deluxe / Digipak</option>
          <option value="box_set">Box Set</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">Japan Market</label>
        <Controller
          name="cdAttributes.isJapanEdition"
          control={control}
          render={({ field }) => (
            <div 
              onClick={() => field.onChange(!field.value)}
              className="h-11 bg-muted/20 border border-border rounded-xl px-4 flex items-center gap-3 cursor-pointer hover:bg-muted/30"
            >
              <div className={cn("h-4 w-4 rounded-full border-2", field.value ? "bg-primary border-primary" : "border-subtle")} />
              <span className="text-xs font-bold text-foreground">Japan Edition</span>
            </div>
          )}
        />
      </div>
    </div>
  );
}

