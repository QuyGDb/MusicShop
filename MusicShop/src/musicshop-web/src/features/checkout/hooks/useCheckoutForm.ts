import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateOrderRequest } from '../types';

const checkoutSchema = z.object({
  recipientName: z.string().min(1, 'Recipient name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  shippingAddress: z.string().min(5, 'Shipping address is required'),
  note: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function useCheckoutForm(onSubmit: (data: CreateOrderRequest) => Promise<void>) {
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      recipientName: '',
      phone: '',
      shippingAddress: '',
      note: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit({
      ...values,
      paymentGateway: 'Stripe',
      successUrl: `${window.location.origin}/checkout/success`,
      cancelUrl: `${window.location.origin}/checkout/cancel`,
    });
  });

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
}
