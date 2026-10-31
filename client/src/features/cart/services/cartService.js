import apiClient from '../../../services/apiClient.js';
import { API_ENDPOINTS } from '../../../services/apiEndpoints.js';

export const cartService = {
  getCart: () => apiClient.get(API_ENDPOINTS.CART.GET),
  addToCart: (itemData) => apiClient.post(API_ENDPOINTS.CART.ADD_ITEM, itemData),
  updateCartItem: (itemId, quantity) => apiClient.put(API_ENDPOINTS.CART.UPDATE_ITEM(itemId), { quantity }),
  removeCartItem: (itemId) => apiClient.delete(API_ENDPOINTS.CART.REMOVE_ITEM(itemId)),
  clearCart: () => apiClient.delete(API_ENDPOINTS.CART.CLEAR),
  syncCart: (localItems) => apiClient.post(API_ENDPOINTS.CART.SYNC, { localItems }),
  validateCoupon: (code, cartTotal) => apiClient.post(API_ENDPOINTS.COUPONS.VALIDATE, { code, cartTotal }),
};
