import { API_BASE_URL } from '../config/api';

export interface Delivery {
  id: string;
  sprintId: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  assignee: string;
  createdAt: string;
  updatedAt: string;
  metrics?: Record<string, any>;
}

export const fetchDeliveries = async (): Promise<Delivery[]> => {
  const response = await fetch(`${API_BASE_URL}/api/deliveries`);
  if (!response.ok) {
    throw new Error(`Failed to fetch deliveries: ${response.statusText}`);
  }
  return response.json();
};

export const fetchUserDeliveries = async (userId: string): Promise<Delivery[]> => {
  const response = await fetch(`${API_BASE_URL}/api/deliveries/user/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user deliveries: ${response.statusText}`);
  }
  return response.json();
};

export const fetchDeliveryById = async (id: string): Promise<Delivery> => {
  const response = await fetch(`${API_BASE_URL}/api/deliveries/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch delivery details: ${response.statusText}`);
  }
  return response.json();
};

export const updateDeliveryStatus = async (
  id: string,
  status: Delivery['status']
): Promise<Delivery> => {
  const response = await fetch(`${API_BASE_URL}/api/deliveries/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update delivery status: ${response.statusText}`);
  }
  return response.json();
};