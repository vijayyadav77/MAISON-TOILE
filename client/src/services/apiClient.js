import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('maison_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for centralized error extraction
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred.';
    
    // Auto clear expired token on 401
    if (error.response?.status === 401) {
      if (localStorage.getItem('maison_token')) {
        localStorage.removeItem('maison_token');
        localStorage.removeItem('maison_user');
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
