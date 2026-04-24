import { Plus, X, Edit2, Trash2, Globe, ExternalLink, Building, Loader2 } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent, Skeleton } from '@/shared/components';
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
    form,
    actions
  } = useLabelManagement();

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
        <Card className="bg-surface border-primary/20 shadow-2xl animate-in zoom-in-95 duration-300">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/20">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              {form.editingLabel ? `Edit ${form.editingLabel.name}` : 'Register New Label'}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={form.close}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Label Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Warp Records"
                  className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-colors text-foreground"
                  value={form.formData.name}
                  onChange={(e) => form.updateField('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Country</label>
                <input 
                  type="text" 
                  placeholder="e.g. United Kingdom"
                  className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-colors text-foreground"
                  value={form.formData.country}
                  onChange={(e) => form.updateField('country', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Website URL</label>
                <input 
                  type="url" 
                  placeholder="https://example.com"
                  className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-colors text-foreground"
                  value={form.formData.website}
                  onChange={(e) => form.updateField('website', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Founded Year</label>
                <input 
                  type="number" 
                  placeholder="e.g. 1989"
                  className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-colors text-foreground"
                  value={form.formData.foundedYear}
                  onChange={(e) => form.updateField('foundedYear', e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-border">
              <Button 
                variant="outline" 
                className="flex-1 h-12 rounded-xl" 
                onClick={form.close}
                disabled={form.isPending}
              >
                Cancel
              </Button>
              <Button 
                className="flex-[2] h-12 rounded-xl bg-primary text-white" 
                onClick={form.submit}
                disabled={form.isPending || !form.isValid}
              >
                {form.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {form.editingLabel ? 'Save Changes' : 'Register Label'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
    </div>
  );
}
