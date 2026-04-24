import { ArrowLeft, Package, Plus, Settings, Tag, ShieldCheck, AlertCircle, Loader2, Trash2, Edit3, Layers, ExternalLink } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent, Skeleton } from '@/shared/components';
import { cn } from '@/shared/lib/utils';
import { ReleaseFormat } from '../../types';
import { VariantFormModal } from './VariantFormModal';
import { useProductAdminDetails } from '../../hooks/useProductAdminDetails';

interface ProductAdminDetailsProps {
  productId: string;
}

/**
 * Presentational component for product administration details.
 * Logic is delegated to useProductAdminDetails hook.
 */
export function ProductAdminDetails({ productId }: ProductAdminDetailsProps) {
  const {
    product,
    isLoading,
    error,
    variantModal,
    actions
  } = useProductAdminDetails({ productId });

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <Skeleton className="h-10 w-48 bg-muted rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Skeleton className="lg:col-span-2 h-[400px] bg-muted rounded-3xl" />
           <Skeleton className="h-[400px] bg-muted rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-xl font-bold">Product not found</p>
        <Button onClick={actions.back}>Back to Inventory</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
           <button 
             onClick={actions.back}
             className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors group w-fit"
           >
              <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
              BACK TO INVENTORY
           </button>
           <div className="flex items-center gap-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{product.name}</h1>
              <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold text-primary uppercase">
                {ReleaseFormat[product.format]}
              </span>
           </div>
        </div>
        
        <div className="flex gap-3">
          <Button className="h-12 px-6 rounded-xl bg-surface border border-border text-foreground hover:bg-muted flex gap-2" onClick={actions.viewStore}>
            <ExternalLink className="h-4 w-4" />
            View Store
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Variants management */}
        <div className="lg:col-span-2 space-y-8">
           <Card className="bg-surface border-border shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="p-8 border-b border-border flex flex-row items-center justify-between bg-muted/5">
                 <div className="flex items-center gap-3">
                    <div className="bg-amber-500/10 p-2 rounded-xl">
                       <Layers className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                       <h3 className="text-lg font-bold">Product Variants</h3>
                       <p className="text-xs text-muted-foreground">Manage physical editions, colors, and stock levels.</p>
                    </div>
                 </div>
                 <Button 
                   onClick={variantModal.openAdd}
                   className="bg-primary hover:bg-primary-dark text-primary-foreground h-10 px-4 rounded-xl shadow-lg shadow-primary/20 flex gap-2"
                 >
                    <Plus className="h-4 w-4" />
                    Add Variant
                 </Button>
              </CardHeader>
              <CardContent className="p-0">
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/30">
                       <tr>
                          <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-subtle">Variant Details</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-subtle">Price</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-subtle">Stock</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-subtle text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                       {product.variants.map((variant) => (
                          <tr key={variant.id} className="hover:bg-muted/10 transition-colors group">
                             <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                   <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center border border-border">
                                      <Tag className="h-5 w-5 text-subtle" />
                                   </div>
                                   <div>
                                      <p className="text-sm font-bold text-foreground">{variant.variantName}</p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                         {variant.isSigned && (
                                           <span className="text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded leading-none">SIGNED</span>
                                         )}
                                         <span className="text-[9px] font-medium text-muted-foreground uppercase">{variant.isAvailable ? 'Available' : 'Out of Stock'}</span>
                                      </div>
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 py-5">
                                <span className="text-sm font-black text-foreground">${variant.price.toFixed(2)}</span>
                             </td>
                             <td className="px-6 py-5">
                                <div className="flex items-center gap-2">
                                   <span className={cn(
                                     "h-2 w-2 rounded-full",
                                     variant.stockQty > 10 ? "bg-emerald-500" : variant.stockQty > 0 ? "bg-amber-500" : "bg-red-500"
                                   )} />
                                   <span className="text-sm font-bold text-muted-foreground">{variant.stockQty} units</span>
                                </div>
                             </td>
                             <td className="px-6 py-5 text-right">
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <Button 
                                     variant="ghost" 
                                     size="icon" 
                                     className="h-9 w-9 rounded-lg"
                                     onClick={() => variantModal.openEdit(variant)}
                                   >
                                      <Edit3 className="h-4 w-4" />
                                   </Button>
                                   <Button 
                                     variant="ghost" 
                                     size="icon" 
                                     className="h-9 w-9 rounded-lg text-red-500 hover:bg-red-50"
                                     onClick={() => actions.deleteVariant(variant.id)}
                                     disabled={actions.isDeletingVariant}
                                   >
                                      {actions.isDeletingVariant && actions.deletingVariantId === variant.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="h-4 w-4" />
                                      )}
                                   </Button>
                                </div>
                             </td>
                          </tr>
                       ))}
                       {product.variants.length === 0 && (
                          <tr>
                             <td colSpan={4} className="px-8 py-12 text-center">
                                <AlertCircle className="h-8 w-8 mx-auto text-subtle/30 mb-2" />
                                <p className="text-sm text-muted-foreground">No variants added yet. This product cannot be sold without variants.</p>
                             </td>
                          </tr>
                       )}
                    </tbody>
                 </table>
              </CardContent>
           </Card>
        </div>

        {/* Right Column: Master Info Summary */}
        <div className="space-y-8">
           <Card className="bg-surface border-border shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="p-6 border-b border-border bg-muted/10">
                 <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold italic tracking-tight">Listing Specs</h3>
                 </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                 <div className="aspect-square rounded-2xl bg-muted border border-border overflow-hidden">
                    {product.coverUrl ? (
                      <img src={product.coverUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                         <Package className="h-10 w-10 text-muted-foreground/20" />
                      </div>
                    )}
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-muted-foreground font-medium">Status</span>
                       <span className={cn(
                         "px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                         product.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                       )}>
                         {product.isActive ? 'Active' : 'Archived'}
                       </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-muted-foreground font-medium">Format</span>
                       <span className="text-foreground font-black uppercase text-[11px]">{ReleaseFormat[product.format]}</span>
                    </div>
                    {product.isLimited && (
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-amber-600 font-bold flex items-center gap-1.5 underline decoration-amber-200 decoration-2">
                           <ShieldCheck className="h-3.5 w-3.5" />
                           Limited Ed.
                         </span>
                         <span className="text-foreground font-black">{product.limitedQty} units</span>
                      </div>
                    )}
                 </div>

                 <Button variant="outline" className="w-full h-12 rounded-xl mt-4 border-border font-bold">
                    Edit Master Info
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>

      {variantModal.isOpen && (
        <VariantFormModal 
          productId={product.id}
          format={product.format}
          editingVariant={variantModal.editingVariant}
          onClose={variantModal.close} 
        />
      )}
    </div>
  );
}
