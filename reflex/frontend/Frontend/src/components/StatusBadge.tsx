
import type { DeliveryStatus } from "../types/delivery";

interface StatusBadgeProps {
  status: DeliveryStatus;
}

const statusLabels: Record<DeliveryStatus, string> = {
  REQUESTED: "Requested",
  ASSIGNED: "Assigned",
  IN_TRANSIT: "In transit",
  DELIVERED: "Delivered",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-${status.toLowerCase()}`}>
      <span className="status-dot" />
      {statusLabels[status]}
    </span>
  );
}

export default StatusBadge;

