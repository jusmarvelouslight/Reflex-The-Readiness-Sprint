
const riders = [
  {
    name: "Kevin Mwangi",
    status: "Assigned",
    delivery: "RX-1048",
  },
  {
    name: "Brian Kamau",
    status: "Available",
    delivery: "RX-1047",
  },
  {
    name: "Faith Njeri",
    status: "Assigned",
    delivery: "RX-1046",
  },
  {
    name: "Samuel Kiptoo",
    status: "Unavailable",
    delivery: "RX-1044",
  },
];

function Riders() {
  return (
    <div className="riders-page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Fleet operations</p>
          <h2>Riders</h2>
          <p>Review rider availability and current assignments.</p>
        </div>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Rider overview</p>
            <h3>Current riders</h3>
          </div>
        </div>

        <div className="rider-list">
          {riders.map((rider) => (
            <div className="rider-row" key={rider.name}>
              <div className="rider-avatar">
                {rider.name.charAt(0)}
              </div>

              <div className="rider-info">
                <strong>{rider.name}</strong>
                <span>
                  {rider.delivery === "RX-1047"
                    ? "Currently assigned to delivery"
                    : rider.delivery === "RX-1044"
                      ? "Unavailable"
                      : `Delivery ${rider.delivery}`}
                </span>
              </div>

              <span
                className={`rider-status ${rider.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {rider.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Riders;

