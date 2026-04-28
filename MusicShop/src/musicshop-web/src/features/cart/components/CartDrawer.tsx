import React, { useEffect } from 'react';
import { useCartUIStore } from '../store/useCartUIStore';
import { useCart } from '../hooks/useCart';
import { useCartMutations } from '../hooks/useCartMutations';
import { CartItemComponent } from './CartItemComponent';
import { Button } from '@/shared/components';
import { ShoppingCart, X, CreditCard, AlertCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';

export function CartDrawer() {
  const { isOpen, closeCart } = useCartUIStore();
  const { cart, isLoading, error, isEmpty } = useCart();
  const { clearCart } = useCartMutations();
  const { pathname } = useLocation();
  const isAuthenticated = useAuthStore((state) => !!state.accessToken);

  // Close cart when navigating
  useEffect(() => {
    closeCart();
  }, [pathname, closeCart]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [closeCart]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-300"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-background shadow-2xl z-[100] animate-in slide-in-from-right duration-300 flex flex-col border-l border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h2 className="font-black text-xl text-foreground">Your Cart</h2>
            {cart && cart.totalItems > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full ml-2">
                {cart.totalItems}
              </span>
            )}
          </div>
          <button 
            onClick={closeCart}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col gap-4">
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <ShoppingCart className="h-16 w-16 text-subtle" />
              <div>
                <h3 className="font-bold text-lg mb-1">Sign in to view cart</h3>
                <p className="text-muted-foreground text-sm">You need to be logged in to manage your shopping cart.</p>
              </div>
              <Link to="/login" onClick={closeCart}>
                <Button className="rounded-xl w-full">Sign In</Button>
              </Link>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground text-sm font-medium">Loading cart...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-2 text-red-500">
              <AlertCircle className="h-12 w-12 mb-2" />
              <p className="font-bold">{error}</p>
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="h-10 w-10 text-subtle" />
              </div>
              <h3 className="font-black text-xl text-foreground">Your cart is empty</h3>
              <p className="text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
              <Link to="/products" onClick={closeCart}>
                <Button className="mt-4 rounded-xl px-8 h-12">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col">
              {cart.items.map((item) => (
                <CartItemComponent key={item.id} item={item} />
              ))}
              
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={() => clearCart.mutate()}
                  disabled={clearCart.isPending}
                  className="text-xs text-muted-foreground hover:text-red-500 font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {isAuthenticated && cart && !isEmpty && (
          <div className="p-6 border-t border-border bg-surface">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-medium text-foreground">${cart.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between items-end">
                <span className="font-bold text-foreground">Total</span>
                <span className="text-3xl font-black text-primary">${cart.totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <Link to="/checkout" onClick={closeCart}>
              <Button className="w-full h-14 text-lg rounded-2xl bg-primary hover:bg-primary-dark text-primary-foreground shadow-xl shadow-primary/20">
                <CreditCard className="h-5 w-5 mr-2" />
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
