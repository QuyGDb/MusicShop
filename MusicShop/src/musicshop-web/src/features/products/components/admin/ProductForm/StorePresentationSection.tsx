import { Layers } from 'lucide-react';
import { ReleaseFormat } from '@/features/products/types';

import { ReactFormApi } from '@tanstack/react-form';
import { ProductFormValues } from '../../../types/product';

interface StorePresentationSectionProps {
  form: any;
}

export function StorePresentationSection({ form }: StorePresentationSectionProps) {
  return (
    <section className="space-y-6 pt-10 border-t border-border">
      <div className="flex items-center gap-2 mb-4">
        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">2</span>
        <h3 className="text-sm font-bold uppercase tracking-wider">Store Presentation</h3>
      </div>

      <div className="space-y-6">
        <form.Field
          name="name"
          children={(field: any) => (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-subtle">Product Title (Display Name)</label>
              <input 
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g. Dark Side of the Moon (Japan Pressing)"
                className="w-full h-14 bg-surface border border-border rounded-2xl px-6 focus:outline-none focus:border-primary transition-all shadow-sm"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-tight">{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form.Field
            name="slug"
            children={(field: any) => (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-subtle">URL Slug</label>
                <input 
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value.toLowerCase().replace(/ /g, '-'))}
                  className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 text-sm font-mono"
                />
              </div>
            )}
          />

          <form.Field
            name="format"
            children={(field: any) => (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-subtle">Product Format</label>
                <div className="h-12 bg-muted/30 border border-border rounded-xl px-4 flex items-center text-sm font-bold text-primary italic">
                  <Layers className="h-4 w-4 mr-2" />
                  {ReleaseFormat[field.state.value as keyof typeof ReleaseFormat]}
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </section>
  );
}
