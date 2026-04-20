import { 
  X, 
  Package, 
  MapPin, 
  CreditCard, 
  Calendar, 
  User, 
  Mail,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/shared/components';
import { cn } from '@/shared/lib/utils';
import { OrderStatus } from '@/pages/admin/OrderManagementPage';
import { useState } from 'react';

interface OrderDetailsModalProps {
  orderId: string;
  onClose: () => void;
}

export function OrderDetailsModal({ orderId, onClose }: OrderDetailsModalProps) {
  const [status, setStatus] = useState<OrderStatus>('Processing');
  const [isUpdating, setIsUpdating] = useState(false);

  // Mock data for the specific order
  const orderData = {
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Synthwave Blvd, Neon City, CA 90210'
    },
    items: [
      { id: '1', title: 'Endless Summer', format: 'Vinyl (180g Pink)', price: 45.00, quantity: 2, cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200&q=80' },
      { id: '2', title: 'Dark All Day', format: 'CD (Deluxe Edition)', price: 18.00, quantity: 1, cover: 'https://images.unsplash.com/photo-1514525253361-bee243870eb2?w=200&q=80' }
    ],
    summary: {
      subtotal: 108.00,
      shipping: 12.50,
      tax: 5.00,
      total: 125.50
    },
    payment: {
      method: 'Visa **** 4242',
      status: 'Paid',
      transactionId: 'txn_3M9h4L2eZvKYlo2C1abc'
    }
  };

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsUpdating(false);
    // In real app, call API here
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-surface border-border shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        <CardHeader className="border-b border-border bg-muted/20 flex flex-row items-center justify-between p-6">
          <div className="flex items-center gap-4">
             <div className="bg-primary/10 p-2 rounded-xl">
                <ShoppingBag className="h-6 w-6 text-primary" />
             </div>
             <div>
                <CardTitle className="text-xl font-bold text-foreground">Order #{orderId}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                   <Calendar className="h-3 w-3 text-subtle" />
                   <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">April 18, 2026</span>
                </div>
             </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-6 w-6" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-0 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3">
             {/* Left Column: Line Items & Summary */}
             <div className="lg:col-span-2 p-8 border-r border-border space-y-8">
                <div className="space-y-4">
                   <h3 className="text-xs font-black uppercase tracking-widest text-subtle border-l-2 border-primary pl-3">Order Items</h3>
                   <div className="space-y-3">
                      {orderData.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 bg-muted/10 rounded-2xl border border-border/50">
                           <img src={item.cover} className="w-16 h-16 rounded-lg object-cover shadow-sm" alt={item.title} />
                           <div className="flex-1 min-w-0">
                              <p className="font-bold text-foreground truncate">{item.title}</p>
                              <p className="text-xs text-muted-foreground">{item.format}</p>
                           </div>
                           <div className="text-right">
                              <p className="font-black text-foreground">${item.price.toFixed(2)}</p>
                              <p className="text-xs text-subtle font-mono">Qty: {item.quantity}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Totals */}
                <div className="bg-muted/5 border border-border rounded-2xl p-6 space-y-3">
                   <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-bold text-foreground">${orderData.summary.subtotal.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-bold text-foreground">${orderData.summary.shipping.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Estimate Tax</span>
                      <span className="font-bold text-foreground">${orderData.summary.tax.toFixed(2)}</span>
                   </div>
                   <div className="pt-3 mt-3 border-t border-border flex justify-between items-center text-lg">
                      <span className="font-black text-foreground uppercase tracking-widest text-xs">Total Amount</span>
                      <span className="font-black text-primary text-2xl">${orderData.summary.total.toFixed(2)}</span>
                   </div>
                </div>
             </div>

             {/* Right Column: Customer & Status */}
             <div className="bg-muted/20 p-8 space-y-10">
                {/* Status Update section */}
                <div className="space-y-4">
                   <label className="text-xs font-black uppercase tracking-widest text-subtle block mb-4">Manage Fulfillment</label>
                   <div className="space-y-3">
                      <select 
                        className="w-full h-12 bg-surface border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-all font-bold text-sm"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as OrderStatus)}
                      >
                        <option value="Pending">Pending Approval</option>
                        <option value="Processing">Processing Order</option>
                        <option value="Shipped">Dispatched / Shipped</option>
                        <option value="Delivered">Mark as Delivered</option>
                        <option value="Cancelled">Void / Cancelled</option>
                      </select>
                      {status === 'Shipped' && (
                        <input 
                          type="text" 
                          placeholder="Tracking Number (e.g. UPS-123...)"
                          className="w-full h-12 bg-surface border border-border rounded-xl px-4 focus:outline-none focus:border-primary transition-all text-sm animate-in slide-in-from-top-2"
                        />
                      )}
                      <Button 
                        onClick={handleUpdateStatus} 
                        className="w-full h-12 bg-primary text-white font-bold rounded-xl"
                        disabled={isUpdating}
                      >
                         {isUpdating ? "Updating..." : "Update Order Status"}
                      </Button>
                   </div>
                </div>

                {/* Customer Details */}
                <div className="space-y-4">
                   <label className="text-xs font-black uppercase tracking-widest text-subtle block mb-2">Customer & Shipping</label>
                   <div className="space-y-4 text-sm">
                      <div className="flex gap-3">
                         <User className="h-4 w-4 text-primary shrink-0" />
                         <span className="font-bold text-foreground">{orderData.customer.name}</span>
                      </div>
                      <div className="flex gap-3">
                         <Mail className="h-4 w-4 text-primary shrink-0" />
                         <span className="text-muted-foreground truncate">{orderData.customer.email}</span>
                      </div>
                      <div className="flex gap-3 pt-2">
                         <MapPin className="h-4 w-4 text-primary shrink-0" />
                         <span className="text-xs text-foreground leading-relaxed font-medium">
                           {orderData.customer.address}
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
                      ID: {orderData.payment.transactionId}
                   </p>
                </div>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
