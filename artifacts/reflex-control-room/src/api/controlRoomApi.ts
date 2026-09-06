import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../config/api";

export interface Delivery {
  id: string;
  sprintId?: string;
  title: string;
  status:
    | "PENDING"
    | "pending"
    | "IN_PROGRESS"
    | "in_progress"
    | "COMPLETED"
    | "completed"
    | "FAILED"
    | "failed";
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  metrics?: Record<string, unknown>;
}

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: {
    code?: string;
    message?: string;
  };
}

interface DeliveryListData {
  deliveries?: Delivery[];
}

interface DeliveryData {
  delivery?: Delivery;
}

export async function fetchDeliveries(): Promise<Delivery[]> {
  const result =
    await apiClient<ApiEnvelope<DeliveryListData>>(
      API_ENDPOINTS.DELIVERIES
    );

  if (!result.success) {
    throw new Error(
      result.error?.message ||
        "Failed to fetch deliveries."
    );
  }

  return result.data?.deliveries || [];
}

export async function fetchDeliveryById(
  id: string
): Promise<Delivery> {
  const result =
    await apiClient<ApiEnvelope<DeliveryData>>(
      API_ENDPOINTS.DELIVERY_BY_ID(id)
    );

  if (!result.success || !result.data?.delivery) {
    throw new Error(
      result.error?.message ||
        "Failed to fetch delivery."
    );
  }

  return result.data.delivery;
}

export async function updateDeliveryStatus(
  id: string,
  status: Delivery["status"]
): Promise<Delivery> {
  const result =
    await apiClient<ApiEnvelope<DeliveryData>>(
      API_ENDPOINTS.DELIVERY_STATUS(id),
      {
        method: "PATCH",
        body: JSON.stringify({
          status: String(status).toUpperCase(),
        }),
      }
    );

  if (!result.success || !result.data?.delivery) {
    throw new Error(
      result.error?.message ||
        "Failed to update delivery status."
    );
  }

  return result.data.delivery;
}

export async function createDelivery(
  data: unknown
): Promise<Delivery> {
  const result =
    await apiClient<ApiEnvelope<DeliveryData>>(
      API_ENDPOINTS.DELIVERIES,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

  if (!result.success || !result.data?.delivery) {
    throw new Error(
      result.error?.message ||
        "Failed to create delivery."
    );
  }

  return result.data.delivery;
}