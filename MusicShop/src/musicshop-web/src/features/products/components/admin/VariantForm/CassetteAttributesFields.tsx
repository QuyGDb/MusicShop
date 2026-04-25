import { UseFormRegister } from 'react-hook-form';
import { VariantFormValues } from '../../../types/variant';

interface CassetteAttributesFieldsProps {
  register: any;
}


export function CassetteAttributesFields({ register }: any) {

  return (
    <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-right-4">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">Tape Shield Color</label>
        <select 
          {...register('cassetteAttributes.tapeColor')}
          className="w-full h-11 bg-muted/30 border border-border rounded-xl px-4 text-sm"
        >
          <option value="black">Coal Black</option>
          <option value="clear">Transparent</option>
          <option value="white">Ghost White</option>
          <option value="colored">Custom Color</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">Tier</label>
        <select 
          {...register('cassetteAttributes.edition')}
          className="w-full h-11 bg-muted/30 border border-border rounded-xl px-4 text-sm"
        >
          <option value="standard">Standard Batch</option>
          <option value="limited">Limited Run</option>
        </select>
      </div>
    </div>
  );
}

