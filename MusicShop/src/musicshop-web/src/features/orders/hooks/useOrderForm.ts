import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { OrderStatus } from '../types';

const orderStatusSchema = z.object({
  status: z.enum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']),
  trackingNumber: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderStatusSchema>;

interface UseOrderFormProps {
  initialStatus: OrderStatus;
  onSuccess: () => void;
}

export function useOrderForm({ initialStatus, onSuccess }: UseOrderFormProps) {
  const form = useForm({
    defaultValues: {
      status: initialStatus as any,
      trackingNumber: '',
    } as OrderFormValues,
    onSubmit: async ({ value }) => {
      // Simulate API call
      console.log('Updating order status:', value);
      await new Promise((resolve) => setTimeout(resolve, 800));
      // In real app, call API here
      onSuccess();
    },
  });

  return {
    form,
  };
}
