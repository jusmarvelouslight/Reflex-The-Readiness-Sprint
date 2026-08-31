
const metrics = [
  {
    label: "Total deliveries",
    value: "1,248",
    detail: "+12.4% from last week",
    trend: "up",
  },
  {
    label: "In transit",
    value: "86",
    detail: "7.0% of active deliveries",
    trend: "neutral",
  },
  {
    label: "Delivered today",
    value: "214",
    detail: "+18 completed today",
    trend: "up",
  },
  {
    label: "Failed deliveries",
    value: "7",
    detail: "0.6% failure rate",
    trend: "down",
  },
];

const activity = [
  {
    id: "RX-1048",
    title: "Delivery in transit",
    description: "Kevin Mwangi is heading to Westlands",
    time: "2 min ago",
    status: "IN_TRANSIT",
  },
  {
    id: "RX-1047",
    title: "Delivery completed",
    description: "Daniel Otieno · Kilimani",
    time: "11 min ago",
    status: "DELIVERED",
  },
  {
    id: "RX-1046",
    title: "Rider assigned",
    description: "Faith Njeri assigned to Lavington",
    time: "18 min ago",
    status: "ASSIGNED",
  },
  {
    id: "RX-1045",
    title: "New delivery requested",
    description: "Brian Kamau · Karen",
    time: "26 min ago",
    status: "REQUESTED",
  },
];

const attentionItems = [
  {
    title: "Delivery needs attention",
    description:
      "RX-1044 could not be completed in Parklands. Review the delivery status.",
    type: "danger",
  },
  {
    title: "Unassigned delivery",
    description:
      "RX-1045 is waiting for an available rider in Karen.",
    type: "warning",
  },
];

function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Operations overview</p>
          <h2>Good afternoon, Control Room.</h2>
          <p>
            Here's what's happening across your delivery network right now.
          </p>
        </div>

        <div className="dashboard-date">
          <span className="date-label">Today</span>
          <strong>29 August 2026</strong>
        </div>
      </div>

      <section className="metrics-grid" aria-label="Delivery metrics">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <div className="metric-card-top">
              <span className="metric-label">{metric.label}</span>

              <span className={`metric-trend ${metric.trend}`}>
                {metric.trend === "up" && "↗"}
                {metric.trend === "down" && "↘"}
                {metric.trend === "neutral" && "—"}
              </span>
            </div>

            <strong className="metric-value">{metric.value}</strong>

            <span className="metric-detail">{metric.detail}</span>
          </article>
        ))}
      </section>

      <div className="dashboard-grid">
        <section className="panel activity-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Live activity</p>
              <h3>Recent operations</h3>
              <p className="panel-subtitle">
                The latest events across the network.
              </p>
            </div>

            <span className="live-indicator">
              <span className="status-dot" />
              Live
            </span>
          </div>

          <div className="activity-list">
            {activity.map((item) => (
              <article className="activity-row" key={item.id}>
                <div className="activity-marker">
                  <span className={`activity-dot ${item.status.toLowerCase()}`} />
                </div>

                <div className="activity-content">
                  <div className="activity-heading">
                    <strong>{item.title}</strong>
                    <span>{item.time}</span>
                  </div>

                  <p>{item.description}</p>
                </div>

                <span className="activity-id">{item.id}</span>
              </article>
            ))}
          </div>

          <div className="panel-footer">
            <button type="button" className="text-button">
              View all activity →
            </button>
          </div>
        </section>

        <section className="panel health-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Network health</p>
              <h3>System performance</h3>
            </div>

            <span className="health-score">98.6%</span>
          </div>

          <div className="health-content">
            <div className="health-ring">
              <div className="health-ring-inner">
                <strong>98.6%</strong>
                <span>Healthy</span>
              </div>
            </div>

            <div className="health-summary">
              <div className="health-line">
                <span>
                  <i className="health-dot success" />
                  Delivery success
                </span>
                <strong>99.4%</strong>
              </div>

              <div className="health-line">
                <span>
                  <i className="health-dot lavender" />
                  Rider availability
                </span>
                <strong>94.8%</strong>
              </div>

              <div className="health-line">
                <span>
                  <i className="health-dot gold" />
                  Response time
                </span>
                <strong>1.8s</strong>
              </div>
            </div>
          </div>

          <div className="health-footer">
            <span className="status-dot" />
            All core services operating normally
          </div>
        </section>
      </div>

      <section className="panel attention-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Needs attention</p>
            <h3>Operational queue</h3>
            <p className="panel-subtitle">
              Items that may require intervention.
            </p>
          </div>

          <span className="attention-count">2 items</span>
        </div>

        <div className="attention-grid">
          {attentionItems.map((item) => (
            <article
              className={`attention-card ${item.type}`}
              key={item.title}
            >
              <div className="attention-icon">
                {item.type === "danger" ? "!" : "•"}
              </div>

              <div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>

              <button type="button" className="attention-action">
                Review
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;

