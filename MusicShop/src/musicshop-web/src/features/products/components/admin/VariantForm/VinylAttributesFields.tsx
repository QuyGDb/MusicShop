import { UseFormRegister } from 'react-hook-form';
import { VariantFormValues } from '../../../types/variant';

interface VinylAttributesFieldsProps {
  register: any;
}



export function VinylAttributesFields({ register }: any) {

  return (
    <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-right-4">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">Vinyl Color</label>
        <select 
          {...register('vinylAttributes.discColor')}
          className="w-full h-11 bg-muted/30 border border-border rounded-xl px-4 text-sm"
        >
          <option value="black">Standard Black</option>
          <option value="colored">Solid Color</option>
          <option value="splatter">Splatter / Marble</option>
          <option value="picture_disc">Picture Disc</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">Gram Weight</label>
        <select 
          {...register('vinylAttributes.weightGrams', { valueAsNumber: true })}
          className="w-full h-11 bg-muted/30 border border-border rounded-xl px-4 text-sm font-bold"
        >
          <option value={140}>140g (Standard)</option>
          <option value={180}>180g (Audiophile)</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">Format Set</label>
        <select 
          {...register('vinylAttributes.discCount')}
          className="w-full h-11 bg-muted/30 border border-border rounded-xl px-4 text-sm"
        >
          <option value="1lp">Single LP</option>
          <option value="2lp">Double LP (2LP)</option>
          <option value="box_set">Box Set</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">Packaging</label>
        <select 
          {...register('vinylAttributes.sleeveType')}
          className="w-full h-11 bg-muted/30 border border-border rounded-xl px-4 text-sm"
        >
          <option value="standard">Standard Sleeve</option>
          <option value="gatefold">Gatefold</option>
          <option value="obi_strip">With OBI Strip (Japan Style)</option>
        </select>
      </div>
    </div>
  );
}

