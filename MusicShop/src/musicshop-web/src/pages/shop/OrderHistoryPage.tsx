import React from 'react';
import { useParams } from 'react-router-dom';
import { OrderHistory } from '@/features/orders/components/storefront/OrderHistory';
import { OrderDetailView } from '@/features/orders/components/storefront/OrderDetailView';
import { Package } from 'lucide-react';

export default function OrderHistoryPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!id && (
          <div className="mb-12 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                Order History
              </h1>
              <p className="text-muted-foreground mt-1">
                View and track your recent orders.
              </p>
            </div>
          </div>
        )}

        {id ? <OrderDetailView orderId={id} /> : <OrderHistory />}
      </div>
    </div>
  );
}
