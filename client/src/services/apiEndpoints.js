export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
    ADDRESSES: '/auth/addresses',
  },
  // Products & Categories
  PRODUCTS: {
    LIST: '/products',
    DETAILS: (id) => `/products/${id}`,
    RELATED: (id) => `/products/${id}/related`,
    FACETS: '/products/facets/all',
  },
  CATEGORIES: {
    LIST: '/categories',
    DETAILS: (slug) => `/categories/${slug}`,
  },
  // Cart & Wishlist
  CART: {
    GET: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: (id) => `/cart/items/${id}`,
    REMOVE_ITEM: (id) => `/cart/items/${id}`,
    CLEAR: '/cart',
    SYNC: '/cart/sync',
  },
  WISHLIST: {
    GET: '/wishlist',
    ADD: (id) => `/wishlist/${id}`,
    REMOVE: (id) => `/wishlist/${id}`,
  },
  // Orders & Payment
  ORDERS: {
    CREATE: '/orders',
    MY_ORDERS: '/orders/my-orders',
    DETAILS: (id) => `/orders/${id}`,
    CANCEL: (id) => `/orders/${id}/cancel`,
  },
  PAYMENTS: {
    CREATE_ORDER: '/payments/create-order',
    VERIFY: '/payments/verify',
  },
  // Coupons & Reviews
  COUPONS: {
    VALIDATE: '/coupons/validate',
  },
  REVIEWS: {
    PRODUCT_REVIEWS: (productId) => `/reviews/product/${productId}`,
    CREATE: (productId) => `/reviews/product/${productId}`,
  },
  // Admin
  ADMIN: {
    ANALYTICS: '/admin/analytics',
    PRODUCTS: '/admin/products',
    PRODUCT_DETAILS: (id) => `/admin/products/${id}`,
    ORDERS: '/admin/orders',
    UPDATE_ORDER_STATUS: (id) => `/admin/orders/${id}/status`,
    USERS: '/admin/users',
  },
};
