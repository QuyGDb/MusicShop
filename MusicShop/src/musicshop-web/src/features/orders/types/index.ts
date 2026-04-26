export enum OrderStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled'
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  date: string;
  total: number;
  status: OrderStatus;
  itemsCount: number;
}
