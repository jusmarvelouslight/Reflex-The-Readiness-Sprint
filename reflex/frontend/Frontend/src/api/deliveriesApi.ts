
import apiClient from "./apiClient";
import type {
  AssignRiderRequest,
  ConfirmDeliveryRequest,
  CreateDeliveryRequest,
  Delivery,
  UpdateDeliveryStatusRequest,
} from "../types/delivery";

export async function getDeliveries(
  token?: string,
): Promise<Delivery[]> {
  return apiClient<Delivery[]>("/deliveries", {
    method: "GET",
    token,
  });
}

export async function createDelivery(
  data: CreateDeliveryRequest,
  token?: string,
): Promise<Delivery> {
  return apiClient<Delivery>("/deliveries", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
}

export async function assignRider(
  deliveryId: string,
  data: AssignRiderRequest,
  token?: string,
): Promise<Delivery> {
  return apiClient<Delivery>(
    `/deliveries/${deliveryId}/assign`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
      token,
    },
  );
}

export async function updateDeliveryStatus(
  deliveryId: string,
  data: UpdateDeliveryStatusRequest,
  token?: string,
): Promise<Delivery> {
  return apiClient<Delivery>(
    `/deliveries/${deliveryId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
      token,
    },
  );
}

export async function confirmDelivery(
  deliveryId: string,
  data: ConfirmDeliveryRequest,
  token?: string,
): Promise<Delivery> {
  return apiClient<Delivery>(
    `/deliveries/${deliveryId}/confirm`,
    {
      method: "POST",
      body: JSON.stringify(data),
      token,
    },
  );
}

