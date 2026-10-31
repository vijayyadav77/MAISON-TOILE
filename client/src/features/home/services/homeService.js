import apiClient from '../../../services/apiClient.js';
import { API_ENDPOINTS } from '../../../services/apiEndpoints.js';

export const homeService = {
  getFeaturedProducts: () => apiClient.get(API_ENDPOINTS.PRODUCTS.LIST, { params: { featured: true, limit: 8 } }),
  getTrendingProducts: () => apiClient.get(API_ENDPOINTS.PRODUCTS.LIST, { params: { trending: true, limit: 4 } }),
  getNewArrivals: () => apiClient.get(API_ENDPOINTS.PRODUCTS.LIST, { params: { newArrival: true, limit: 4 } }),
  getCategories: () => apiClient.get(API_ENDPOINTS.CATEGORIES.LIST),
};
