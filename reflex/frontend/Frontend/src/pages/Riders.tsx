
const riders = [
  {
    name: "Kevin Mwangi",
    status: "Assigned",
    delivery: "RX-1048",
    location: "Westlands",
    initials: "KM",
  },
  {
    name: "Brian Kamau",
    status: "Available",
    delivery: "RX-1047",
    location: "Kilimani",
    initials: "BK",
  },
  {
    name: "Faith Njeri",
    status: "Assigned",
    delivery: "RX-1046",
    location: "Lavington",
    initials: "FN",
  },
  {
    name: "Samuel Kiptoo",
    status: "Unavailable",
    delivery: "RX-1044",
    location: "Parklands",
    initials: "SK",
  },
];

function Riders() {
  const available = riders.filter(
    (rider) => rider.status === "Available"
  ).length;

  const assigned = riders.filter(
    (rider) => rider.status === "Assigned"
  ).length;

  const unavailable = riders.filter(
    (rider) => rider.status === "Unavailable"
  ).length;

  return (
    <div className="riders-page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Fleet operations</p>
          <h2>Riders</h2>
          <p>
            Review rider availability and current assignments.
          </p>
        </div>

        <span className="live-indicator">
          <span className="status-dot" />
          Fleet online
        </span>
      </div>

      <div className="mini-stats">
        <div className="mini-stat">
          <span>Total riders</span>
          <strong>{riders.length}</strong>
        </div>

        <div className="mini-stat success">
          <span>Available</span>
          <strong>{available}</strong>
        </div>

        <div className="mini-stat">
          <span>Assigned</span>
          <strong>{assigned}</strong>
        </div>

        <div className="mini-stat warning">
          <span>Unavailable</span>
          <strong>{unavailable}</strong>
        </div>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Rider overview</p>
            <h3>Current fleet</h3>
            <p className="panel-subtitle">
              Rider status and active delivery assignments.
            </p>
          </div>

          <span className="panel-count">{riders.length} riders</span>
        </div>

        <div className="rider-list">
          {riders.map((rider) => (
            <article className="rider-row" key={rider.name}>
              <div className="rider-avatar">
                {rider.initials}
              </div>

              <div className="rider-info">
                <strong>{rider.name}</strong>

                <span>
                  {rider.status === "Available"
                    ? "Ready for a new delivery"
                    : rider.status === "Unavailable"
                      ? "Currently unavailable"
                      : `Delivery ${rider.delivery}`}
                </span>
              </div>

              <div className="rider-location">
                <span>Current area</span>
                <strong>{rider.location}</strong>
              </div>

              <span
                className={`rider-status ${rider.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                <span className="rider-status-dot" />
                {rider.status}
              </span>

              <button
                type="button"
                className="table-action"
                aria-label={`View ${rider.name}`}
              >
                View
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Riders;

