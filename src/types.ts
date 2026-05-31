export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string; // URL Cloudinary ou autre
  stock: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartContextType {
  cart: CartItem[];
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}
