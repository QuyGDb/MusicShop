import { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2,
  Layout,
  Eye,
  EyeOff,
  Disc,
  ArrowRight,
  GripVertical,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/shared/components';
import { cn } from '@/shared/lib/utils';
import { CollectionEditorModal } from '@/features/admin';

interface Collection {
  id: string;
  title: string;
  description: string;
  itemCount: number;
  isPublished: boolean;
  type: 'Manual' | 'Dynamic';
}

const MOCK_COLLECTIONS: Collection[] = [
  { id: '1', title: 'New Arrivals', description: 'Freshly pressed vinyl and latest digital releases.', itemCount: 12, isPublished: true, type: 'Dynamic' },
  { id: '2', title: 'Staff Picks 2026', description: 'Hand-picked favorites from the MusicShop curators.', itemCount: 8, isPublished: true, type: 'Manual' },
  { id: '3', title: 'Synthesized Classics', description: 'Legendary synthwave albums that defined an era.', itemCount: 15, isPublished: false, type: 'Manual' },
  { id: '4', title: 'Essential Japanese City Pop', description: 'Direct imports from Tokyo treasures.', itemCount: 6, isPublished: true, type: 'Manual' },
];

export default function CollectionManagementPage() {
  const [collections, setCollections] = useState<Collection[]>(MOCK_COLLECTIONS);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Marketing & Curation</h1>
          <p className="text-muted-foreground">Craft themed sections and showcase your finest products on the homepage.</p>
        </div>
        <Button 
          onClick={() => {
            setSelectedCollectionId(null);
            setShowEditor(true);
          }} 
          className="bg-primary hover:bg-primary-dark text-primary-foreground h-12 px-6 rounded-xl shadow-lg shadow-primary/20"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Collection
        </Button>
      </div>

      {/* Logic Note / Banner */}
      <div className="p-6 bg-surface border-2 border-dashed border-primary/20 rounded-3xl flex items-center gap-6">
         <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <Sparkles className="h-8 w-8 text-primary" />
         </div>
         <div className="flex-1">
            <h3 className="font-bold text-foreground">Homepage Logic</h3>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Currently, your storefront is configured to display <span className="font-bold text-primary">3 random collections</span> from your published list. Albums will be presented in a single horizontal row.
            </p>
         </div>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((collection) => (
          <Card key={collection.id} className={cn(
            "bg-surface border-border overflow-hidden hover:shadow-md transition-all group",
            !collection.isPublished && "opacity-80"
          )}>
            <CardContent className="p-0">
               <div className="p-6 flex items-start justify-between">
                  <div className="space-y-1">
                     <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-foreground">{collection.title}</h3>
                        {!collection.isPublished && (
                          <span className="px-2 py-0.5 bg-muted text-[10px] font-black uppercase tracking-tighter text-subtle rounded border border-border">
                            Draft
                          </span>
                        )}
                     </div>
                     <p className="text-sm text-muted-foreground line-clamp-1">{collection.description}</p>
                  </div>
                  <div className="flex gap-1">
                     <Button 
                       variant="ghost" 
                       size="icon" 
                       className="h-9 w-9 text-muted-foreground hover:text-primary rounded-xl"
                       onClick={() => {
                         setSelectedCollectionId(collection.id);
                         setShowEditor(true);
                       }}
                      >
                        <Edit2 className="h-4 w-4" />
                     </Button>
                     <Button 
                       variant="ghost" 
                       size="icon" 
                       className={cn(
                        "h-9 w-9 text-muted-foreground rounded-xl",
                        collection.isPublished ? "hover:text-amber-500" : "hover:text-emerald-500"
                       )}
                       onClick={() => {
                          setCollections(collections.map(c => c.id === collection.id ? {...c, isPublished: !c.isPublished} : c));
                       }}
                      >
                        {collection.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                     </Button>
                  </div>
               </div>
               
               {/* Collection Preview (Minimal) */}
               <div className="px-6 py-4 bg-muted/10 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="flex -space-x-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-10 w-10 rounded-lg border-2 border-surface bg-muted flex items-center justify-center overflow-hidden">
                             <Disc className="h-5 w-5 text-subtle" />
                          </div>
                        ))}
                        {collection.itemCount > 3 && (
                          <div className="h-10 w-10 rounded-lg border-2 border-surface bg-muted/50 flex items-center justify-center text-[10px] font-black text-subtle">
                             +{collection.itemCount - 3}
                          </div>
                        )}
                     </div>
                     <div className="text-xs font-bold text-subtle uppercase tracking-widest">
                        {collection.itemCount} items
                     </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                     Manage List
                     <ArrowRight className="h-3 w-3" />
                  </div>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showEditor && (
        <CollectionEditorModal 
          collectionId={selectedCollectionId} 
          onClose={() => setShowEditor(false)} 
        />
      )}
    </div>
  );
}
