import { useState, useEffect } from 'react';
import { Type, Sparkles, Search, Plus, Disc } from 'lucide-react';
import { productService } from '@/features/products/services/productService';
import { Product } from '@/features/products/types';

interface CurationSettingsProps {
  register: any;
  errors: any;
  onAddItem: (item: any) => void;
}

export function CurationSettings({ register, errors, onAddItem }: CurationSettingsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true);
        try {
          const response = await productService.getProducts({ 
            searchQuery, 
            limit: 5,
            isActive: true 
          });
          setSearchResults(response.items);
        } catch (error) {
          console.error('Failed to search products:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAdd = (product: Product) => {
    console.log('Adding product to curation:', product);
    onAddItem({
      id: `new-${Date.now()}`,
      productId: product.id,
      title: product.name,
      artistName: product.artistName || 'Unknown Artist',
      price: product.price,
      coverUrl: product.coverUrl || '',
    });
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="w-full md:w-80 border-r border-border p-8 space-y-8 bg-muted/5">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-subtle flex items-center gap-2">
            <Type className="h-3 w-3" /> Collection Name
          </label>
          <input 
            type="text" 
            {...register('title')}
            className={`w-full h-12 bg-surface border rounded-xl px-4 focus:outline-none transition-all font-bold ${
              errors.title ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
            }`}
          />
          {errors.title && (
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{errors.title.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-subtle">Display Description</label>
          <textarea 
            rows={4}
            {...register('description')}
            className={`w-full bg-surface border rounded-xl p-4 focus:outline-none transition-all text-sm resize-none ${
              errors.description ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
            }`}
          />
          {errors.description && (
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{errors.description.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-border">
        <h4 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
          <Sparkles className="h-3 w-3 text-primary" /> Add Products
        </h4>
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find albums..."
            className="w-full h-10 bg-surface border border-border rounded-lg pl-9 pr-3 text-xs focus:outline-none focus:border-primary"
          />
        </div>
        
        <div className="space-y-2 max-h-[300px] overflow-y-auto px-1">
          {isSearching ? (
            <p className="text-[10px] text-center text-muted-foreground py-4 animate-pulse">Searching...</p>
          ) : searchResults.length > 0 ? (
            searchResults.map((product) => (
              <button
                key={product.id}
                onClick={() => handleAdd(product)}
                className="w-full flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors text-left group"
              >
                <div className="h-8 w-8 bg-muted rounded flex items-center justify-center shrink-0 overflow-hidden">
                  {product.coverUrl ? (
                    <img src={product.coverUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Disc className="h-4 w-4 text-subtle" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-foreground truncate">{product.name}</p>
                  <p className="text-[9px] text-subtle truncate">${product.price.toFixed(2)}</p>
                </div>
                <Plus className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))
          ) : searchQuery.length > 2 ? (
            <p className="text-[10px] text-center text-muted-foreground py-4 italic">No albums found</p>
          ) : (
            <p className="text-[10px] text-center text-muted-foreground py-4 italic">Type to search for available releases</p>
          )}
        </div>
      </div>
    </div>
  );
}

