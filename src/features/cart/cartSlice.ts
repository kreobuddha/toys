import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { IProduct } from '@/api/types';

export interface ICartItem {
  productId: number;
  quantity: number;
  // Snapshot so the cart renders without refetching every product.
  title: string;
  price: number;
  currency: string;
  image?: string;
}

export interface ICartState {
  items: ICartItem[];
}

const STORAGE_KEY = 'toys.cart';

const loadCart = (): ICartState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ICartState) : { items: [] };
  } catch {
    return { items: [] };
  }
};

export const persistCart = (state: ICartState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable (private mode etc.) — cart lives in memory only
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCart,
  reducers: {
    addItem(state, action: PayloadAction<IProduct>) {
      const p = action.payload;
      const existing = state.items.find((i) => i.productId === p.id);
      if (existing) {
        existing.quantity += 1;
        return;
      }
      state.items.push({
        productId: p.id,
        quantity: 1,
        title: p.title,
        price: p.price,
        currency: p.currency,
        image: p.images[0],
      });
    },
    setQuantity(state, action: PayloadAction<{ productId: number; quantity: number }>) {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (!item) return;
      if (quantity <= 0) {
        state.items = state.items.filter((i) => i.productId !== productId);
      } else {
        item.quantity = quantity;
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, setQuantity, removeItem, clearCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

export const selectCartItems = (s: RootState): ICartItem[] => s.cart.items;
export const selectCartCount = (s: RootState): number =>
  s.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartTotal = (s: RootState): number =>
  s.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
