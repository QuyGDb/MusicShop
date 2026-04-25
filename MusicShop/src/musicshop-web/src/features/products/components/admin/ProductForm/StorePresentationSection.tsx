import { Layers } from 'lucide-react';
import { ReleaseFormat } from '@/features/products/types';
import { UseFormRegister } from 'react-hook-form';
import { ProductFormValues } from '../../../types/product';
import { slugify } from '@/shared/lib/utils';

interface StorePresentationSectionProps {
  register: any;
}


export function StorePresentationSection({ register }: StorePresentationSectionProps) {
  return (
    <section className="space-y-6 pt-10 border-t border-border">
      <div className="flex items-center gap-2 mb-4">
        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">2</span>
        <h3 className="text-sm font-bold uppercase tracking-wider">Store Presentation</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-subtle">Product Title (Display Name)</label>
          <input 
            {...register('name')}
            placeholder="e.g. Dark Side of the Moon (Japan Pressing)"
            className="w-full h-14 bg-surface border border-border rounded-2xl px-6 focus:outline-none focus:border-primary transition-all shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-subtle">URL Slug</label>
            <input 
              {...register('slug')}
              onChange={(e) => {
                const value = slugify(e.target.value);
                register('slug').onChange({ target: { value, name: 'slug' } });
              }}
              className="w-full h-12 bg-muted/30 border border-border rounded-xl px-4 text-sm font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-subtle">Product Format</label>
            <input type="hidden" {...register('format')} />
            <div className="h-12 bg-muted/30 border border-border rounded-xl px-4 flex items-center text-sm font-bold text-primary italic">
              <Layers className="h-4 w-4 mr-2" />
              {/* Note: In a real scenario, we might need to watch the value to display it correctly */}
              {/* For now, assuming it's correctly populated from version change */}
              Format Selection Locked
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

