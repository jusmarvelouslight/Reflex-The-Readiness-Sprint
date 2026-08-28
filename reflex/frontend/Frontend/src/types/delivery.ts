```typescript
export type DeliveryStatus =
  | "REQUESTED"
  | "ASSIGNED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "FAILED"
  | "CANCELLED";

export interface DeliveryItem {
  id: string;
  name: string;
  quantity: number;
}

export interface Rider {
  id: string;
  name: string;
  phone?: string;
  status?: "AVAILABLE" | "ASSIGNED" | "OFFLINE";
}

export interface Delivery {
  id: string;
  customerName: string;
  customerPhone?: string;
  address: string;
  status: DeliveryStatus;
  rider?: Rider | null;
  items: DeliveryItem[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateDeliveryRequest {
  customerName: string;
  customerPhone?: string;
  address: string;
  items: DeliveryItem[];
}

export interface AssignRiderRequest {
  riderId: string;
}

export interface UpdateDeliveryStatusRequest {
  status: DeliveryStatus;
}

export interface ConfirmDeliveryRequest {
  confirmationNote?: string;
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  status?: number;
}
```
