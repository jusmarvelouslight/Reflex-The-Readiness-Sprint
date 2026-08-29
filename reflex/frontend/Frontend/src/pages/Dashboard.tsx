
import MetricCard from "../components/MetricCard";
import StatusBadge from "../components/StatusBadge";

const recentDeliveries = [
  {
    id: "RX-1048",
    customer: "Amara Wanjiku",
    destination: "Westlands",
    status: "IN_TRANSIT" as const,
  },
  {
    id: "RX-1047",
    customer: "Daniel Otieno",
    destination: "Kilimani",
    status: "DELIVERED" as const,
  },
  {
    id: "RX-1046",
    customer: "Maya Shah",
    destination: "Lavington",
    status: "ASSIGNED" as const,
  },
  {
    id: "RX-1045",
    customer: "Brian Kamau",
    destination: "Karen",
    status: "REQUESTED" as const,
  },
];

function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Operations overview</p>
          <h2>Good evening, Control Room.</h2>
          <p>
            Monitor delivery activity and respond to operational changes.
          </p>
        </div>
      </div>

      <div className="metrics-grid">
        <MetricCard
          label="Total deliveries"
          value="128"
          detail="+12% this week"
        />

        <MetricCard
          label="Active deliveries"
          value="34"
          detail="8 require attention"
        />

        <MetricCard
          label="In transit"
          value="21"
          detail="Currently moving"
        />

        <MetricCard
          label="Completed"
          value="94"
          detail="73% completion rate"
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Live activity</p>
              <h3>Recent deliveries</h3>
            </div>

            <span className="live-indicator">
              <span className="status-dot" />
              Live
            </span>
          </div>

          <div className="activity-list">
            {recentDeliveries.map((delivery) => (
              <div className="activity-row" key={delivery.id}>
                <div>
                  <strong>{delivery.id}</strong>
                  <span>
                    {delivery.customer} · {delivery.destination}
                  </span>
                </div>

                <StatusBadge status={delivery.status} />
              </div>
            ))}
          </div>
        </section>

        <section className="panel alert-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Attention</p>
              <h3>Operational alerts</h3>
            </div>
          </div>

          <div className="alert-card">
            <span className="alert-icon">!</span>

            <div>
              <strong>8 deliveries require attention</strong>
              <p>
                Review failed or delayed deliveries before the next dispatch
                cycle.
              </p>
            </div>
          </div>

          <div className="alert-card secondary">
            <span className="alert-icon">!</span>

            <div>
              <strong>3 riders currently unavailable</strong>
              <p>
                Rider availability may affect upcoming assignments.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;

