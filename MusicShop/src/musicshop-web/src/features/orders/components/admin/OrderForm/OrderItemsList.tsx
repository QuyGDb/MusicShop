interface OrderItem {
  id: string;
  title: string;
  format: string;
  price: number;
  quantity: number;
  cover: string;
}

interface OrderItemsListProps {
  items: OrderItem[];
}

export function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-black uppercase tracking-widest text-subtle border-l-2 border-primary pl-3">Order Items</h3>
      <div className="space-y-3">
        {items.map((item) => (
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
  );
}
