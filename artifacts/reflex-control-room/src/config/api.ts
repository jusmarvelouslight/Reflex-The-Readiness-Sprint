export const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 
  (typeof window !== 'undefined' ? window.location.origin : '');

export const API_ENDPOINTS = {
  DELIVERIES: '/api/deliveries',
  USER_DELIVERIES: (userId: string) => `/api/deliveries/user/${userId}`,
  DELIVERY_BY_ID: (id: string) => `/api/deliveries/${id}`,
  BACKEND_PROXY: '/api/proxy',
};