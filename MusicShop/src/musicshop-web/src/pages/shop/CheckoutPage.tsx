import React from 'react';
import { CheckoutForm } from '@/features/checkout/components/CheckoutForm';
import { PageHeader } from '@/shared/components';
import { ShoppingBag } from 'lucide-react';

export function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader 
        title="Checkout" 
        description="Complete your order to proceed to payment" 
        icon={<ShoppingBag className="h-8 w-8 text-primary" />} 
      />
      
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <CheckoutForm />
      </div>
    </div>
  );
}
