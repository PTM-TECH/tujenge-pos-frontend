import { create } from "zustand";
import type { CartItem, Product } from "@/types";

interface CartState {
  transactionRef: string;
  items: CartItem[];
  discount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  incrementItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
  setDiscount: (amount: number) => void;
  clearCart: () => void;
  // Derived totals
  subtotal: () => number;
  taxTotal: () => number;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  transactionRef: "",
  items: [],
  discount: 0,

  addItem: (product, quantity = 1) => {
    if (product.stock <= 0) return;
    set((state) => {
      const existing = state.items.find((i) => i.productId === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            taxRate: product.taxRate,
          },
        ],
      };
    });
  },

  removeItem: (productId) =>
    set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

  incrementItem: (productId) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
      ),
    })),

  decrementItem: (productId) =>
    set((state) => ({
      items: state.items
        .map((i) => (i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
    })),

  setDiscount: (amount) => set({ discount: Math.max(0, amount) }),

  clearCart: () => set({ items: [], discount: 0 }),

  subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

  taxTotal: () =>
    get().items.reduce((sum, i) => sum + i.price * i.quantity * (i.taxRate / 100), 0),

  total: () => {
    const { subtotal, taxTotal, discount } = get();
    return Math.max(0, subtotal() + taxTotal() - discount);
  },

  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));