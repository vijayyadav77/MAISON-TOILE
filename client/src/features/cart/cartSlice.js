import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from './services/cartService.js';

const storedLocalCart = localStorage.getItem('maison_guest_cart');

const initialState = {
  items: storedLocalCart ? JSON.parse(storedLocalCart) : [],
  subtotal: 0,
  shippingFee: 0,
  taxAmount: 0,
  discountAmount: 0,
  totalAmount: 0,
  appliedCoupon: null,
  isDrawerOpen: false,
  loading: false,
  error: null,
};

// Recalculate local totals for guest session
const computeLocalTotals = (items, coupon = null) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = subtotal >= 15000 || subtotal === 0 ? 0 : 500;
  const taxAmount = Math.round(subtotal * 0.12);
  let discountAmount = 0;
  if (coupon) {
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = Math.min(coupon.discountValue, subtotal);
    }
  }
  const totalAmount = Math.max(0, subtotal + shippingFee + taxAmount - discountAmount);
  return { subtotal, shippingFee, taxAmount, discountAmount, totalAmount };
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.isAuthenticated) {
      return null;
    }
    try {
      const data = await cartService.getCart();
      return data.cart;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addItemToCart = createAsyncThunk(
  'cart/addItemToCart',
  async (itemData, { getState, rejectWithValue }) => {
    const { auth, cart } = getState();
    if (auth.isAuthenticated) {
      try {
        const data = await cartService.addToCart(itemData);
        return data.cart;
      } catch (err) {
        return rejectWithValue(err.message);
      }
    } else {
      // Guest local cart handling
      const existing = cart.items.find(
        (i) => i.productId === itemData.productId && i.size === itemData.size && i.color === itemData.color
      );
      let updatedItems;
      if (existing) {
        updatedItems = cart.items.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + itemData.quantity } : i
        );
      } else {
        updatedItems = [...cart.items, { ...itemData, _id: `guest_${Date.now()}` }];
      }
      localStorage.setItem('maison_guest_cart', JSON.stringify(updatedItems));
      return { items: updatedItems, local: true };
    }
  }
);

export const updateItemQuantity = createAsyncThunk(
  'cart/updateItemQuantity',
  async ({ itemId, quantity }, { getState, rejectWithValue }) => {
    const { auth, cart } = getState();
    if (auth.isAuthenticated) {
      try {
        const data = await cartService.updateCartItem(itemId, quantity);
        return data.cart;
      } catch (err) {
        return rejectWithValue(err.message);
      }
    } else {
      const updatedItems = cart.items.map((i) =>
        i._id === itemId ? { ...i, quantity } : i
      );
      localStorage.setItem('maison_guest_cart', JSON.stringify(updatedItems));
      return { items: updatedItems, local: true };
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  'cart/removeItemFromCart',
  async (itemId, { getState, rejectWithValue }) => {
    const { auth, cart } = getState();
    if (auth.isAuthenticated) {
      try {
        const data = await cartService.removeCartItem(itemId);
        return data.cart;
      } catch (err) {
        return rejectWithValue(err.message);
      }
    } else {
      const updatedItems = cart.items.filter((i) => i._id !== itemId);
      localStorage.setItem('maison_guest_cart', JSON.stringify(updatedItems));
      return { items: updatedItems, local: true };
    }
  }
);

export const applyCouponCode = createAsyncThunk(
  'cart/applyCouponCode',
  async (code, { getState, rejectWithValue }) => {
    const { cart } = getState();
    try {
      const data = await cartService.validateCoupon(code, cart.subtotal);
      return data.coupon;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const syncGuestCartToBackend = createAsyncThunk(
  'cart/syncGuestCartToBackend',
  async (_, { getState, rejectWithValue }) => {
    const local = localStorage.getItem('maison_guest_cart');
    if (!local) return null;
    const items = JSON.parse(local);
    if (!items.length) return null;

    try {
      const data = await cartService.syncCart(items);
      localStorage.removeItem('maison_guest_cart');
      return data.cart;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    openCartDrawer: (state) => {
      state.isDrawerOpen = true;
    },
    closeCartDrawer: (state) => {
      state.isDrawerOpen = false;
    },
    removeAppliedCoupon: (state) => {
      state.appliedCoupon = null;
      const totals = computeLocalTotals(state.items, null);
      Object.assign(state, totals);
    },
    clearLocalCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.shippingFee = 0;
      state.taxAmount = 0;
      state.discountAmount = 0;
      state.totalAmount = 0;
      state.appliedCoupon = null;
      localStorage.removeItem('maison_guest_cart');
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = action.payload.items || [];
          state.subtotal = action.payload.subtotal || 0;
          state.shippingFee = action.payload.shippingFee || 0;
          state.taxAmount = action.payload.taxAmount || 0;
          state.discountAmount = action.payload.discountAmount || 0;
          state.totalAmount = action.payload.totalAmount || 0;
          state.appliedCoupon = action.payload.appliedCoupon || null;
        }
      })
      // Add Item
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.isDrawerOpen = true;
        if (action.payload.local) {
          state.items = action.payload.items;
          const totals = computeLocalTotals(state.items, state.appliedCoupon);
          Object.assign(state, totals);
        } else {
          state.items = action.payload.items || [];
          state.subtotal = action.payload.subtotal || 0;
          state.shippingFee = action.payload.shippingFee || 0;
          state.taxAmount = action.payload.taxAmount || 0;
          state.discountAmount = action.payload.discountAmount || 0;
          state.totalAmount = action.payload.totalAmount || 0;
          state.appliedCoupon = action.payload.appliedCoupon || null;
        }
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Item
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        if (action.payload.local) {
          state.items = action.payload.items;
          const totals = computeLocalTotals(state.items, state.appliedCoupon);
          Object.assign(state, totals);
        } else {
          state.items = action.payload.items || [];
          state.subtotal = action.payload.subtotal || 0;
          state.shippingFee = action.payload.shippingFee || 0;
          state.taxAmount = action.payload.taxAmount || 0;
          state.discountAmount = action.payload.discountAmount || 0;
          state.totalAmount = action.payload.totalAmount || 0;
        }
      })
      // Remove Item
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        if (action.payload.local) {
          state.items = action.payload.items;
          const totals = computeLocalTotals(state.items, state.appliedCoupon);
          Object.assign(state, totals);
        } else {
          state.items = action.payload.items || [];
          state.subtotal = action.payload.subtotal || 0;
          state.shippingFee = action.payload.shippingFee || 0;
          state.taxAmount = action.payload.taxAmount || 0;
          state.discountAmount = action.payload.discountAmount || 0;
          state.totalAmount = action.payload.totalAmount || 0;
        }
      })
      // Apply Coupon
      .addCase(applyCouponCode.fulfilled, (state, action) => {
        state.appliedCoupon = action.payload;
        const totals = computeLocalTotals(state.items, action.payload);
        Object.assign(state, totals);
      })
      // Sync guest cart
      .addCase(syncGuestCartToBackend.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = action.payload.items || [];
          state.subtotal = action.payload.subtotal || 0;
          state.shippingFee = action.payload.shippingFee || 0;
          state.taxAmount = action.payload.taxAmount || 0;
          state.discountAmount = action.payload.discountAmount || 0;
          state.totalAmount = action.payload.totalAmount || 0;
          state.appliedCoupon = action.payload.appliedCoupon || null;
        }
      });
  },
});

export const { openCartDrawer, closeCartDrawer, removeAppliedCoupon, clearLocalCart } = cartSlice.actions;
export default cartSlice.reducer;
