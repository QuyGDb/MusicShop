import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, Clock, Truck, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { OrderListItem, OrderStatus } from '../types';
import { orderService } from '../services/orderService';

const statusStyles: Record<OrderStatus, { color: string, icon: any }> = {
  [OrderStatus.Pending]: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
  [OrderStatus.Confirmed]: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: AlertCircle },
  [OrderStatus.Shipped]: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Truck },
  [OrderStatus.Delivered]: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  [OrderStatus.Cancelled]: { color: 'bg-muted text-subtle border-border', icon: X }
};

export function useOrderManagement() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'orders', statusFilter],
    queryFn: () => orderService.getAdminOrders({ status: statusFilter, page: 1, limit: 50 }),
  });

  const orders = data?.items ?? [];

  const stats = [
    { label: 'Pending Orders', value: orders.filter(o => o.status === OrderStatus.Pending).length.toString(), icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'To Ship', value: orders.filter(o => o.status === OrderStatus.Confirmed).length.toString(), icon: Truck, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Processing', value: orders.filter(o => o.status === OrderStatus.Shipped).length.toString(), icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Total Sales', value: `$${orders.reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString()}`, icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  return {
    orders,
    isLoading,
    error: error instanceof Error ? error.message : null,
    stats,
    statusStyles,
    selectedOrderId,
    statusFilter,
    actions: {
      openDetails: (order: OrderListItem) => setSelectedOrderId(order.id),
      closeDetails: () => setSelectedOrderId(null),
      setStatusFilter
    }
  };
}
