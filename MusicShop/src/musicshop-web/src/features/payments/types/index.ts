export enum PaymentStatus {
  Pending = 0,
  Success = 1,
  Failed = 2,
}

export interface Payment {
  id: string;
  orderId: string;
  method: 'stripe';
  amount: number;
  transactionCode?: string;
  status: PaymentStatus;
  paidAt?: string;
}

export interface StripeSessionResponse {
  sessionId: string;
  checkoutUrl: string;
}
