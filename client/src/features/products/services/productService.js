import apiClient from '../../../services/apiClient.js';
import { API_ENDPOINTS } from '../../../services/apiEndpoints.js';

export const productService = {
  getProducts: (params) => apiClient.get(API_ENDPOINTS.PRODUCTS.LIST, { params }),
  getProductDetails: (identifier) => apiClient.get(API_ENDPOINTS.PRODUCTS.DETAILS(identifier)),
  getRelatedProducts: (id) => apiClient.get(API_ENDPOINTS.PRODUCTS.RELATED(id)),
  getProductFacets: () => apiClient.get(API_ENDPOINTS.PRODUCTS.FACETS),
};
