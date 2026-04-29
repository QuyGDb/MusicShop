export enum OrderStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled'
}

export enum PaymentGateway {
  Stripe = 'Stripe',
}

export enum PaymentStatus {
  Pending = 'Pending',
  Paid = 'Paid',
  Failed = 'Failed',
  Refunded = 'Refunded',
}

// Used in admin list (legacy)
export interface Order {
  id: string;
  customerName: string;
  email: string;
  date: string;
  total: number;
  status: OrderStatus;
  itemsCount: number;
}

// Used in customer order history
export interface OrderListItem {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  itemCount: number;
  recipientName: string;
  email: string;
}

// Full order detail
export interface OrderDetail {
  id: string;
  status: OrderStatus;
  recipientName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  note?: string;
  totalAmount: number;
  trackingNumber?: string;
  createdAt: string;
  items: OrderItemDetail[];
  payment?: PaymentDetail;
}

export interface OrderItemDetail {
  id: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  productId: string;
  productName: string;
  productCoverUrl?: string;
}

export interface PaymentDetail {
  method: PaymentGateway;
  status: PaymentStatus;
  paidAt?: string;
  transactionCode?: string;
}
