import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button, Skeleton } from '@/shared/components';
import { cn } from '@/shared/lib/utils';
import { useFeaturedCollections } from '../../hooks/useFeaturedCollections';

export function FeaturedCollections() {
  const navigate = useNavigate();
  const { collections, isLoading } = useFeaturedCollections();

  if (isLoading) {
    return (
      <div className="space-y-24 py-12">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-10">
            <div className="space-y-4">
              <Skeleton className="h-4 w-32 bg-muted/50" />
              <Skeleton className="h-12 w-64 bg-muted/50" />
              <Skeleton className="h-6 w-full max-w-xl bg-muted/50" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((j) => (
                <Skeleton key={j} className="aspect-square rounded-lg bg-muted/50" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (collections.length === 0) return null;

  return (
    <section className="space-y-24 py-12">
      {collections.map((collection, index) => (
        <div key={collection.id} className="group relative">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-tight">
                {collection.title}
              </h2>
              {collection.description && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {collection.description}
                </p>
              )}
            </div>
            
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {collection.items.map((item) => (
              <div 
                key={item.productId} 
                onClick={() => navigate(`/products/${item.slug}`)}
                className="group/card relative aspect-square overflow-hidden bg-muted cursor-pointer transition-all duration-500"
              >
                <img 
                  src={item.coverUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                />
                
                {/* Hover Info (Subtle Bottom Gradient) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
                  <div className="translate-y-2 group-hover/card:translate-y-0 transition-transform duration-500 space-y-0.5">
                    <h4 className="font-black text-base leading-tight text-white tracking-tighter drop-shadow-md line-clamp-1">
                      {item.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider line-clamp-1">
                        {item.artistName}
                      </p>
                      <span className="text-white font-black text-xs">
                        ${item.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Decorative background element */}
          <div className={cn(
            "absolute -z-10 blur-[120px] opacity-20 w-[500px] h-[500px] rounded-full transition-all duration-1000 group-hover:opacity-30",
            index % 2 === 0 ? "bg-primary -left-48 -top-24" : "bg-amber-500 -right-48 -bottom-24"
          )} />
        </div>
      ))}
    </section>
  );
}
