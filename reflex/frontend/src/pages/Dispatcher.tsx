import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  assignControlRoomRider,
  getControlRoomDeliveries,
  getControlRoomRiders,
  type ControlRoomRider,
} from "../api/controlRoomApi";

import Icon from "../components/Icon";
import type { Delivery } from "../types/delivery";

function Dispatcher() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [riders, setRiders] = useState<ControlRoomRider[]>([]);
  const [selectedDeliveryId, setSelectedDeliveryId] =
    useState("");
  const [selectedRiderId, setSelectedRiderId] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadDispatchData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [nextDeliveries, nextRiders] =
        await Promise.all([
          getControlRoomDeliveries(),
          getControlRoomRiders(),
        ]);

      setDeliveries(nextDeliveries);
      setRiders(nextRiders);

      setSelectedDeliveryId(
        (current) =>
          current ||
          nextDeliveries.find(
            (delivery) => !delivery.rider,
          )?.id ||
          nextDeliveries[0]?.id ||
          "",
      );

      setSelectedRiderId("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The live dispatch queue could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDispatchData();
  }, [loadDispatchData]);

  const selectedDelivery = deliveries.find(
    (delivery) =>
      delivery.id === selectedDeliveryId,
  );

  const availableRiders = useMemo(
    () =>
      riders.filter(
        (rider) => rider.status === "AVAILABLE",
      ),
    [riders],
  );

  const unassignedCount = deliveries.filter(
    (delivery) => !delivery.rider,
  ).length;

  const assignedCount =
    deliveries.length - unassignedCount;

  const assignSelectedRider = async () => {
    if (
      !selectedDelivery ||
      !selectedRiderId ||
      saving
    ) {
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const assignedDelivery =
        await assignControlRoomRider(
          selectedDelivery.id,
          selectedRiderId,
        );

      setDeliveries((current) =>
        current.map((delivery) =>
          delivery.id === assignedDelivery.id
            ? assignedDelivery
            : delivery,
        ),
      );

      const refreshedRiders =
        await getControlRoomRiders();

      setRiders(refreshedRiders);
      setSelectedRiderId("");

      setNotice(
        "Rider assigned and saved to the live operations store.",
      );

      window.setTimeout(
        () => setNotice(""),
        4000,
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The rider could not be assigned.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dispatcher-page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">
            Dispatcher workspace · Synthetic workspace
          </p>

          <h2>Assignment desk</h2>

          <p>
            Match open deliveries with the right rider
            before the next handoff.
          </p>
        </div>

        <div className="dispatcher-live-status">
          <span
            className={`status-dot ${
              error ? "status-dot-error" : ""
            }`}
          />

          <span>
            <strong>
              {error
                ? "API unavailable"
                : "Dispatch online"}
            </strong>

            <small>
              {loading
                ? "Refreshing live data"
                : "Queue updated just now"}
            </small>
          </span>
        </div>
      </div>

      {notice && (
        <div className="toast" role="status">
          <Icon name="check" size={15} />
          {notice}
        </div>
      )}

      {error && (
        <div
          className="error-state live-data-error"
          role="alert"
        >
          <strong>
            Unable to update live dispatch data
          </strong>

          <span>{error}</span>

          <button
            className="secondary-button"
            type="button"
            onClick={() =>
              void loadDispatchData()
            }
          >
            Try again
          </button>
        </div>
      )}

      <div className="mini-stats dispatcher-stats">
        <div className="mini-stat warning">
          <span>Unassigned</span>
          <strong>{unassignedCount}</strong>
          <small>Need a rider</small>
        </div>

        <div className="mini-stat success">
          <span>Assigned</span>
          <strong>{assignedCount}</strong>
          <small>In the queue</small>
        </div>

        <div className="mini-stat">
          <span>Available riders</span>
          <strong>{availableRiders.length}</strong>
          <small>Ready to move</small>
        </div>

        <div className="mini-stat">
          <span>On-time target</span>
          <strong>92%</strong>
          <small>Network goal</small>
        </div>
      </div>

      {loading && !deliveries.length ? (
        <div className="loading-state">
          <span className="loading-spinner" />
          Loading live dispatch data...
        </div>
      ) : (
        <div className="dispatcher-grid">
          <section className="panel dispatch-queue-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">
                  Dispatch queue
                </p>

                <h3>Open assignments</h3>

                <p className="panel-subtitle">
                  Prioritize deliveries by their
                  promised window.
                </p>
              </div>

              <span className="panel-count">
                {unassignedCount} open
              </span>
            </div>

            <div className="dispatch-list">
              {deliveries.map((delivery) => {
                const isSelected =
                  delivery.id ===
                  selectedDeliveryId;

                return (
                  <button
                    className={`dispatch-row ${
                      isSelected ? "selected" : ""
                    }`}
                    key={delivery.id}
                    type="button"
                    onClick={() => {
                      setSelectedDeliveryId(
                        delivery.id,
                      );
                      setSelectedRiderId("");
                      setError("");
                    }}
                  >
                    <span
                      className={`dispatch-priority ${
                        delivery.status === "FAILED"
                          ? "high"
                          : ""
                      }`}
                    >
                      {delivery.status === "FAILED"
                        ? "!"
                        : "·"}
                    </span>

                    <span className="dispatch-row-copy">
                      <span className="dispatch-row-heading">
                        <strong>{delivery.id}</strong>

                        <small>
                          {new Date(
                            delivery.updatedAt ??
                              delivery.createdAt,
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>
                      </span>

                      <span className="dispatch-row-meta">
                        {delivery.customerName} ·{" "}
                        {delivery.address}
                      </span>

                      <span className="dispatch-row-item">
                        {delivery.items[0]?.name ??
                          "Delivery item"}
                      </span>
                    </span>

                    <span
                      className={`dispatch-row-status ${delivery.status.toLowerCase()}`}
                    >
                      {delivery.rider?.name ??
                        "Unassigned"}
                    </span>

                    <Icon
                      name="chevron-right"
                      size={14}
                    />
                  </button>
                );
              })}

              {!deliveries.length && (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Icon
                      name="package"
                      size={18}
                    />
                  </div>

                  <strong>
                    No deliveries in the queue
                  </strong>

                  <p>
                    New live deliveries will
                    appear here.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="panel dispatch-action-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">
                  Assignment action
                </p>

                <h3>
                  {selectedDelivery
                    ? selectedDelivery.id
                    : "Select a delivery"}
                </h3>

                <p className="panel-subtitle">
                  Choose an available rider to take
                  ownership.
                </p>
              </div>

              <span className="dispatch-action-icon">
                <Icon name="truck" size={17} />
              </span>
            </div>

            {selectedDelivery ? (
              <div className="dispatch-action-content">
                <div className="dispatch-detail-card">
                  <div>
                    <span>Destination</span>
                    <strong>
                      {selectedDelivery.address}
                    </strong>
                  </div>

                  <div>
                    <span>Current status</span>
                    <strong>
                      {selectedDelivery.status.replace(
                        "_",
                        " ",
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Items</span>
                    <strong>
                      {selectedDelivery.items.length}
                    </strong>
                  </div>
                </div>

                {selectedDelivery.rider ? (
                  <div className="assigned-callout">
                    <span className="callout-icon">
                      <Icon
                        name="check"
                        size={15}
                      />
                    </span>

                    <span>
                      <strong>
                        Rider assigned
                      </strong>

                      <small>
                        {
                          selectedDelivery.rider
                            .name
                        }{" "}
                        is on this delivery.
                      </small>
                    </span>
                  </div>
                ) : (
                  <>
                    <label className="dispatch-select-field">
                      <span>
                        Available rider
                      </span>

                      <select
                        value={selectedRiderId}
                        onChange={(event) => {
                          setSelectedRiderId(
                            event.target.value,
                          );
                          setError("");
                        }}
                        disabled={
                          saving ||
                          availableRiders.length === 0
                        }
                      >
                        <option value="">
                          {availableRiders.length
                            ? "Choose a rider"
                            : "No riders available"}
                        </option>

                        {availableRiders.map(
                          (rider) => (
                            <option
                              key={rider.id}
                              value={rider.id}
                            >
                              {rider.name} ·{" "}
                              {rider.area}
                            </option>
                          ),
                        )}
                      </select>
                    </label>

                    <button
                      className="primary-button dispatch-assign-button"
                      type="button"
                      disabled={
                        !selectedRiderId ||
                        saving
                      }
                      onClick={() =>
                        void assignSelectedRider()
                      }
                    >
                      {saving
                        ? "Saving assignment..."
                        : "Assign rider"}

                      <Icon
                        name="arrow-up-right"
                        size={14}
                      />
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <Icon
                    name="truck"
                    size={18}
                  />
                </div>

                <strong>
                  Select an open delivery
                </strong>

                <p>
                  Choose a delivery from the queue
                  to assign a rider.
                </p>
              </div>
            )}
          </section>
        </div>
      )}

      <section className="panel dispatcher-roster-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">
              Fleet readiness
            </p>

            <h3>Rider roster</h3>

            <p className="panel-subtitle">
              See who can take the next assignment.
            </p>
          </div>

          <span className="panel-count">
            {availableRiders.length} ready
          </span>
        </div>

        <div className="dispatcher-roster">
          {riders.map((rider) => (
            <div
              className="dispatcher-rider"
              key={rider.id}
            >
              <div className="rider-avatar">
                {rider.initials}
              </div>

              <div className="dispatcher-rider-copy">
                <strong>{rider.name}</strong>

                <span>
                  {rider.area} ·{" "}
                  {rider.activeDeliveries} active{" "}
                  {rider.activeDeliveries === 1
                    ? "delivery"
                    : "deliveries"}
                </span>
              </div>

              <span
                className={`rider-status ${
                  rider.status.toLowerCase()
                }`}
              >
                <span className="rider-status-dot" />
                {rider.status}
              </span>
            </div>
          ))}

          {!riders.length && !loading && (
            <div className="empty-state">
              <strong>No riders available</strong>
              <p>
                The live rider roster is currently
                empty.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dispatcher;