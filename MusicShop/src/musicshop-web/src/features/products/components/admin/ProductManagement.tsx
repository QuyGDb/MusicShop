import { Plus, Search, Filter, Edit2, Trash2, Package, Loader2, Tag, AlertCircle } from 'lucide-react';
import { Button, Card, CardContent, Skeleton } from '@/shared/components';
import { cn } from '@/shared/lib/utils';
import { Product } from '../../types';
import { ProductCreateModal } from './ProductCreateModal';
import { useProductManagement } from '../../hooks/useProductManagement';

/**
 * Presentational component for store inventory management.
 * Logic is delegated to useProductManagement hook.
 */
export function ProductManagement() {
  const {
    products,
    isLoading,
    error,
    isEmpty,
    showForm,
    openCreate,
    closeForm,
    openEdit,
    delete: handleDelete,
    isDeleting,
    deletingId
  } = useProductManagement();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-xl font-bold">Failed to load products</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Store Inventory</h1>
          <p className="text-muted-foreground">Manage products, stock levels, and store pricing.</p>
        </div>
        <Button 
          onClick={openCreate} 
          className="bg-primary hover:bg-primary-dark text-primary-foreground h-12 px-6 rounded-xl shadow-lg shadow-primary/20"
        >
          <Plus className="h-5 w-5 mr-2" />
          List New Product
        </Button>
      </div>

      {showForm && (
        <ProductCreateModal onClose={closeForm} />
      )}

      {!showForm && (
        <>
          {/* Filters Bar */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
              <input 
                type="text" 
                placeholder="Search products by title, artist, or SKU..."
                className="w-full h-14 bg-surface border border-border rounded-2xl pl-12 pr-4 focus:outline-none focus:border-primary transition-all shadow-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="h-14 px-5 rounded-2xl bg-surface border-border flex gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
               <Button variant="outline" className="h-14 px-5 rounded-2xl bg-surface border-border flex gap-2">
                <Tag className="h-4 w-4" />
                Status
              </Button>
            </div>
          </div>

          {/* Products List */}
          <div className="grid grid-cols-1 gap-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-2xl bg-muted/50" />
              ))
            ) : (
              products.map((product: Product) => (
                <Card key={product.id} className="bg-surface border-border overflow-hidden hover:shadow-md transition-all group p-0">
                  <CardContent className="p-0 flex flex-col md:flex-row items-stretch">
                     {/* Product Visual */}
                     <div className="w-full md:w-32 aspect-square relative shrink-0">
                        {product.coverUrl ? (
                          <img 
                            src={product.coverUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <Package className="h-8 w-8 text-muted-foreground/20" />
                          </div>
                        )}
                        <div className={cn(
                          "absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-black uppercase text-white shadow-sm",
                          product.isActive ? "bg-green-500" : "bg-red-500"
                        )}>
                          {product.isActive ? 'Active' : 'Hidden'}
                        </div>
                     </div>

                     {/* Information Cluster */}
                     <div className="flex-1 p-5 flex flex-col justify-center">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                           <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                 <h3 className="text-xl font-bold text-foreground leading-tight">{product.name}</h3>
                                 <span className="px-2 py-0.5 bg-muted border border-border rounded text-[10px] font-bold text-muted-foreground uppercase">
                                   {product.format}
                                 </span>
                              </div>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                 <span className="font-semibold text-primary">{product.artistName}</span>
                                 {product.isLimited && (
                                   <>
                                     <span className="text-subtle">•</span>
                                     <span className="text-amber-500 font-bold flex items-center gap-1">
                                       Limited Edition ({product.limitedQty})
                                     </span>
                                   </>
                                 )}
                              </div>
                           </div>

                           {/* Actions */}
                           <div className="flex items-center gap-2">
                              <Button 
                                 variant="ghost" 
                                 size="icon" 
                                 className="h-10 w-10 text-muted-foreground hover:text-primary rounded-xl"
                                 onClick={() => openEdit(product.id)}
                              >
                                 <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button 
                                 variant="ghost" 
                                 size="icon" 
                                 className="h-10 w-10 text-muted-foreground hover:text-red-500 rounded-xl"
                                 onClick={() => handleDelete(product.id)}
                                 disabled={isDeleting}
                              >
                                 {isDeleting && deletingId === product.id ? (
                                   <Loader2 className="h-4 w-4 animate-spin" />
                                 ) : (
                                   <Trash2 className="h-4 w-4" />
                                 )}
                              </Button>
                           </div>
                        </div>
                     </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          {isEmpty && (
            <div className="text-center py-20 bg-muted/10 border-2 border-dashed border-border rounded-3xl">
              <Package className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">Your store is empty. Time to list some music!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
