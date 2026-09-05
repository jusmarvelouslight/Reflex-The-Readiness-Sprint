import type {
  Delivery,
  DeliveryItem,
  Rider,
  DeliveryStatus,
} from "../types/delivery";
import API_BASE_URL from "../config/api";

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: {
    message?: string;
    code?: string;
  };
}

export interface DashboardActivity {
  id: string;
  title: string;
  description: string;
  time: string;
  status: string;
}

export interface DashboardData {
  metrics: Array<{
    label: string;
    value: number;
    detail: string;
    trend: string;
    tone: "plum" | "lavender" | "success" | "blush";
    icon: "package" | "truck" | "check" | "warning";
  }>;
  activity: DashboardActivity[];
  health: {
    score: number;
    deliverySuccess: number;
    riderAvailability: number;
    responseTime: string;
  };
}

export interface ControlRoomRider extends Rider {
  initials: string;
  area: string;
  activeDeliveries: number;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const contentType = response.headers.get("content-type") ?? "";

  let result: ApiEnvelope<T> | null = null;

  if (contentType.includes("application/json")) {
    result = (await response.json()) as ApiEnvelope<T>;
  } else {
    const text = await response.text();

    throw new Error(
      text ||
        `The server returned an unexpected response (${response.status}).`,
    );
  }

  if (
    !response.ok ||
    !result.success ||
    result.data === undefined
  ) {
    throw new Error(
      result.error?.message ||
        `The request could not be completed (${response.status}).`,
    );
  }

  return result.data;
}

export async function getDashboard(): Promise<DashboardData> {
  return request<DashboardData>("/dashboard");
}

export async function getControlRoomDeliveries(): Promise<Delivery[]> {
  const result = await request<{ deliveries: Delivery[] }>(
    "/deliveries",
  );

  return result.deliveries;
}

export async function createControlRoomDelivery(data: {
  customerName: string;
  address: string;
  items: DeliveryItem[];
}): Promise<Delivery> {
  const result = await request<{ delivery: Delivery }>(
    "/deliveries",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );

  return result.delivery;
}

export async function getControlRoomRiders(): Promise<
  ControlRoomRider[]
> {
  const result = await request<{
    riders: ControlRoomRider[];
  }>("/riders");

  return result.riders;
}

export async function assignControlRoomRider(
  deliveryId: string,
  riderId: string,
): Promise<Delivery> {
  const result = await request<{ delivery: Delivery }>(
    `/deliveries/${encodeURIComponent(deliveryId)}/assign`,
    {
      method: "PATCH",
      body: JSON.stringify({
        riderId,
      }),
    },
  );

  return result.delivery;
}

export async function updateControlRoomDeliveryStatus(
  deliveryId: string,
  status: DeliveryStatus,
): Promise<Delivery> {
  const result = await request<{ delivery: Delivery }>(
    `/deliveries/${encodeURIComponent(deliveryId)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({
        status,
      }),
    },
  );

  return result.delivery;
}