import { useState } from 'react';
import { 
  Tag, 
  Plus, 
  Search, 
  X,
  Edit2, 
  Trash2,
  Globe,
  ExternalLink,
  Building
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/shared/components';
import { cn } from '@/shared/lib/utils';

interface Label {
  id: string;
  name: string;
  country: string;
  website: string;
  slug: string;
}

const MOCK_LABELS: Label[] = [
  { id: '1', name: 'Electronic Recordings', country: 'USA', website: 'https://electronic.com', slug: 'electronic-recordings' },
  { id: '2', name: 'Midnight Records', country: 'UK', website: 'https://midnight.uk', slug: 'midnight-records' },
  { id: '3', name: 'Parisian Beats', country: 'France', website: 'https://beats.fr', slug: 'parisian-beats' },
];

export default function LabelManagementPage() {
  const [labels, setLabels] = useState<Label[]>(MOCK_LABELS);
  const [showForm, setShowForm] = useState(false);
  const [newLabel, setNewLabel] = useState({ name: '', country: '', website: '' });

  const handleAddLabel = () => {
    if (!newLabel.name) return;
    
    const label: Label = {
      id: Math.random().toString(36).substr(2, 9),
      ...newLabel,
      slug: newLabel.name.toLowerCase().replace(/\s+/g, '-')
    };
    
    setLabels([...labels, label]);
    setNewLabel({ name: '', country: '', website: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Record Labels</h1>
          <p className="text-muted-foreground">Manage the publishers and partners in your ecosystem.</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)} 
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
              Register New Label
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
                  value={newLabel.name}
                  onChange={(e) => setNewLabel({...newLabel, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Country</label>
                <input 
                  type="text" 
                  placeholder="e.g. United Kingdom"
                  className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-colors text-foreground"
                  value={newLabel.country}
                  onChange={(e) => setNewLabel({...newLabel, country: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Website URL</label>
              <input 
                type="url" 
                placeholder="https://example.com"
                className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-colors text-foreground"
                value={newLabel.website}
                onChange={(e) => setNewLabel({...newLabel, website: e.target.value})}
              />
            </div>
            <div className="flex items-center gap-3 pt-6 border-t border-border">
              <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button className="flex-[2] h-12 rounded-xl bg-primary text-white" onClick={handleAddLabel}>Save Label</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Labels List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {labels.map((label) => (
          <Card key={label.id} className="bg-surface border-border shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
            <div className="flex items-stretch h-full">
               <div className="w-24 bg-muted/30 flex items-center justify-center border-r border-border shrink-0">
                  <Building className="h-8 w-8 text-muted-foreground" />
               </div>
               <div className="flex-1 p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-foreground">{label.name}</h3>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      {label.country}
                    </div>
                    <a 
                      href={label.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {label.website.replace('https://', '')}
                    </a>
                  </div>

                  <div className="absolute top-4 right-4 group-hover:scale-110 transition-transform">
                     {/* Any badge icon could go here */}
                  </div>
               </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
