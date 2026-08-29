import StatusBadge from "./StatusBadge";
import type { Delivery } from "../types/delivery";

interface DeliveryDetailsProps {
  delivery: Delivery;
  onClose?: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function DeliveryDetails({
  delivery,
  onClose,
}: DeliveryDetailsProps) {
  return (
    <aside
      className="delivery-details"
      aria-label={`Details for delivery ${delivery.id}`}
    >
      <div className="details-header">
        <div>
          <p className="eyebrow">Delivery details</p>

          <div className="details-reference">
            <h3>{delivery.id}</h3>

            <span className="details-reference-dot">
              Live
            </span>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close delivery details"
          >
            ×
          </button>
        )}
      </div>

      <div className="details-status">
        <StatusBadge status={delivery.status} />
      </div>

      <div className="details-section">
        <span className="details-label">Customer</span>

        <div className="details-customer">
          <strong>{delivery.customerName}</strong>

          {delivery.customerPhone && (
            <a href={`tel:${delivery.customerPhone}`}>
              {delivery.customerPhone}
            </a>
          )}
        </div>
      </div>

      <div className="details-section">
        <span className="details-label">Destination</span>

        <div className="details-destination">
          <span
            className="destination-pin"
            aria-hidden="true"
          >
            ⌖
          </span>

          <strong>{delivery.address}</strong>
        </div>
      </div>

      <div className="details-section">
        <span className="details-label">Assigned rider</span>

        {delivery.rider ? (
          <div className="details-rider">
            <div className="details-rider-avatar">
              {getInitials(delivery.rider.name)}
            </div>

            <div>
              <strong>{delivery.rider.name}</strong>

              {delivery.rider.phone && (
                <span>{delivery.rider.phone}</span>
              )}
            </div>
          </div>
        ) : (
          <div className="unassigned-notice">
            <span aria-hidden="true">!</span>

            <div>
              <strong>No rider assigned</strong>
              <small>
                This delivery is waiting for assignment.
              </small>
            </div>
          </div>
        )}
      </div>

      <div className="details-section">
        <div className="details-section-heading">
          <span className="details-label">Items</span>

          <span className="item-count">
            {delivery.items.length}
          </span>
        </div>

        <div className="item-list">
          {delivery.items.length > 0 ? (
            delivery.items.map((item) => (
              <div className="item-row" key={item.id}>
                <span>{item.name}</span>

                <strong>×{item.quantity}</strong>
              </div>
            ))
          ) : (
            <span className="muted-text">
              No items listed
            </span>
          )}
        </div>
      </div>

      <div className="details-section">
        <span className="details-label">Created</span>

        <span className="details-date">
          {new Date(delivery.createdAt).toLocaleString()}
        </span>
      </div>

      <div className="details-actions">
        <button type="button" className="primary-button">
          Update status
          <span aria-hidden="true">→</span>
        </button>

        {!delivery.rider && (
          <button type="button" className="secondary-button">
            Assign rider
          </button>
        )}

        {delivery.status === "DELIVERED" && (
          <button type="button" className="secondary-button">
            View confirmation
          </button>
        )}
      </div>
    </aside>
  );
}

export default DeliveryDetails;