import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { ICartItemPreview } from '@/types/order';
import type { IProduct } from '@/types/product';

export interface ICartItem {
  productId: number;
  quantity: number;
  // Snapshot so the cart renders without refetching every product.
  title: string;
  /** Absent in carts stored before slugs reached the routes. */
  slug?: string;
  /** Euro cents, as the catalog prices it. */
  price: number;
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
        slug: p.slug,
        price: p.priceEuroCents ?? 0,
        image: p.imageUrls?.[0],
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
    /** Takes prices and quantities from the catalog; gone and sold-out toys leave the cart. */
    applyCartPreview(state, action: PayloadAction<ICartItemPreview[]>) {
      const previews = new Map(action.payload.map((preview) => [preview.productId, preview]));
      state.items = state.items.flatMap((item) => {
        const current = previews.get(item.productId)?.current;
        const quantity = current?.purchasableQuantity ?? 0;
        if (!current || quantity <= 0) return [];
        return [
          {
            ...item,
            quantity,
            title: current.title,
            price: current.unitPriceEuroCents ?? item.price,
            image: current.imageUrl ?? item.image,
          },
        ];
      });
    },
  },
});

export const { addItem, setQuantity, removeItem, clearCart, applyCartPreview } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

export const selectCartItems = (s: RootState): ICartItem[] => s.cart.items;
export const selectCartCount = (s: RootState): number =>
  s.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartTotal = (s: RootState): number =>
  s.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
