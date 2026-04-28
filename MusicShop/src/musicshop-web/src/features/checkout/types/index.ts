export interface CreateOrderRequest {
  recipientName: string;
  phone: string;
  shippingAddress: string;
  paymentGateway: 'Stripe';
  successUrl?: string;
  cancelUrl?: string;
  note?: string;
}

export interface OrderSummaryDto {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export interface PaymentSummaryDto {
  id: string;
  method: string;
  status: string;
  checkoutUrl: string;
}

export interface CreateOrderResponse {
  order: OrderSummaryDto;
  payment: PaymentSummaryDto;
}
