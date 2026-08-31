
import { useMemo, useState } from "react";
import DeliveryTable from "../components/DeliveryTable";
import type { DeliveryStatus } from "../types/delivery";

const mockDeliveries = [
  {
    id: "RX-1048",
    customerName: "Amara Wanjiku",
    address: "Westlands",
    status: "IN_TRANSIT" as DeliveryStatus,
    rider: "Kevin Mwangi",
  },
  {
    id: "RX-1047",
    customerName: "Daniel Otieno",
    address: "Kilimani",
    status: "DELIVERED" as DeliveryStatus,
    rider: "Brian Kamau",
  },
  {
    id: "RX-1046",
    customerName: "Maya Shah",
    address: "Lavington",
    status: "ASSIGNED" as DeliveryStatus,
    rider: "Faith Njeri",
  },
  {
    id: "RX-1045",
    customerName: "Brian Kamau",
    address: "Karen",
    status: "REQUESTED" as DeliveryStatus,
    rider: "Unassigned",
  },
  {
    id: "RX-1044",
    customerName: "Aisha Hassan",
    address: "Parklands",
    status: "FAILED" as DeliveryStatus,
    rider: "Samuel Kiptoo",
  },
];

function Deliveries() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredDeliveries = useMemo(() => {
    return mockDeliveries.filter((delivery) => {
      const query = search.toLowerCase();

      const matchesSearch =
        delivery.id.toLowerCase().includes(query) ||
        delivery.customerName.toLowerCase().includes(query) ||
        delivery.address.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" || delivery.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const activeCount = mockDeliveries.filter(
    (delivery) =>
      delivery.status === "REQUESTED" ||
      delivery.status === "ASSIGNED" ||
      delivery.status === "IN_TRANSIT"
  ).length;

  return (
    <div className="deliveries-page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Delivery management</p>
          <h2>Deliveries</h2>
          <p>
            Monitor, filter and manage current delivery activity.
          </p>
        </div>

        <button type="button" className="btn btn-primary">
          <span>+</span>
          New delivery
        </button>
      </div>

      <div className="mini-stats">
        <div className="mini-stat">
          <span>Total</span>
          <strong>{mockDeliveries.length}</strong>
        </div>

        <div className="mini-stat">
          <span>Active</span>
          <strong>{activeCount}</strong>
        </div>

        <div className="mini-stat">
          <span>Delivered</span>
          <strong>
            {
              mockDeliveries.filter(
                (delivery) => delivery.status === "DELIVERED"
              ).length
            }
          </strong>
        </div>

        <div className="mini-stat warning">
          <span>Needs attention</span>
          <strong>
            {
              mockDeliveries.filter(
                (delivery) => delivery.status === "FAILED"
              ).length
            }
          </strong>
        </div>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Live register</p>
            <h3>All deliveries</h3>
            <p className="panel-subtitle">
              {filteredDeliveries.length} deliveries matching your view.
            </p>
          </div>

          <span className="live-indicator">
            <span className="status-dot" />
            Monitoring
          </span>
        </div>

        <div className="filters">
          <label className="search-field">
            <span className="sr-only">Search deliveries</span>

            <span className="search-icon">⌕</span>

            <input
              type="search"
              placeholder="Search delivery, customer or location..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <label className="filter-control">
            <span>Status</span>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="ALL">All statuses</option>
              <option value="REQUESTED">Requested</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_TRANSIT">In transit</option>
              <option value="DELIVERED">Delivered</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </label>
        </div>

        <DeliveryTable deliveries={filteredDeliveries} />
      </section>
    </div>
  );
}

export default Deliveries;

