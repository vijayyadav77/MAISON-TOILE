import apiClient from '../../../services/apiClient.js';
import { API_ENDPOINTS } from '../../../services/apiEndpoints.js';

export const authService = {
  register: (userData) => apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData),
  login: (credentials) => apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  logout: () => apiClient.post(API_ENDPOINTS.AUTH.LOGOUT),
  getMe: () => apiClient.get(API_ENDPOINTS.AUTH.ME),
  updateProfile: (profileData) => apiClient.put(API_ENDPOINTS.AUTH.PROFILE, profileData),
  addAddress: (addressData) => apiClient.post(API_ENDPOINTS.AUTH.ADDRESSES, addressData),
  updateAddress: (id, addressData) => apiClient.put(`${API_ENDPOINTS.AUTH.ADDRESSES}/${id}`, addressData),
  deleteAddress: (id) => apiClient.delete(`${API_ENDPOINTS.AUTH.ADDRESSES}/${id}`),
};
