import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orderService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function useOrderDetail(orderId: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['orders', 'detail', orderId],
    queryFn: () => orderService.getOrderDetail(orderId),
    enabled: !!orderId,
  });

  const cancelMutation = useMutation({
    mutationFn: () => orderService.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order cancelled successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to cancel order');
    },
  });

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      cancelMutation.mutate();
    }
  };

  const handleBack = () => {
    navigate('/orders');
  };

  return {
    order,
    isLoading,
    error: error instanceof Error ? error.message : null,
    handleCancel,
    isCancelling: cancelMutation.isPending,
    handleBack,
  };
}
