import { useState } from 'react';
import { Edit2, Trash2, Eye, EyeOff, Disc, ArrowRight, Sparkles } from 'lucide-react';
import { Button, Card, CardContent, ManagementLayout, EmptyState } from '@/shared/components';
import { cn } from '@/shared/lib/utils';
import { CollectionEditorModal } from './CollectionEditorModal';

import { useCollections } from '../../hooks/useCollections';

export function CollectionManagement() {
  const { 
    collections, 
    meta,
    isLoading, 
    searchQuery,
    onSearchChange,
    onPageChange,
    togglePublish, 
    deleteCollection 
  } = useCollections();
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the collection "${title}"? This action cannot be undone.`)) {
      deleteCollection(id);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 font-black uppercase tracking-widest text-subtle animate-pulse">Loading Collections...</div>;
  }

  const isEmpty = collections.length === 0 && !searchQuery;
  const noSearchResults = collections.length === 0 && !!searchQuery;

  return (
    <ManagementLayout
      title="Marketing & Curation"
      subtitle="Craft themed sections and showcase your finest products on the homepage."
      createLabel="New Collection"
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      pagination={meta ? {
        page: meta.page,
        totalPages: Math.ceil(meta.total / meta.limit),
        onPageChange
      } : undefined}
      onCreate={() => {
        console.log('Opening collection editor for new collection');
        setSelectedCollectionId(null);
        setShowEditor(true);
      }}
      isEmpty={isEmpty}
      emptyState={
        <EmptyState
          icon={Sparkles}
          title="No collections"
          description="Your showcase is empty. Create a collection to engage your customers!"
        />
      }
    >
      {noSearchResults ? (
        <EmptyState
          icon={Sparkles}
          title="No results found"
          description={`We couldn't find any collections matching "${searchQuery}"`}
          action={
            <Button variant="outline" onClick={() => onSearchChange('')}>
              Clear Search
            </Button>
          }
        />
      ) : (
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
                    className="h-9 w-9 text-muted-foreground hover:text-red-500 rounded-xl"
                    onClick={() => handleDelete(collection.id, collection.title)}
                   >
                     <Trash2 className="h-4 w-4" />
                  </Button>
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
                    onClick={() => togglePublish(collection.id, collection.isPublished)}
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
      )}

      {showEditor && (
        <CollectionEditorModal
          collectionId={selectedCollectionId}
          onClose={() => setShowEditor(false)}
        />
      )}
    </ManagementLayout>
  );
}
