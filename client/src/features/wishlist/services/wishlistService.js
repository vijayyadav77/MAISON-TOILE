import apiClient from '../../../services/apiClient.js';
import { API_ENDPOINTS } from '../../../services/apiEndpoints.js';

export const wishlistService = {
  getWishlist: () => apiClient.get(API_ENDPOINTS.WISHLIST.GET),
  addToWishlist: (productId) => apiClient.post(API_ENDPOINTS.WISHLIST.ADD(productId)),
  removeFromWishlist: (productId) => apiClient.delete(API_ENDPOINTS.WISHLIST.REMOVE(productId)),
};
