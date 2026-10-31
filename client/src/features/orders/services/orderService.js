import apiClient from '../../../services/apiClient.js';
import { API_ENDPOINTS } from '../../../services/apiEndpoints.js';

export const orderService = {
  getMyOrders: () => apiClient.get(API_ENDPOINTS.ORDERS.MY_ORDERS),
  getOrderDetails: (id) => apiClient.get(API_ENDPOINTS.ORDERS.DETAILS(id)),
  cancelOrder: (id) => apiClient.put(API_ENDPOINTS.ORDERS.CANCEL(id)),
};
