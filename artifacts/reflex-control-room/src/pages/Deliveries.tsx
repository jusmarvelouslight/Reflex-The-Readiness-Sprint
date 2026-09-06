import { useEffect, useState } from "react";
import {
fetchDeliveries,
updateDeliveryStatus,
type Delivery,
} from "../api/controlRoomApi";
import { DeliveryDetails } from "../components/DeliveryDetails";

export const Deliveries = () => {
const [deliveries, setDeliveries] = useState<Delivery[]>([]);
const [selectedDelivery, setSelectedDelivery] =
useState<Delivery | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

const loadDeliveries = async () => {
try {
setLoading(true);
setError(null);

  const data = await fetchDeliveries();
  setDeliveries(data);
} catch (err: unknown) {
  const message =
    err instanceof Error
      ? err.message
      : "Failed to load deliveries.";

  setError(message);
} finally {
  setLoading(false);
}

};

useEffect(() => {
void loadDeliveries();
}, []);

const handleStatusUpdate = async (
id: string,
status: Delivery["status"]
) => {
try {
const updated = await updateDeliveryStatus(id, status);

  setDeliveries((previous) =>
    previous.map((delivery) =>
      delivery.id === id ? updated : delivery
    )
  );

  setSelectedDelivery((previous) =>
    previous?.id === id ? updated : previous
  );
} catch (err: unknown) {
  const message =
    err instanceof Error
      ? err.message
      : "Failed to update delivery status.";

  setError(message);
}

};

if (loading) {
return (
<div className="loading-spinner">
Loading Sprint Deliveries...
</div>
);
}

if (error) {
return (
<div className="error-banner">
Error: {error}
</div>
);
}

return (
<div className="deliveries-page">
<h1>Sprint Deliveries Dashboard</h1>

  {deliveries.length === 0 ? (
    <p>No deliveries are currently available.</p>
  ) : (
    <table className="deliveries-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Assignee</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {deliveries.map((delivery) => (
          <tr key={delivery.id}>
            <td>{delivery.id}</td>

            <td>{delivery.title}</td>

            <td>
              {delivery.assignee || "Unassigned"}
            </td>

            <td>
              <span
                className={`status-badge ${delivery.status}`}
              >
                {delivery.status}
              </span>
            </td>

            <td>
              <button
                type="button"
                onClick={() =>
                  setSelectedDelivery(delivery)
                }
              >
                Inspect
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}

  {selectedDelivery && (
    <DeliveryDetails
      delivery={selectedDelivery}
      onClose={() => setSelectedDelivery(null)}
      onStatusChange={handleStatusUpdate}
    />
  )}
</div>

);
};