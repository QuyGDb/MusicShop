import { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ExternalLink,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  MoreVertical,
  Calendar
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/shared/components';
import { cn } from '@/shared/lib/utils';
import { OrderDetailsModal } from '@/features/admin';

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

interface Order {
  id: string;
  customerName: string;
  email: string;
  date: string;
  total: number;
  status: OrderStatus;
  itemsCount: number;
}

const MOCK_ORDERS: Order[] = [
  { id: 'ORD-7721', customerName: 'John Doe', email: 'john@example.com', date: '2026-04-18', total: 125.50, status: 'Processing', itemsCount: 3 },
  { id: 'ORD-7722', customerName: 'Jane Smith', email: 'jane@example.com', date: '2026-04-19', total: 45.00, status: 'Pending', itemsCount: 1 },
  { id: 'ORD-7723', customerName: 'Mike Johnson', email: 'mike@example.com', date: '2026-04-19', total: 89.99, status: 'Shipped', itemsCount: 2 },
  { id: 'ORD-7724', customerName: 'Sarah Williams', email: 'sarah@example.com', date: '2026-04-20', total: 210.00, status: 'Delivered', itemsCount: 5 },
  { id: 'ORD-7725', customerName: 'David Brown', email: 'david@example.com', date: '2026-04-20', total: 60.00, status: 'Cancelled', itemsCount: 2 },
];

const statusStyles: Record<OrderStatus, { color: string, icon: any }> = {
  Pending: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
  Processing: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: AlertCircle },
  Shipped: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Truck },
  Delivered: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  Cancelled: { color: 'bg-muted text-subtle border-border', icon: XCircle }
};

function XCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 12 12"/></svg>
  );
}

export default function OrderManagementPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Orders & Fulfillment</h1>
        <p className="text-muted-foreground">Monitor customer purchases and manage the lifecycle of every shipment.</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Orders', value: '12', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'To Ship', value: '08', icon: Truck, color: 'text-purple-500', bg: 'bg-purple-50' },
          { label: 'Processing', value: '04', icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Today Revenue', value: '$1,250', icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/10' },
        ].map((stat, i) => (
          <Card key={i} className="bg-surface border-border">
            <CardContent className="p-6 flex items-center gap-4">
               <div className={cn("p-3 rounded-2xl", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
               </div>
               <div>
                  <p className="text-xs font-black uppercase tracking-widest text-subtle">{stat.label}</p>
                  <p className="text-2xl font-black text-foreground">{stat.value}</p>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
          <input 
            type="text" 
            placeholder="Search by Order ID, Customer, or Email..."
            className="w-full h-14 bg-surface border border-border rounded-2xl pl-12 pr-4 focus:outline-none focus:border-primary transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-14 px-5 rounded-2xl bg-surface border-border flex gap-2">
            <Filter className="h-4 w-4" />
            Status
          </Button>
           <Button variant="outline" className="h-14 px-5 rounded-2xl bg-surface border-border flex gap-2">
            <Calendar className="h-4 w-4" />
            Date
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <Card className="bg-surface border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="p-5 text-xs font-black uppercase tracking-widest text-subtle">Order ID</th>
                <th className="p-5 text-xs font-black uppercase tracking-widest text-subtle">Customer</th>
                <th className="p-5 text-xs font-black uppercase tracking-widest text-subtle">Date</th>
                <th className="p-5 text-xs font-black uppercase tracking-widest text-subtle">Total</th>
                <th className="p-5 text-xs font-black uppercase tracking-widest text-subtle">Status</th>
                <th className="p-5 text-xs font-black uppercase tracking-widest text-subtle text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const StatusIcon = statusStyles[order.status].icon;
                return (
                  <tr key={order.id} className="border-b border-border/50 hover:bg-muted/10 transition-colors group">
                    <td className="p-5">
                       <span className="font-mono text-sm font-bold text-foreground">#{order.id}</span>
                    </td>
                    <td className="p-5">
                       <div className="flex flex-col">
                          <span className="font-bold text-foreground">{order.customerName}</span>
                          <span className="text-xs text-muted-foreground">{order.email}</span>
                       </div>
                    </td>
                    <td className="p-5 text-sm text-muted-foreground">
                       {order.date}
                    </td>
                    <td className="p-5 font-bold text-foreground">
                       ${order.total.toFixed(2)}
                    </td>
                    <td className="p-5">
                       <div className={cn(
                         "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                         statusStyles[order.status].color
                       )}>
                          <StatusIcon className="h-3 w-3" />
                          {order.status}
                       </div>
                    </td>
                    <td className="p-5 text-right">
                       <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 text-muted-foreground hover:text-primary rounded-xl"
                            onClick={() => setSelectedOrder(order)}
                          >
                             <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground rounded-xl">
                             <MoreVertical className="h-4 w-4" />
                          </Button>
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Modal */}
      {selectedOrder && (
        <OrderDetailsModal 
          orderId={selectedOrder.id} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
}
