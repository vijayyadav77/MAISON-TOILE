import apiClient from '../../../services/apiClient.js';
import { API_ENDPOINTS } from '../../../services/apiEndpoints.js';

export const checkoutService = {
  createOrder: (orderData) => apiClient.post(API_ENDPOINTS.ORDERS.CREATE, orderData),
  createRazorpayOrder: (orderId) => apiClient.post(API_ENDPOINTS.PAYMENTS.CREATE_ORDER, { orderId }),
  verifyPayment: (paymentData) => apiClient.post(API_ENDPOINTS.PAYMENTS.VERIFY, paymentData),
};
