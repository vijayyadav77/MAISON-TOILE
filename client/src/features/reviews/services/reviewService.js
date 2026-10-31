import apiClient from '../../../services/apiClient.js';
import { API_ENDPOINTS } from '../../../services/apiEndpoints.js';

export const reviewService = {
  getProductReviews: (productId) => apiClient.get(API_ENDPOINTS.REVIEWS.PRODUCT_REVIEWS(productId)),
  createReview: (productId, reviewData) => apiClient.post(API_ENDPOINTS.REVIEWS.CREATE(productId), reviewData),
};
