import { 
  X, 
  Search, 
  Plus, 
  Disc, 
  GripVertical, 
  Trash2, 
  Sparkles,
  Layout,
  Type,
  MousePointer2
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/shared/components';
import { cn } from '@/shared/lib/utils';
import { useState } from 'react';

interface CollectionItem {
  id: string;
  productId: string;
  title: string;
  artistName: string;
  coverUrl: string;
  price: number;
}

interface CollectionEditorModalProps {
  collectionId: string | null;
  onClose: () => void;
}

const MOCK_PRODUCTS: CollectionItem[] = [
  { id: 'item-1', productId: 'p1', title: 'Endless Summer', artistName: 'The Midnight', price: 45.00, coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&q=80' },
  { id: 'item-2', productId: 'p2', title: 'Dark All Day', artistName: 'Gunship', price: 18.00, coverUrl: 'https://images.unsplash.com/photo-1514525253361-bee243870eb2?w=300&q=80' },
  { id: 'item-3', productId: 'p3', title: 'Uncanny Valley', artistName: 'Perturbator', price: 32.00, coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&q=80' },
  { id: 'item-4', productId: 'p4', title: 'Moonbeam', artistName: 'VHS Dreams', price: 25.00, coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80' },
];

export function CollectionEditorModal({ collectionId, onClose }: CollectionEditorModalProps) {
  const [items, setItems] = useState<CollectionItem[]>(MOCK_PRODUCTS);
  const [title, setTitle] = useState('New Arrivals');
  const [description, setDescription] = useState('Explore the latest synth treasures in our catalog.');
  const [isSaving, setIsSaving] = useState(false);

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
       <Card className="w-full max-w-6xl max-h-[90vh] bg-surface border-border shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
         <CardHeader className="border-b border-border bg-muted/20 flex flex-row items-center justify-between p-6">
            <div className="flex items-center gap-3">
               <div className="bg-primary/10 p-2 rounded-xl">
                  <Layout className="h-6 w-6 text-primary" />
               </div>
               <div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {collectionId ? 'Editor: ' + title : 'Create Curation'}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-black">Merchandising Studio</p>
               </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-6 w-6" />
            </Button>
         </CardHeader>

         <CardContent className="flex-1 overflow-hidden p-0 flex flex-col md:flex-row">
            {/* Settings Column */}
            <div className="w-full md:w-80 border-r border-border p-8 space-y-8 bg-muted/5">
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-subtle flex items-center gap-2">
                        <Type className="h-3 w-3" /> Collection Name
                     </label>
                     <input 
                       type="text" 
                       className="w-full h-12 bg-surface border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-all font-bold"
                       value={title}
                       onChange={(e) => setTitle(e.target.value)}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-subtle">Display Description</label>
                     <textarea 
                       rows={4}
                       className="w-full bg-surface border border-border rounded-xl p-4 focus:outline-none focus:border-primary transition-all text-sm resize-none"
                       value={description}
                       onChange={(e) => setDescription(e.target.value)}
                     />
                  </div>
               </div>

               {/* Discovery area */}
               <div className="space-y-4 pt-6 border-t border-border">
                  <h4 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-primary" /> Add Products
                  </h4>
                  <div className="relative">
                     <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
                     <input 
                       type="text" 
                       placeholder="Find albums..."
                       className="w-full h-10 bg-surface border border-border rounded-lg pl-9 pr-3 text-xs focus:outline-none focus:border-primary"
                     />
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto px-1">
                     {/* Search results would go here */}
                     <p className="text-[10px] text-center text-muted-foreground py-4 italic">Type to search for available releases</p>
                  </div>
               </div>
            </div>

            {/* Curation Deck / Horizontal Preview */}
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

               {/* Horizontal Row Preview */}
               <div className="flex gap-4 overflow-x-auto pb-8 pt-2 scrollbar-hide">
                  {items.map((item, index) => (
                    <Card 
                      key={item.id} 
                      className="w-48 bg-surface border-border group shrink-0 hover:border-primary/50 cursor-grab active:cursor-grabbing transition-all relative overflow-hidden"
                    >
                       <div className="aspect-square relative overflow-hidden bg-muted">
                          <img src={item.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Button 
                               variant="ghost" 
                               size="icon" 
                               onClick={() => handleRemoveItem(item.id)}
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
                             <GripVertical className="h-3 w-3 text-subtle opacity-30 cursor-grab" />
                          </div>
                       </CardContent>
                    </Card>
                  ))}

                  {/* Empty Slot */}
                  <div className="w-48 aspect-square rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-subtle shrink-0">
                     <Plus className="h-6 w-6" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Add Slot</span>
                  </div>
               </div>

               {/* Stats / Context */}
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
                        <p className="text-xs font-bold text-foreground一线">Eligible for "Random Discovery" slots.</p>
                     </div>
                  </div>
               </div>
            </div>
         </CardContent>

         <div className="border-t border-border p-6 bg-muted/10 flex items-center justify-between">
            <Button variant="outline" className="h-12 rounded-xl px-6" onClick={onClose}>Discard</Button>
            <Button className="h-12 rounded-xl px-12 bg-primary text-white shadow-xl shadow-primary/30" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Publishing Curation..." : "Update Storefront"}
            </Button>
         </div>
       </Card>
    </div>
  );
}
