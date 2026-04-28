export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  coverUrl?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  totalPrice: number;
  inStock: boolean;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  updatedAt: string;
  totalAmount: number;
  totalItems: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
