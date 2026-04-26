import { Plus, Edit2, Trash2, Globe, ExternalLink, Building, Loader2, AlertCircle, Search } from 'lucide-react';
import { Button, Card, Skeleton, Pagination } from '@/shared/components';
import { cn } from '@/shared/lib/utils';
import { LabelForm } from './LabelForm';
import { useLabelManagement } from '../../../hooks/useLabelManagement';

/**
 * Presentational component for record label administration.
 * Logic is delegated to useLabelManagement hook.
 */
export function LabelManagement() {
  const {
    labels,
    isLoading,
    isEmpty,
    error,
    form,
    actions,
    page,
    setPage,
    totalPages,
    searchQuery,
    setSearchQuery
  } = useLabelManagement();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-xl font-bold">Failed to load labels</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Record Labels</h1>
          <p className="text-muted-foreground">Manage the publishers and partners in your ecosystem.</p>
        </div>
        <Button 
          onClick={form.openCreate} 
          className="bg-primary hover:bg-primary-dark text-primary-foreground h-12 px-6 rounded-xl shadow-lg shadow-primary/20"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Label
        </Button>
      </div>

      {form.isOpen && (
        <LabelForm 
          editingLabel={form.editingLabel} 
          onClose={form.close} 
        />
      )}

      {!form.isOpen && (
        <>
          {/* Filters Bar */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
              <input
                type="text"
                placeholder="Search labels by name or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 bg-surface border border-border rounded-2xl pl-12 pr-4 focus:outline-none focus:border-primary transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Labels List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-2xl bg-muted/50" />
              ))
            ) : (
              labels.map((label) => (
                <Card key={label.id} className="bg-surface border-border shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
                  <div className="flex items-stretch h-full">
                    <div className="w-24 bg-muted/30 flex items-center justify-center border-r border-border shrink-0">
                        <Building className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1 p-6 relative">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-foreground">{label.name}</h3>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                              onClick={() => form.openEdit(label)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-red-500"
                              onClick={() => actions.delete(label.id)}
                              disabled={actions.isDeleting}
                            >
                              {actions.isDeleting && actions.deletingId === label.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Globe className="h-4 w-4" />
                            {label.country} {label.foundedYear && `• Est. ${label.foundedYear}`}
                          </div>
                          {label.website && (
                            <a 
                              href={label.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                            >
                              <ExternalLink className="h-4 w-4" />
                              {label.website.replace(/^https?:\/\//, '')}
                            </a>
                          )}
                        </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {isEmpty && (
            <div className="text-center py-20 bg-muted/20 border-2 border-dashed border-border rounded-3xl">
              <Building className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">No labels found. Start by registering your first partner.</p>
            </div>
          )}

          {/* Pagination */}
          <Pagination 
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
