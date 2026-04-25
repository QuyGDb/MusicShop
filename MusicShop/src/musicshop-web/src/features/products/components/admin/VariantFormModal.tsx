import { X, Disc, Save, Loader2, FileText, DollarSign, Hash, Info } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/shared/components';
import { cn } from '@/shared/lib/utils';
import { ProductVariant, ReleaseFormat } from '@/features/products/types';

// New specialized components and hooks
import { useVariantForm } from '../../hooks/useVariantForm';
import { VinylAttributesFields } from './VariantForm/VinylAttributesFields';
import { CDAttributesFields } from './VariantForm/CDAttributesFields';
import { CassetteAttributesFields } from './VariantForm/CassetteAttributesFields';

interface VariantFormModalProps {
  productId: string;
  format: ReleaseFormat;
  editingVariant?: ProductVariant | null;
  onClose: () => void;
}

export function VariantFormModal({ productId, format, editingVariant, onClose }: VariantFormModalProps) {
  const isEditing = !!editingVariant;
  const {
    register,
    control,
    handleSubmit,
    errors,
    isPending
  } = useVariantForm({
    productId,
    format,
    editingVariant,
    onSuccess: onClose,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-2xl bg-surface border-border shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300">
        <CardHeader className="border-b border-border bg-muted/20 flex flex-row items-center justify-between p-6 shrink-0">
          <div className="flex items-center gap-3">
             <div className="bg-amber-500/10 p-2 rounded-xl">
                <Disc className="h-6 w-6 text-amber-600" />
             </div>
             <div>
                <CardTitle className="text-xl font-bold text-foreground">
                  {isEditing ? 'Edit Variant' : 'New physical edition'}
                </CardTitle>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-black">
                  Type: {ReleaseFormat[format]}
                </p>
             </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-6 w-6" />
          </Button>
        </CardHeader>

        <CardContent className="p-0 overflow-y-auto">
          <form 
            onSubmit={handleSubmit}
            className="p-8 space-y-8"
          >
             {/* General Info Section */}
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-subtle">Edition Name</label>
                   <div className="relative">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle" />
                      <input 
                        {...register('variantName')}
                        placeholder="e.g. standard black reissue, deluxe gatefold, etc."
                        className="w-full h-12 bg-white border border-border rounded-xl pl-12 pr-4 focus:outline-none focus:border-amber-500 transition-all font-bold"
                      />
                   </div>
                   {errors.variantName && <p className="text-xs text-red-500">{errors.variantName.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-subtle">Retail Price</label>
                      <div className="relative">
                         <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                         <input 
                           type="number"
                           step="0.01"
                           {...register('price', { valueAsNumber: true })}
                           className="w-full h-12 bg-white border border-border rounded-xl pl-12 pr-4 focus:outline-none focus:border-amber-500 transition-all font-black text-foreground"
                         />
                      </div>
                      {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-subtle">Stock Quantity</label>
                      <div className="relative">
                         <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                         <input 
                           type="number"
                           {...register('stockQty', { valueAsNumber: true })}
                           className="w-full h-12 bg-white border border-border rounded-xl pl-12 pr-4 focus:outline-none focus:border-amber-500 transition-all font-bold text-foreground"
                         />
                      </div>
                      {errors.stockQty && <p className="text-xs text-red-500">{errors.stockQty.message}</p>}
                   </div>
                </div>

                <div className="flex gap-6">
                   <Controller
                     name="isSigned"
                     control={control}
                     render={({ field }) => (
                       <div 
                         onClick={() => field.onChange(!field.value)}
                         className={cn(
                           "flex-1 p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3",
                           field.value ? "border-emerald-500 bg-emerald-50" : "border-border hover:border-emerald-200 bg-white"
                         )}
                       >
                          <div className={cn("h-4 w-4 rounded border-2 flex items-center justify-center transition-colors", field.value ? "bg-emerald-500 border-emerald-500" : "border-muted-foreground")}>
                            {field.value && <div className="h-2 w-2 bg-white rounded-full" />}
                          </div>
                          <div>
                             <p className="text-xs font-black text-foreground uppercase tracking-tight">Hand Signed</p>
                             <p className="text-[9px] text-muted-foreground">Certified autograph included</p>
                          </div>
                       </div>
                     )}
                   />

                   <Controller
                     name="isAvailable"
                     control={control}
                     render={({ field }) => (
                       <div 
                         onClick={() => field.onChange(!field.value)}
                         className={cn(
                           "flex-1 p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3",
                           field.value ? "border-amber-500 bg-amber-50/5" : "border-red-200 bg-red-50/30"
                         )}
                       >
                          <div className={cn("h-4 w-4 rounded border-2 flex items-center justify-center transition-colors", field.value ? "bg-amber-500 border-amber-500" : "bg-red-500 border-red-500")}>
                            {field.value && <div className="h-2 w-2 bg-white rounded-full" />}
                          </div>
                          <div>
                             <p className="text-xs font-black text-foreground uppercase tracking-tight">Active Listing</p>
                             <p className="text-[9px] text-muted-foreground">Visible to customers</p>
                          </div>
                       </div>
                     )}
                   />
                </div>
             </div>

             {/* Dynamic Attributes Section */}
             <div className="pt-8 border-t border-border space-y-6">
                <div className="flex items-center gap-2">
                   <Info className="h-4 w-4 text-amber-500" />
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-subtle">Attributes Detail for {ReleaseFormat[format]}</h4>
                </div>

                {format === ReleaseFormat.Vinyl && <VinylAttributesFields register={register as any} />}
                {format === ReleaseFormat.CD && <CDAttributesFields register={register as any} control={control as any} />}
                {format === ReleaseFormat.Cassette && <CassetteAttributesFields register={register as any} />}

             </div>

             <div className="pt-6 flex justify-end gap-3">
                <Button variant="ghost" className="h-12 px-6 rounded-xl" onClick={onClose}>Discard</Button>
                <Button 
                   type="submit"
                   disabled={isPending}
                   className="h-12 px-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 flex gap-2"
                >
                   {isPending ? (
                     <Loader2 className="h-5 w-5 animate-spin" />
                   ) : (
                     <>
                       <Save className="h-5 w-5" />
                       {isEditing ? 'Sync Changes' : 'Publish Version'}
                     </>
                   )}
                </Button>
             </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

