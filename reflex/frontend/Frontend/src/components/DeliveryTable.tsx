import StatusBadge from "./StatusBadge";
import type { DeliveryStatus } from "../types/delivery";

interface DeliveryRow {
  id: string;
  customerName: string;
  address: string;
  status: DeliveryStatus;
  rider: string;
}

interface DeliveryTableProps {
  deliveries: DeliveryRow[];
}

function getInitials(name: string): string {
  if (!name || name === "Unassigned") {
    return "—";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function DeliveryTable({
  deliveries,
}: DeliveryTableProps) {
  if (deliveries.length === 0) {
    return (
      <div className="empty-state delivery-empty-state">
        <div className="empty-icon" aria-hidden="true">
          ⌕
        </div>

        <strong>No deliveries found</strong>

        <p>
          Try adjusting your search or status filter to
          find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="delivery-table">
        <thead>
          <tr>
            <th scope="col">Delivery</th>
            <th scope="col">Customer</th>
            <th scope="col">Destination</th>
            <th scope="col">Rider</th>
            <th scope="col">Status</th>
            <th scope="col">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {deliveries.map((delivery) => (
            <tr key={delivery.id}>
              <td>
                <div className="delivery-reference">
                  <span
                    className="delivery-reference-mark"
                    aria-hidden="true"
                  >
                    R
                  </span>

                  <span className="delivery-id">
                    {delivery.id}
                  </span>
                </div>
              </td>

              <td>
                <div className="customer-cell">
                  <strong>{delivery.customerName}</strong>
                  <span>Customer</span>
                </div>
              </td>

              <td>
                <div className="destination-cell">
                  <span
                    className="destination-pin"
                    aria-hidden="true"
                  >
                    ⌖
                  </span>

                  <span>{delivery.address}</span>
                </div>
              </td>

              <td>
                <div className="table-rider">
                  <span
                    className="table-rider-avatar"
                    aria-hidden="true"
                  >
                    {getInitials(delivery.rider)}
                  </span>

                  <span className="rider-name">
                    {delivery.rider}
                  </span>
                </div>
              </td>

              <td>
                <StatusBadge status={delivery.status} />
              </td>

              <td>
                <button
                  type="button"
                  className="table-action"
                  aria-label={`View ${delivery.id}`}
                >
                  <span>View</span>
                  <span aria-hidden="true">→</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DeliveryTable;