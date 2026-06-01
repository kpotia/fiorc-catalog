import { atom, computed } from 'nanostores';
import type { CartItem } from './types';

const STORAGE_KEY = 'whatsapp-shop-cart';

export const cartItems = atom<CartItem[]>([]);
export const cartCount = computed(cartItems, (items) =>
  items.reduce((total, item) => total + item.quantity, 0)
);
export const cartTotal = computed(cartItems, (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0)
);
export const cartUi = atom({ isOpen: false });

const readCartStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeCartStorage = (items: CartItem[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const syncFromStorage = () => {
  const storedCart = readCartStorage();
  if (storedCart.length > 0) {
    cartItems.set(storedCart);
  }
};

if (typeof window !== 'undefined') {
  cartItems.listen((items) => {
    writeCartStorage(items);
  });
}

export const initCartStore = () => {
  if (typeof window === 'undefined') return;
  syncFromStorage();

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      syncFromStorage();
    }
  };

  window.addEventListener('storage', handleStorage);
  return () => window.removeEventListener('storage', handleStorage);
};

export const openCart = () => cartUi.set({ isOpen: true });
export const closeCart = () => cartUi.set({ isOpen: false });
export const toggleCart = () => {
  const current = cartUi.get();
  cartUi.set({ isOpen: !current.isOpen });
};

export const addItem = (product: Omit<CartItem, 'quantity'>) => {
  const current = cartItems.get();
  const existing = current.find((item) => item.id === product.id);
  if (existing) {
    cartItems.set(
      current.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    return;
  }

  cartItems.set([...current, { ...product, quantity: 1 }]);
};

export const removeItem = (id: string) => {
  cartItems.set(cartItems.get().filter((item) => item.id !== id));
};

export const updateQuantity = (id: string, quantity: number) => {
  if (quantity <= 0) {
    removeItem(id);
    return;
  }
  cartItems.set(
    cartItems.get().map((item) =>
      item.id === id ? { ...item, quantity } : item
    )
  );
};

export const clearCart = () => {
  cartItems.set([]);
};
