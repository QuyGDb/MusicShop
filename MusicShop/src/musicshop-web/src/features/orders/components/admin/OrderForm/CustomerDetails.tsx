import { User, Mail, MapPin, CreditCard, ExternalLink } from 'lucide-react';

interface CustomerDetailsProps {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  payment: {
    method: string;
    status: string;
    transactionId: string;
  };
}

export function CustomerDetails({ customer, payment }: CustomerDetailsProps) {
  return (
    <div className="space-y-10">
      {/* Customer Details */}
      <div className="space-y-4">
        <label className="text-xs font-black uppercase tracking-widest text-subtle block mb-2">Customer & Shipping</label>
        <div className="space-y-4 text-sm">
          <div className="flex gap-3">
            <User className="h-4 w-4 text-primary shrink-0" />
            <span className="font-bold text-foreground">{customer.name}</span>
          </div>
          <div className="flex gap-3">
            <Mail className="h-4 w-4 text-primary shrink-0" />
            <span className="text-muted-foreground truncate">{customer.email}</span>
          </div>
          <div className="flex gap-3 pt-2">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs text-foreground leading-relaxed font-medium">
              {customer.address}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Evidence */}
      <div className="space-y-4 pt-4 border-t border-border">
        <label className="text-xs font-black uppercase tracking-widest text-subtle block">Payment Status</label>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600">Succeeded</span>
          </div>
          <a href="#" className="text-primary hover:underline flex items-center gap-1 text-[10px] font-bold">
            View in Stripe <ExternalLink className="h-2 w-2" />
          </a>
        </div>
        <p className="text-[10px] text-muted-foreground font-mono bg-white/50 p-2 rounded border border-border/50">
          ID: {payment.transactionId}
        </p>
      </div>
    </div>
  );
}
