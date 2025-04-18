import { createSlice } from '@reduxjs/toolkit';
import { toast } from "react-toastify"

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      
      if (existingItem) {
        existingItem.quantity += 1;
        toast.success(`${action.payload.name} quantity increased!`);
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
        toast.success(`${action.payload.name} added to cart!`);
      }
    },
    incrementQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
        toast.success(`${item.name} quantity increased!`);
      }
    },
    decrementQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        toast.info(`${item.name} quantity decreased!`);
      }
    },
    removeItem: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        state.items = state.items.filter((item) => item.id !== action.payload);
        toast.error(`${item.name} removed from cart!`);
      }
    },
    clearCart: (state) => {
      if (state.items.length > 0) {
        toast.error('Cart cleared!');
      }
      state.items = [];
    },
  },
});

export const {
  addItem,
  incrementQuantity,
  decrementQuantity,
  removeItem,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;