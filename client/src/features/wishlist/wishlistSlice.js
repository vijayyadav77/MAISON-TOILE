import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistService } from './services/wishlistService.js';

const storedLocalWishlist = localStorage.getItem('maison_guest_wishlist');

const initialState = {
  items: storedLocalWishlist ? JSON.parse(storedLocalWishlist) : [],
  isDrawerOpen: false,
  loading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.isAuthenticated) return null;
    try {
      const data = await wishlistService.getWishlist();
      return data.products;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleWishlistItem = createAsyncThunk(
  'wishlist/toggleWishlistItem',
  async (product, { getState, rejectWithValue }) => {
    const { auth, wishlist } = getState();
    const productId = product._id || product.id;
    const exists = wishlist.items.some((p) => (p._id || p.id) === productId);

    if (auth.isAuthenticated) {
      try {
        if (exists) {
          const data = await wishlistService.removeFromWishlist(productId);
          return data.products;
        } else {
          const data = await wishlistService.addToWishlist(productId);
          return data.products;
        }
      } catch (err) {
        return rejectWithValue(err.message);
      }
    } else {
      // Guest local wishlist
      let updated;
      if (exists) {
        updated = wishlist.items.filter((p) => (p._id || p.id) !== productId);
      } else {
        updated = [...wishlist.items, product];
      }
      localStorage.setItem('maison_guest_wishlist', JSON.stringify(updated));
      return updated;
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    openWishlistDrawer: (state) => {
      state.isDrawerOpen = true;
    },
    closeWishlistDrawer: (state) => {
      state.isDrawerOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = action.payload;
        }
      })
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { openWishlistDrawer, closeWishlistDrawer } = wishlistSlice.actions;
export default wishlistSlice.reducer;
