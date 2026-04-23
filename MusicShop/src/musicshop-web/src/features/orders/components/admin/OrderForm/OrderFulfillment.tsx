import { Button } from '@/shared/components';
import { Loader2 } from 'lucide-react';

interface OrderFulfillmentProps {
  form: any;
}

export function OrderFulfillment({ form }: OrderFulfillmentProps) {
  return (
    <div className="space-y-4">
      <label className="text-xs font-black uppercase tracking-widest text-subtle block mb-4">Manage Fulfillment</label>
      <div className="space-y-3">
        <form.Field
          name="status"
          children={(field: any) => (
            <select 
              className="w-full h-12 bg-surface border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-all font-bold text-sm"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value as any)}
            >
              <option value="Pending">Pending Approval</option>
              <option value="Processing">Processing Order</option>
              <option value="Shipped">Dispatched / Shipped</option>
              <option value="Delivered">Mark as Delivered</option>
              <option value="Cancelled">Void / Cancelled</option>
            </select>
          )}
        />

        <form.Subscribe
          selector={(state: any) => state.values.status}
          children={(status: string) => status === 'Shipped' && (
            <form.Field
              name="trackingNumber"
              children={(field: any) => (
                <input 
                  type="text" 
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Tracking Number (e.g. UPS-123...)"
                  className="w-full h-12 bg-surface border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-all text-sm animate-in slide-in-from-top-2"
                />
              )}
            />
          )}
        />

        <form.Subscribe
          selector={(state: any) => state.isSubmitting}
          children={(isSubmitting: boolean) => (
            <Button 
              onClick={() => form.handleSubmit()} 
              className="w-full h-12 bg-primary text-white font-bold rounded-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Order Status"}
            </Button>
          )}
        />
      </div>
    </div>
  );
}
