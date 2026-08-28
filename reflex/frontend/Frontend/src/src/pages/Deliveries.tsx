```tsx
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
      const matchesSearch =
        delivery.id.toLowerCase().includes(search.toLowerCase()) ||
        delivery.customerName.toLowerCase().includes(search.toLowerCase()) ||
        delivery.address.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || delivery.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="deliveries-page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Delivery management</p>
          <h2>Deliveries</h2>
          <p>Monitor, filter and manage current delivery activity.</p>
        </div>

        <button type="button" className="primary-button">
          + New delivery
        </button>
      </div>

      <section className="panel">
        <div className="filters">
          <label className="search-field">
            <span className="sr-only">Search deliveries</span>
            <input
              type="search"
              placeholder="Search delivery, customer or location..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <label>
            <span className="sr-only">Filter by status</span>
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
```
