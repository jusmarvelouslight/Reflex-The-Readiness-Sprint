import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createControlRoomDelivery,
  getControlRoomDeliveries,
} from "../api/controlRoomApi";

import DeliveryDetails from "../components/DeliveryDetails";
import DeliveryTable from "../components/DeliveryTable";
import Icon from "../components/Icon";
import NewDeliveryModal from "../components/NewDeliveryModal";

import type {
  Delivery,
  DeliveryStatus,
} from "../types/delivery";

const statuses: Array<
  "ALL" | DeliveryStatus
> = [
  "ALL",
  "REQUESTED",
  "ASSIGNED",
  "IN_TRANSIT",
  "DELIVERED",
  "FAILED",
  "CANCELLED",
];

function Deliveries() {
  const [deliveries, setDeliveries] =
    useState<Delivery[]>([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<"ALL" | DeliveryStatus>("ALL");

  const [selected, setSelected] =
    useState<Delivery | null>(null);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [notice, setNotice] =
    useState("");

  const loadDeliveries = useCallback(
    async () => {
      setLoading(true);
      setError("");

      try {
        const nextDeliveries =
          await getControlRoomDeliveries();

        setDeliveries(nextDeliveries);

        setSelected((current) =>
          current
            ? nextDeliveries.find(
                (delivery) =>
                  delivery.id === current.id,
              ) ?? null
            : null,
        );
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "The live deliveries could not be loaded.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadDeliveries();
  }, [loadDeliveries]);

  const filteredDeliveries =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return deliveries.filter(
        (delivery) => {
          const riderName =
            delivery.rider?.name ?? "";

          const matchesSearch =
            !query ||
            [
              delivery.id,
              delivery.customerName,
              delivery.address,
              riderName,
            ].some((value) =>
              value
                .toLowerCase()
                .includes(query),
            );

          return (
            matchesSearch &&
            (statusFilter === "ALL" ||
              delivery.status ===
                statusFilter)
          );
        },
      );
    }, [
      deliveries,
      search,
      statusFilter,
    ]);

  const activeCount =
    deliveries.filter((delivery) =>
      [
        "REQUESTED",
        "ASSIGNED",
        "IN_TRANSIT",
      ].includes(delivery.status),
    ).length;

  const attentionCount =
    deliveries.filter(
      (delivery) =>
        delivery.status === "FAILED" ||
        !delivery.rider,
    ).length;

  const createDelivery = async (
    data: {
      customerName: string;
      address: string;
      itemName: string;
      quantity: number;
    },
  ) => {
    setSaving(true);
    setError("");

    try {
      const created =
        await createControlRoomDelivery({
          customerName:
            data.customerName,
          address: data.address,
          items: [
            {
              id: `item-${Date.now()}`,
              name: data.itemName,
              quantity: data.quantity,
            },
          ],
        });

      setDeliveries((current) => [
        created,
        ...current,
      ]);

      setModalOpen(false);
      setSelected(created);

      setNotice(
        "Delivery created in the live operations store.",
      );

      window.setTimeout(
        () => setNotice(""),
        4000,
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The delivery could not be created.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatedDelivery = (
    updated: Delivery,
  ) => {
    setDeliveries((current) =>
      current.map((delivery) =>
        delivery.id === updated.id
          ? updated
          : delivery,
      ),
    );

    setSelected(updated);

    setNotice(
      "Delivery status updated successfully.",
    );

    window.setTimeout(
      () => setNotice(""),
      4000,
    );
  };

  return (
    <div className="deliveries-page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">
            Delivery management · Synthetic
            workspace
          </p>

          <h2>Delivery register</h2>

          <p>
            See every handoff, assignment and
            exception in one place.
          </p>
        </div>

        <button
          className="primary-button"
          type="button"
          onClick={() => {
            setModalOpen(true);
            setError("");
          }}
        >
          <Icon
            name="plus"
            size={16}
          />
          New delivery
        </button>
      </div>

      {notice && (
        <div
          className="toast"
          role="status"
        >
          <Icon
            name="check"
            size={15}
          />
          {notice}
        </div>
      )}

      {error && (
        <div
          className="error-state live-data-error"
          role="alert"
        >
          <strong>
            Unable to update live deliveries
          </strong>

          <span>{error}</span>

          <button
            className="secondary-button"
            type="button"
            onClick={() =>
              void loadDeliveries()
            }
          >
            Try again
          </button>
        </div>
      )}

      <div className="mini-stats">
        <div className="mini-stat">
          <span>Total deliveries</span>
          <strong>
            {deliveries.length}
          </strong>
          <small>Live records</small>
        </div>

        <div className="mini-stat">
          <span>Active</span>
          <strong>{activeCount}</strong>
          <small>In the network</small>
        </div>

        <div className="mini-stat success">
          <span>Delivered</span>
          <strong>
            {
              deliveries.filter(
                (delivery) =>
                  delivery.status ===
                  "DELIVERED",
              ).length
            }
          </strong>
          <small>Completed</small>
        </div>

        <div className="mini-stat warning">
          <span>Attention</span>
          <strong>
            {attentionCount
              .toString()
              .padStart(2, "0")}
          </strong>
          <small>Needs action</small>
        </div>
      </div>

      <div
        className={`delivery-workspace ${
          selected
            ? "has-selection"
            : ""
        }`}
      >
        <section className="panel register-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">
                Live register
              </p>

              <h3>All deliveries</h3>

              <p className="panel-subtitle">
                {filteredDeliveries.length} of{" "}
                {deliveries.length} records
                showing
              </p>
            </div>

            <span className="live-indicator">
              <span className="status-dot" />
              API connected
            </span>
          </div>

          <div className="filters">
            <label className="search-field">
              <span className="sr-only">
                Search deliveries
              </span>

              <Icon
                name="search"
                size={16}
              />

              <input
                type="search"
                placeholder="Search ID, customer, location or rider"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
              />
            </label>

            <label className="filter-control">
              <span>Status</span>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target
                      .value as
                      | "ALL"
                      | DeliveryStatus,
                  )
                }
              >
                {statuses.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status ===
                      "ALL"
                        ? "All statuses"
                        : status.replace(
                            "_",
                            " ",
                          )}
                    </option>
                  ),
                )}
              </select>
            </label>
          </div>

          {loading ? (
            <div className="loading-state">
              <span className="loading-spinner" />
              Loading live deliveries...
            </div>
          ) : filteredDeliveries.length ? (
            <DeliveryTable
              deliveries={
                filteredDeliveries
              }
              onSelect={setSelected}
            />
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <Icon
                  name="package"
                  size={19}
                />
              </div>

              <strong>
                No deliveries found
              </strong>

              <p>
                Try changing the search
                or status filter.
              </p>
            </div>
          )}
        </section>

        {selected && (
          <DeliveryDetails
            delivery={selected}
            onClose={() =>
              setSelected(null)
            }
            onUpdated={
              handleUpdatedDelivery
            }
            onAssign={() => {
              setSelected(null);
              window.dispatchEvent(
                new CustomEvent(
                  "reflex:navigate",
                  {
                    detail:
                      "dispatcher",
                  },
                ),
              );
            }}
          />
        )}
      </div>

      <NewDeliveryModal
        isOpen={modalOpen}
        onClose={() =>
          setModalOpen(false)
        }
        onSubmit={(data) =>
          void createDelivery(data)
        }
      />

      {saving && (
        <div
          className="saving-indicator"
          role="status"
        >
          Saving to live operations...
        </div>
      )}
    </div>
  );
}

export default Deliveries;