import React from 'react';
import { CartItem } from '../types';
import { useCartMutations } from '../hooks/useCartMutations';
import { Button } from '@/shared/components';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CartItemComponentProps {
  item: CartItem;
}

export function CartItemComponent({ item }: CartItemComponentProps) {
  const { updateItem, removeItem } = useCartMutations();

  const handleIncrement = () => {
    updateItem.mutate({ id: item.id, request: { quantity: item.quantity + 1 } });
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateItem.mutate({ id: item.id, request: { quantity: item.quantity - 1 } });
    } else {
      removeItem.mutate(item.id);
    }
  };

  const handleRemove = () => {
    removeItem.mutate(item.id);
  };

  return (
    <div className="flex gap-4 py-4 border-b border-border">
      <div className="h-20 w-20 rounded-xl overflow-hidden bg-muted shrink-0 border border-border shadow-sm relative">
        <img
          src={item.coverUrl || '/images/placeholder-album.png'}
          alt={item.productName}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start gap-2">
          <Link to={`/products/${item.productId}`} className="font-bold text-foreground line-clamp-2 hover:text-primary transition-colors text-sm">
            {item.productName}
          </Link>
          <span className="font-black text-foreground shrink-0">${item.subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 border border-border">
            <button
              onClick={handleDecrement}
              disabled={updateItem.isPending}
              className="h-6 w-6 flex items-center justify-center rounded hover:bg-surface text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
            <button
              onClick={handleIncrement}
              disabled={updateItem.isPending || !item.inStock}
              className="h-6 w-6 flex items-center justify-center rounded hover:bg-surface text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <button
            onClick={handleRemove}
            disabled={removeItem.isPending}
            className="text-muted-foreground hover:text-red-500 transition-colors p-1"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        {!item.inStock && (
          <p className="text-[10px] uppercase font-black text-red-400 mt-1">Out of stock</p>
        )}
      </div>
    </div>
  );
}
