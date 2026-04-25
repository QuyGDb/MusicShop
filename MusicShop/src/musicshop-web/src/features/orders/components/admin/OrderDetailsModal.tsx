import { X, ShoppingBag, Calendar } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/shared/components';
import { OrderStatus } from '../../types';

// New specialized components and hooks
import { useOrderForm } from '../../hooks/useOrderForm';
import { OrderItemsList } from './OrderForm/OrderItemsList';
import { OrderSummary } from './OrderForm/OrderSummary';
import { OrderFulfillment } from './OrderForm/OrderFulfillment';
import { CustomerDetails } from './OrderForm/CustomerDetails';

interface OrderDetailsModalProps {
  orderId: string;
  onClose: () => void;
}

export function OrderDetailsModal({ orderId, onClose }: OrderDetailsModalProps) {
  // Mock data for the specific order (Ideally fetched via useOrderQuery)
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
    },
    currentStatus: 'Processing' as OrderStatus
  };

  const { 
    register, 
    handleSubmit, 
    errors, 
    control, 
    isSubmitting 
  } = useOrderForm({
    initialStatus: orderData.currentStatus,
    onSuccess: onClose,
  });

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
                <OrderItemsList items={orderData.items} />
                <OrderSummary summary={orderData.summary} />
             </div>

             {/* Right Column: Customer & Status */}
             <div className="bg-muted/20 p-8 space-y-10">
                <OrderFulfillment 
                  register={register} 
                  control={control} 
                  handleSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
                <CustomerDetails 
                  customer={orderData.customer} 
                  payment={orderData.payment} 
                />
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

