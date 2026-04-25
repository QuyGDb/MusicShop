import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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

import { UseFormRegister, Control, FieldErrors } from 'react-hook-form';

interface UseOrderFormReturn {
  register: UseFormRegister<OrderFormValues>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: FieldErrors<OrderFormValues>;
  control: Control<OrderFormValues>;
  isSubmitting: boolean;
}

export function useOrderForm({ initialStatus, onSuccess }: UseOrderFormProps): UseOrderFormReturn {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderStatusSchema) as any,
    defaultValues: {
      status: initialStatus as any,
      trackingNumber: '',
    },
  });

  const onSubmit = async (value: OrderFormValues) => {
    // Simulate API call
    console.log('Updating order status:', value);
    await new Promise((resolve) => setTimeout(resolve, 800));
    // In real app, call API here
    onSuccess();
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit) as any,

    errors,
    control,
    isSubmitting,
  };
}

