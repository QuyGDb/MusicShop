import { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { 
  X, 
  Tag, 
  DollarSign, 
  Hash, 
  Disc, 
  Save, 
  Loader2,
  AlertCircle,
  FileText,
  Info
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/shared/components';
import { cn } from '@/shared/lib/utils';
import { ReleaseFormat, ProductVariant } from '@/features/products/types';
import { useCreateProductVariant, useUpdateProductVariant } from '@/features/products/hooks/useProducts';

const variantBaseSchema = z.object({
  variantName: z.string().min(1, 'Name is required'),
  price: z.number().min(0.01, 'Price must be positive'),
  stockQty: z.number().min(0, 'Stock cannot be negative'),
  isSigned: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
});

// Attributes schemas
const vinylSchema = z.object({
  discColor: z.enum(['black', 'colored', 'splatter', 'picture_disc']),
  weightGrams: z.coerce.number().pipe(z.enum([140, 180])),
  speedRpm: z.coerce.number().pipe(z.enum([33, 45])),
  discCount: z.enum(['1lp', '2lp', 'box_set']),
  sleeveType: z.enum(['standard', 'gatefold', 'obi_strip']),
});

const cdSchema = z.object({
  edition: z.enum(['standard', 'deluxe', 'box_set']),
  isJapanEdition: z.boolean().default(false),
});

const cassetteSchema = z.object({
  tapeColor: z.enum(['black', 'clear', 'white', 'colored']),
  edition: z.enum(['standard', 'limited']),
});

interface VariantFormModalProps {
  productId: string;
  format: ReleaseFormat;
  editingVariant?: any;
  onClose: () => void;
}

export function VariantFormModal({ productId, format, editingVariant, onClose }: VariantFormModalProps) {
  const isEditing = !!editingVariant;
  const createMutation = useCreateProductVariant(productId);
  const updateMutation = useUpdateProductVariant(productId);

  const form = useForm({
    defaultValues: {
      variantName: editingVariant?.variantName || '',
      price: editingVariant?.price || 0,
      stockQty: editingVariant?.stockQty || 0,
      isSigned: editingVariant?.isSigned || false,
      isAvailable: editingVariant?.isAvailable ?? true,
      vinylAttributes: editingVariant?.vinylAttributes || {
        discColor: 'black',
        weightGrams: 180,
        speedRpm: 33,
        discCount: '1lp',
        sleeveType: 'standard',
      },
      cdAttributes: editingVariant?.cdAttributes || {
        edition: 'standard',
        isJapanEdition: false,
      },
      cassetteAttributes: editingVariant?.cassetteAttributes || {
        tapeColor: 'black',
        edition: 'standard',
      },
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      // Clean up attributes that don't belong to the current format before sending
      const payload: any = {
        variantName: value.variantName,
        price: value.price,
        stockQty: value.stockQty,
        isSigned: value.isSigned,
        isAvailable: value.isAvailable,
      };

      if (format === ReleaseFormat.Vinyl) payload.vinylAttributes = value.vinylAttributes;
      if (format === ReleaseFormat.CD) payload.cdAttributes = value.cdAttributes;
      if (format === ReleaseFormat.Cassette) payload.cassetteAttributes = value.cassetteAttributes;

      if (isEditing) {
        updateMutation.mutate({ variantId: editingVariant.id, data: payload }, {
          onSuccess: () => onClose()
        });
      } else {
        createMutation.mutate(payload, {
          onSuccess: () => onClose()
        });
      }
    },
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
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="p-8 space-y-8"
          >
             {/* General Info Section */}
             <div className="space-y-6">
                <form.Field
                  name="variantName"
                  children={(field) => (
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-subtle">Edition Name</label>
                       <div className="relative">
                          <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle" />
                          <input 
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g. standard black reissue, deluxe gatefold, etc."
                            className="w-full h-12 bg-white border border-border rounded-xl pl-12 pr-4 focus:outline-none focus:border-amber-500 transition-all font-bold"
                          />
                       </div>
                    </div>
                  )}
                />

                <div className="grid grid-cols-2 gap-6">
                   <form.Field
                     name="price"
                     children={(field) => (
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-subtle">Retail Price</label>
                          <div className="relative">
                             <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                             <input 
                               name={field.name}
                               type="number"
                               step="0.01"
                               value={field.state.value}
                               onBlur={field.handleBlur}
                               onChange={(e) => field.handleChange(parseFloat(e.target.value))}
                               className="w-full h-12 bg-white border border-border rounded-xl pl-12 pr-4 focus:outline-none focus:border-amber-500 transition-all font-black text-foreground"
                             />
                          </div>
                       </div>
                     )}
                   />

                   <form.Field
                     name="stockQty"
                     children={(field) => (
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-subtle">Stock Quantity</label>
                          <div className="relative">
                             <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                             <input 
                               name={field.name}
                               type="number"
                               value={field.state.value}
                               onBlur={field.handleBlur}
                               onChange={(e) => field.handleChange(parseInt(e.target.value))}
                               className="w-full h-12 bg-white border border-border rounded-xl pl-12 pr-4 focus:outline-none focus:border-amber-500 transition-all font-bold text-foreground"
                             />
                          </div>
                       </div>
                     )}
                   />
                </div>

                <div className="flex gap-6">
                   <form.Field
                     name="isSigned"
                     children={(field) => (
                       <div 
                         onClick={() => field.handleChange(!field.state.value)}
                         className={cn(
                           "flex-1 p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3",
                           field.state.value ? "border-emerald-500 bg-emerald-50" : "border-border hover:border-emerald-200 bg-white"
                         )}
                       >
                          <div className={cn("h-4 w-4 rounded border-2 flex items-center justify-center transition-colors", field.state.value ? "bg-emerald-500 border-emerald-500" : "border-muted-foreground")}>
                            {field.state.value && <div className="h-2 w-2 bg-white rounded-full" />}
                          </div>
                          <div>
                             <p className="text-xs font-black text-foreground uppercase tracking-tight">Hand Signed</p>
                             <p className="text-[9px] text-muted-foreground">Certified autograph included</p>
                          </div>
                       </div>
                     )}
                   />

                   <form.Field
                     name="isAvailable"
                     children={(field) => (
                       <div 
                         onClick={() => field.handleChange(!field.state.value)}
                         className={cn(
                           "flex-1 p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3",
                           field.state.value ? "border-amber-500 bg-amber-50/5" : "border-red-200 bg-red-50/30"
                         )}
                       >
                          <div className={cn("h-4 w-4 rounded border-2 flex items-center justify-center transition-colors", field.state.value ? "bg-amber-500 border-amber-500" : "bg-red-500 border-red-500")}>
                            {field.state.value && <div className="h-2 w-2 bg-white rounded-full" />}
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

                {format === ReleaseFormat.Vinyl && (
                   <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-right-4">
                      <form.Field
                         name="vinylAttributes.discColor"
                         children={(field) => (
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">Vinyl Color</label>
                              <select 
                                value={field.state.value} 
                                onChange={(e) => field.handleChange(e.target.value as any)}
                                className="w-full h-11 bg-muted/30 border border-border rounded-xl px-4 text-sm"
                              >
                                 <option value="black">Standard Black</option>
                                 <option value="colored">Solid Color</option>
                                 <option value="splatter">Splatter / Marble</option>
                                 <option value="picture_disc">Picture Disc</option>
                              </select>
                           </div>
                         )}
                      />
                      <form.Field
                         name="vinylAttributes.weightGrams"
                         children={(field) => (
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">Gram Weight</label>
                              <select 
                                value={field.state.value} 
                                onChange={(e) => field.handleChange(parseInt(e.target.value) as any)}
                                className="w-full h-11 bg-muted/30 border border-border rounded-xl px-4 text-sm font-bold"
                              >
                                 <option value={140}>140g (Standard)</option>
                                 <option value={180}>180g (Audiophile)</option>
                              </select>
                           </div>
                         )}
                      />
                      <form.Field
                         name="vinylAttributes.discCount"
                         children={(field) => (
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">Format Set</label>
                              <select 
                                value={field.state.value} 
                                onChange={(e) => field.handleChange(e.target.value as any)}
                                className="w-full h-11 bg-muted/30 border border-border rounded-xl px-4 text-sm"
                              >
                                 <option value="1lp">Single LP</option>
                                 <option value="2lp">Double LP (2LP)</option>
                                 <option value="box_set">Box Set</option>
                              </select>
                           </div>
                         )}
                      />
                      <form.Field
                         name="vinylAttributes.sleeveType"
                         children={(field) => (
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-tight text-muted-foreground">Packaging</label>
                              <select 
                                value={field.state.value} 
                                onChange={(e) => field.handleChange(e.target.value as any)}
                                className="w-full h-11 bg-muted/30 border border-border rounded-xl px-4 text-sm"
                              >
                                 <option value="standard">Standard Sleeve</option>
                                 <option value="gatefold">Gatefold</option>
                                 <option value="obi_strip">With OBI Strip (Japan Style)</option>
                              </select>
                           </div>
                         )}
                      />
                   </div>
                )}

                {format === ReleaseFormat.CD && (
                   <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-right-4">
                      <form.Field
                         name="cdAttributes.edition"
                         children={(field) => (
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
                         children={(field) => (
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
                )}

                {format === ReleaseFormat.Cassette && (
                   <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-right-4">
                      <form.Field
                         name="cassetteAttributes.tapeColor"
                         children={(field) => (
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
                         children={(field) => (
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
                )}
             </div>

             <div className="pt-6 flex justify-end gap-3">
                <Button variant="ghost" className="h-12 px-6 rounded-xl" onClick={onClose}>Discard</Button>
                <Button 
                   type="submit"
                   disabled={createMutation.isPending || updateMutation.isPending}
                   className="h-12 px-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 flex gap-2"
                >
                   {(createMutation.isPending || updateMutation.isPending) ? (
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
