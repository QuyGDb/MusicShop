import { MousePointer2, Plus, GripVertical, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Card, CardContent } from '@/shared/components';
import { CurationItem } from '@/features/curation/types/curation';

interface CurationDeckProps {
  items: CurationItem[];
  onRemoveItem: (id: string) => void;
  onMoveItem: (from: number, to: number) => void;
}

export function CurationDeck({ items, onRemoveItem, onMoveItem }: CurationDeckProps) {
  console.log('CurationDeck items:', items);
  return (
    <div className="flex-1 p-8 bg-surface space-y-8 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">Active Curation</h3>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <MousePointer2 className="h-3 w-3" />
            Drag and drop units to set horizontal display priority.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
          <span className="text-[10px] font-black text-subtle uppercase tracking-widest">Total: {items.length} units</span>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-8 pt-2 scrollbar-hide">
        {items.map((item, index) => (
          <Card 
            key={item.id} 
            className="w-48 bg-surface border-border group shrink-0 hover:border-primary/50 cursor-grab active:cursor-grabbing transition-all relative overflow-hidden"
          >
            <div className="aspect-square relative overflow-hidden bg-muted">
              <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onRemoveItem(item.id)}
                  className="h-7 w-7 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-lg"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="absolute top-2 left-2 h-6 w-6 bg-surface/90 backdrop-blur rounded-md flex items-center justify-center text-[10px] font-black border border-border">
                {index + 1}
              </div>
            </div>
            <CardContent className="p-3">
              <p className="text-xs font-black text-foreground truncate">{item.title}</p>
              <p className="text-[10px] text-muted-foreground truncate">{item.artistName}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] font-bold text-primary font-mono">${item.price.toFixed(2)}</span>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    disabled={index === 0}
                    onClick={(e) => { e.stopPropagation(); onMoveItem(index, index - 1); }}
                    className="h-6 w-6 rounded-md hover:bg-muted text-subtle disabled:opacity-30"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    disabled={index === items.length - 1}
                    onClick={(e) => { e.stopPropagation(); onMoveItem(index, index + 1); }}
                    className="h-6 w-6 rounded-md hover:bg-muted text-subtle disabled:opacity-30"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="w-48 aspect-square rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-subtle shrink-0">
          <Plus className="h-6 w-6" />
          <span className="text-[10px] font-black uppercase tracking-widest">Add Slot</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
          <h5 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Storefront Preview</h5>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This collection will occupy a full horizontal lane on the homepage. Customers can swipe or scroll to see all items.
          </p>
        </div>
        <div className="p-4 bg-muted/20 rounded-2xl border border-border">
          <h5 className="text-[10px] font-black uppercase tracking-widest text-subtle mb-1">Visibility Check</h5>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <p className="text-xs font-bold text-foreground">Eligible for "Random Discovery" slots.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

