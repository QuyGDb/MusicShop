import { X, Layout } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/shared/components';
import { useWatch } from 'react-hook-form';

// New specialized components and hooks
import { useCurationForm } from '../../hooks/useCurationForm';
import { CurationSettings } from './CurationForm/CurationSettings';
import { CurationDeck } from './CurationForm/CurationDeck';

interface CollectionEditorModalProps {
  collectionId: string | null;
  onClose: () => void;
}

const MOCK_PRODUCTS = [
  { id: 'item-1', productId: 'p1', title: 'Endless Summer', artistName: 'The Midnight', price: 45.00, coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&q=80' },
  { id: 'item-2', productId: 'p2', title: 'Dark All Day', artistName: 'Gunship', price: 18.00, coverUrl: 'https://images.unsplash.com/photo-1514525253361-bee243870eb2?w=300&q=80' },
  { id: 'item-3', productId: 'p3', title: 'Uncanny Valley', artistName: 'Perturbator', price: 32.00, coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&q=80' },
  { id: 'item-4', productId: 'p4', title: 'Moonbeam', artistName: 'VHS Dreams', price: 25.00, coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80' },
];

export function CollectionEditorModal({ collectionId, onClose }: CollectionEditorModalProps) {
  const { 
    register, 
    control, 
    handleSubmit, 
    items, 
    removeItem, 
    isSubmitting 
  } = useCurationForm({
    collectionId,
    initialItems: MOCK_PRODUCTS,
    onSuccess: onClose,
  });

  const title = useWatch({
    control,
    name: 'title',
  });

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
            <CurationSettings register={register} />
            <CurationDeck items={items} onRemoveItem={(id) => {
              const index = items.findIndex(item => item.id === id);
              if (index !== -1) removeItem(index);
            }} />
         </CardContent>

         <div className="border-t border-border p-6 bg-muted/10 flex items-center justify-between">
            <Button variant="outline" className="h-12 rounded-xl px-6" onClick={onClose}>Discard</Button>
            <Button 
              className="h-12 rounded-xl px-12 bg-primary text-white shadow-xl shadow-primary/30" 
              onClick={handleSubmit} 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publishing Curation..." : "Update Storefront"}
            </Button>
         </div>
       </Card>
    </div>
  );
}

