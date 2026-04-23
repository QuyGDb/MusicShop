import { Type, Sparkles, Search } from 'lucide-react';

interface CurationSettingsProps {
  form: any;
}

export function CurationSettings({ form }: CurationSettingsProps) {
  return (
    <div className="w-full md:w-80 border-r border-border p-8 space-y-8 bg-muted/5">
      <div className="space-y-6">
        <form.Field
          name="title"
          children={(field: any) => (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-subtle flex items-center gap-2">
                <Type className="h-3 w-3" /> Collection Name
              </label>
              <input 
                type="text" 
                className="w-full h-12 bg-surface border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-all font-bold"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />
        
        <form.Field
          name="description"
          children={(field: any) => (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-subtle">Display Description</label>
              <textarea 
                rows={4}
                className="w-full bg-surface border border-border rounded-xl p-4 focus:outline-none focus:border-primary transition-all text-sm resize-none"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />
      </div>

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
          <p className="text-[10px] text-center text-muted-foreground py-4 italic">Type to search for available releases</p>
        </div>
      </div>
    </div>
  );
}
