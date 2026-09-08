import { configureStore } from '@reduxjs/toolkit';
import { api } from '@/api/api';
import { cartReducer, persistCart } from '@/features/cart/cartSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    cart: cartReducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});

store.subscribe(() => persistCart(store.getState().cart));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
