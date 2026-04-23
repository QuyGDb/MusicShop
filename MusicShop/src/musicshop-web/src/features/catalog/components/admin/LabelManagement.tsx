import { useState } from 'react';
import { Plus, X, Edit2, Trash2, Globe, ExternalLink, Building, Loader2 } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent, Skeleton } from '@/shared/components';
import { useLabels, useCreateLabel, useUpdateLabel, useDeleteLabel } from '../../hooks/useLabels';
import { Label } from '../../types';

export function LabelManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingLabel, setEditingLabel] = useState<Label | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    website: '',
    foundedYear: ''
  });

  const { data: labelsData, isLoading } = useLabels();
  const createLabelMutation = useCreateLabel();
  const updateLabelMutation = useUpdateLabel();
  const deleteLabelMutation = useDeleteLabel();

  const handleOpenCreate = () => {
    setEditingLabel(null);
    setFormData({ name: '', country: '', website: '', foundedYear: '' });
    setShowForm(true);
  };

  const handleOpenEdit = (label: Label) => {
    setEditingLabel(label);
    setFormData({ 
      name: label.name, 
      country: label.country, 
      website: label.website || '',
      foundedYear: label.foundedYear?.toString() || ''
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.country) return;

    const payload = {
      ...formData,
      foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : undefined
    };

    if (editingLabel) {
      updateLabelMutation.mutate(
        { 
          id: editingLabel.id, 
          data: { ...payload, slug: editingLabel.slug } 
        },
        { onSuccess: () => setShowForm(false) }
      );
    } else {
      createLabelMutation.mutate(payload, {
        onSuccess: () => setShowForm(false)
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this label?')) {
      deleteLabelMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Record Labels</h1>
          <p className="text-muted-foreground">Manage the publishers and partners in your ecosystem.</p>
        </div>
        <Button 
          onClick={handleOpenCreate} 
          className="bg-primary hover:bg-primary-dark text-primary-foreground h-12 px-6 rounded-xl shadow-lg shadow-primary/20"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Label
        </Button>
      </div>

      {showForm && (
        <Card className="bg-surface border-primary/20 shadow-2xl animate-in zoom-in-95 duration-300">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/20">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              {editingLabel ? `Edit ${editingLabel.name}` : 'Register New Label'}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
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
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Country</label>
                <input 
                  type="text" 
                  placeholder="e.g. United Kingdom"
                  className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-colors text-foreground"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
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
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Founded Year</label>
                <input 
                  type="number" 
                  placeholder="e.g. 1989"
                  className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-colors text-foreground"
                  value={formData.foundedYear}
                  onChange={(e) => setFormData({...formData, foundedYear: e.target.value})}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-border">
              <Button 
                variant="outline" 
                className="flex-1 h-12 rounded-xl" 
                onClick={() => setShowForm(false)}
                disabled={createLabelMutation.isPending || updateLabelMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                className="flex-[2] h-12 rounded-xl bg-primary text-white" 
                onClick={handleSubmit}
                disabled={createLabelMutation.isPending || updateLabelMutation.isPending || !formData.name || !formData.country}
              >
                {(createLabelMutation.isPending || updateLabelMutation.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingLabel ? 'Save Changes' : 'Register Label'}
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
          labelsData?.items.map((label) => (
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
                          onClick={() => handleOpenEdit(label)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-red-500"
                          onClick={() => handleDelete(label.id)}
                          disabled={deleteLabelMutation.isPending}
                        >
                          {deleteLabelMutation.isPending && deleteLabelMutation.variables === label.id ? (
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

      {!isLoading && labelsData?.items.length === 0 && (
        <div className="text-center py-20 bg-muted/20 border-2 border-dashed border-border rounded-3xl">
          <Building className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground font-medium">No labels found. Start by registering your first partner.</p>
        </div>
      )}
    </div>
  );
}
