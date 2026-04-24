import { useState } from 'react';
import { ShoppingBag, Clock, Truck, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Order, OrderStatus } from '../types';

const MOCK_ORDERS: Order[] = [
  { id: 'ORD-7721', customerName: 'John Doe', email: 'john@example.com', date: '2026-04-18', total: 125.50, status: 'Processing', itemsCount: 3 },
  { id: 'ORD-7722', customerName: 'Jane Smith', email: 'jane@example.com', date: '2026-04-19', total: 45.00, status: 'Pending', itemsCount: 1 },
  { id: 'ORD-7723', customerName: 'Mike Johnson', email: 'mike@example.com', date: '2026-04-19', total: 89.99, status: 'Shipped', itemsCount: 2 },
  { id: 'ORD-7724', customerName: 'Sarah Williams', email: 'sarah@example.com', date: '2026-04-20', total: 210.00, status: 'Delivered', itemsCount: 5 },
  { id: 'ORD-7725', customerName: 'David Brown', email: 'david@example.com', date: '2026-04-20', total: 60.00, status: 'Cancelled', itemsCount: 2 },
];

const statusStyles: Record<OrderStatus, { color: string, icon: any }> = {
  Pending: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
  Processing: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: AlertCircle },
  Shipped: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Truck },
  Delivered: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  Cancelled: { color: 'bg-muted text-subtle border-border', icon: X }
};

export function useOrderManagement() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders] = useState<Order[]>(MOCK_ORDERS);

  const stats = [
    { label: 'Pending Orders', value: '12', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'To Ship', value: '08', icon: Truck, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Processing', value: '04', icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Today Revenue', value: '$1,250', icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  return {
    orders,
    stats,
    statusStyles,
    selectedOrderId: selectedOrder?.id ?? null,
    actions: {
      openDetails: (order: Order) => setSelectedOrder(order),
      closeDetails: () => setSelectedOrder(null),
    }
  };
}
