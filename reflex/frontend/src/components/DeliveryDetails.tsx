import { useState } from "react";

import {
  updateControlRoomDeliveryStatus,
} from "../api/controlRoomApi";

import Icon from "./Icon";
import StatusBadge from "./StatusBadge";

import type {
  Delivery,
  DeliveryStatus,
} from "../types/delivery";

interface DeliveryDetailsProps {
  delivery: Delivery;
  onClose?: () => void;
  onUpdated?: (delivery: Delivery) => void;
  onAssign?: (delivery: Delivery) => void;
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

function getNextStatus(
  status: DeliveryStatus,
): DeliveryStatus | null {
  const transitions: Partial<
    Record<DeliveryStatus, DeliveryStatus>
  > = {
    REQUESTED: "ASSIGNED",
    ASSIGNED: "IN_TRANSIT",
    IN_TRANSIT: "DELIVERED",
  };

  return transitions[status] ?? null;
}

function DeliveryDetails({
  delivery,
  onClose,
  onUpdated,
  onAssign,
}: DeliveryDetailsProps) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfirmation, setShowConfirmation] =
    useState(false);

  const nextStatus = getNextStatus(
    delivery.status,
  );

  const handleUpdateStatus = async () => {
    if (!nextStatus || saving) {
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const updated =
        await updateControlRoomDeliveryStatus(
          delivery.id,
          nextStatus,
        );

      onUpdated?.(updated);

      setMessage(
        `Status updated to ${nextStatus
          .replace("_", " ")
          .toLowerCase()}.`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "The delivery status could not be updated.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside
      className="delivery-details"
      aria-label={`Details for delivery ${delivery.id}`}
    >
      <div className="details-header">
        <div>
          <p className="eyebrow">
            Delivery details
          </p>

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

      {message && (
        <div
          className="toast"
          role="status"
          style={{ marginBottom: "14px" }}
        >
          <Icon name="activity" size={14} />
          {message}
        </div>
      )}

      <div className="details-section">
        <span className="details-label">
          Customer
        </span>

        <div className="details-customer">
          <strong>{delivery.customerName}</strong>

          {delivery.customerPhone && (
            <a
              href={`tel:${delivery.customerPhone}`}
            >
              {delivery.customerPhone}
            </a>
          )}
        </div>
      </div>

      <div className="details-section">
        <span className="details-label">
          Destination
        </span>

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
        <span className="details-label">
          Assigned rider
        </span>

        {delivery.rider ? (
          <div className="details-rider">
            <div className="details-rider-avatar">
              {getInitials(
                delivery.rider.name,
              )}
            </div>

            <div>
              <strong>
                {delivery.rider.name}
              </strong>

              {delivery.rider.phone && (
                <span>
                  {delivery.rider.phone}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="unassigned-notice">
            <span aria-hidden="true">!</span>

            <div>
              <strong>
                No rider assigned
              </strong>

              <small>
                This delivery is waiting for
                assignment.
              </small>
            </div>
          </div>
        )}
      </div>

      <div className="details-section">
        <div className="details-section-heading">
          <span className="details-label">
            Items
          </span>

          <span className="item-count">
            {delivery.items.length}
          </span>
        </div>

        <div className="item-list">
          {delivery.items.length > 0 ? (
            delivery.items.map((item) => (
              <div
                className="item-row"
                key={item.id}
              >
                <span>{item.name}</span>

                <strong>
                  ×{item.quantity}
                </strong>
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
        <span className="details-label">
          Created
        </span>

        <span className="details-date">
          {new Date(
            delivery.createdAt,
          ).toLocaleString()}
        </span>
      </div>

      {showConfirmation && (
        <div
          className="details-section"
          role="status"
        >
          <div className="assigned-callout">
            <span className="callout-icon">
              <Icon
                name="check"
                size={15}
              />
            </span>

            <span>
              <strong>
                Delivery confirmed
              </strong>

              <small>
                {delivery.id} was marked
                delivered successfully.
              </small>
            </span>
          </div>
        </div>
      )}

      <div className="details-actions">
        {nextStatus ? (
          <button
            type="button"
            className="primary-button"
            disabled={saving}
            onClick={() =>
              void handleUpdateStatus()
            }
          >
            {saving
              ? "Updating..."
              : `Mark ${nextStatus
                  .replace("_", " ")
                  .toLowerCase()}`}
            <span aria-hidden="true">
              →
            </span>
          </button>
        ) : (
          <button
            type="button"
            className="primary-button"
            disabled
          >
            No further status
          </button>
        )}

        {!delivery.rider && (
          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              onAssign?.(delivery)
            }
          >
            Assign rider
          </button>
        )}

        {delivery.status === "DELIVERED" && (
          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              setShowConfirmation(
                (current) => !current,
              )
            }
          >
            {showConfirmation
              ? "Hide confirmation"
              : "View confirmation"}
          </button>
        )}
      </div>
    </aside>
  );
}

export default DeliveryDetails;