const configuredBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL = (
  configuredBaseUrl ||
  "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

export const API_ENDPOINTS = {
  HEALTH: "/health",
  DELIVERIES: "/deliveries",
  DELIVERY_BY_ID: (id: string) =>
    `/deliveries/${encodeURIComponent(id)}`,
  DELIVERY_STATUS: (id: string) =>
    `/deliveries/${encodeURIComponent(id)}/status`,
  DELIVERY_ASSIGN: (id: string) =>
    `/deliveries/${encodeURIComponent(id)}/assign`,
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  ME: "/auth/me",
} as const;