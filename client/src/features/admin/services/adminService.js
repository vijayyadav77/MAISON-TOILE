import apiClient from '../../../services/apiClient.js';
import { API_ENDPOINTS } from '../../../services/apiEndpoints.js';

export const adminService = {
  getAnalytics: () => apiClient.get(API_ENDPOINTS.ADMIN.ANALYTICS),
  getProducts: () => apiClient.get(API_ENDPOINTS.ADMIN.PRODUCTS),
  createProduct: (data) => apiClient.post(API_ENDPOINTS.ADMIN.PRODUCTS, data),
  updateProduct: (id, data) => apiClient.put(API_ENDPOINTS.ADMIN.PRODUCT_DETAILS(id), data),
  deleteProduct: (id) => apiClient.delete(API_ENDPOINTS.ADMIN.PRODUCT_DETAILS(id)),
  getOrders: () => apiClient.get(API_ENDPOINTS.ADMIN.ORDERS),
  updateOrderStatus: (id, orderStatus, note) => apiClient.put(API_ENDPOINTS.ADMIN.UPDATE_ORDER_STATUS(id), { orderStatus, note }),
  getUsers: () => apiClient.get(API_ENDPOINTS.ADMIN.USERS),
};
