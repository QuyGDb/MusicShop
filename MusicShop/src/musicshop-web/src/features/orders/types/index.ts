export enum OrderStatus {
  Pending = 0,
  Confirmed = 1,
  Shipped = 2,
  Delivered = 3,
  Completed = 4,
  Cancelled = 5,
}

export interface CartItem {
  id: string;
  productVariantId: string;
  productName: string;
  variantName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  shippingAddress: string;
  recipientName: string;
  phone: string;
  totalAmount: number;
  trackingNumber?: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productVariantId: string;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
}
