interface OrderSummaryProps {
  summary: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
}

export function OrderSummary({ summary }: OrderSummaryProps) {
  return (
    <div className="bg-muted/5 border border-border rounded-2xl p-6 space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-bold text-foreground">${summary.subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Shipping</span>
        <span className="font-bold text-foreground">${summary.shipping.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Estimate Tax</span>
        <span className="font-bold text-foreground">${summary.tax.toFixed(2)}</span>
      </div>
      <div className="pt-3 mt-3 border-t border-border flex justify-between items-center text-lg">
        <span className="font-black text-foreground uppercase tracking-widest text-xs">Total Amount</span>
        <span className="font-black text-primary text-2xl">${summary.total.toFixed(2)}</span>
      </div>
    </div>
  );
}
