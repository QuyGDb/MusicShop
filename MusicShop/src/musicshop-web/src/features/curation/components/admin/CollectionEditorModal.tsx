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

export function CollectionEditorModal({ collectionId, onClose }: CollectionEditorModalProps) {
  const {
    register,
    control,
    handleSubmit,
    items,
    appendItem,
    removeItem,
    moveItem,
    isSubmitting,
    errors
  } = useCurationForm({
    collectionId,
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
          <CurationSettings register={register} errors={errors} onAddItem={appendItem} />
          <CurationDeck
            items={items}
            onRemoveItem={(id) => {
              const index = items.findIndex(item => item.id === id);
              if (index !== -1) removeItem(index);
            }}
            onMoveItem={moveItem}
          />
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

