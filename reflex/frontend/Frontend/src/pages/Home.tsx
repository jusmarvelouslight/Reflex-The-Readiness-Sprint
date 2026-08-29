```tsx
interface HomeProps {
  onNavigate: (
    screen: "dashboard" | "deliveries" | "riders" | "my-deliveries"
  ) => void;
}

function Home({ onNavigate }: HomeProps) {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-brand">
            <div className="brand-mark">R</div>

            <div>
              <strong>Reflex</strong>
              <span>Readiness & Delivery Operations</span>
            </div>
          </div>

          <div className="home-copy">
            <p className="eyebrow">Last-mile operations platform</p>

            <h1>
              Move every delivery
              <span>with confidence.</span>
            </h1>

            <p className="home-description">
              Reflex gives delivery teams one clear view of their
              operations — from dispatch and rider availability to
              delivery completion.
            </p>

            <div className="home-actions">
              <button
                type="button"
                className="primary-button home-primary"
                onClick={() => onNavigate("dashboard")}
              >
                Enter Control Room
                <span>→</span>
              </button>

              <button
                type="button"
                className="secondary-button home-secondary"
                onClick={() =>
                  onNavigate("my-deliveries")
                }
              >
                Rider Portal
              </button>
            </div>
          </div>

          <div className="home-meta">
            <span>
              <i className="status-dot" />
              System operational
            </span>

            <span>REFLEX SPRINT · 2026</span>
          </div>
        </div>

        <div className="home-visual">
          <div className="visual-glow" />

          <div className="operations-card">
            <div className="operations-card-header">
              <div>
                <p>Live operations</p>
                <strong>Control Room</strong>
              </div>

              <span className="live-indicator">
                <span className="status-dot" />
                Live
              </span>
            </div>

            <div className="operations-metric">
              <span>Active deliveries</span>
              <strong>86</strong>
            </div>

            <div className="operations-progress">
              <div className="progress-label">
                <span>Network performance</span>
                <strong>98.6%</strong>
              </div>

              <div className="progress-track">
                <span />
              </div>
            </div>

            <div className="operations-list">
              <div className="operation-row">
                <span className="operation-icon">↗</span>

                <div>
                  <strong>RX-1048</strong>
                  <span>Westlands · In transit</span>
                </div>

                <span className="operation-status">
                  Live
                </span>
              </div>

              <div className="operation-row">
                <span className="operation-icon delivered">
                  ✓
                </span>

                <div>
                  <strong>RX-1047</strong>
                  <span>Kilimani · Delivered</span>
                </div>

                <span className="operation-status complete">
                  Done
                </span>
              </div>

              <div className="operation-row">
                <span className="operation-icon assigned">
                  ◉
                </span>

                <div>
                  <strong>RX-1046</strong>
                  <span>Lavington · Assigned</span>
                </div>

                <span className="operation-status">
                  Ready
                </span>
              </div>
            </div>

            <button
              type="button"
              className="operations-link"
              onClick={() => onNavigate("dashboard")}
            >
              Open operations →
            </button>
          </div>

          <div className="floating-stat floating-stat-one">
            <span className="floating-icon">✓</span>

            <div>
              <strong>214</strong>
              <span>Delivered today</span>
            </div>
          </div>

          <div className="floating-stat floating-stat-two">
            <span className="floating-icon rider">
              ◉
            </span>

            <div>
              <strong>94.8%</strong>
              <span>Rider availability</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-bottom">
        <div className="home-feature">
          <span>01</span>
          <div>
            <strong>One operational view</strong>
            <p>
              See deliveries, riders and network health
              without jumping between systems.
            </p>
          </div>
        </div>

        <div className="home-feature">
          <span>02</span>
          <div>
            <strong>Built for real-time decisions</strong>
            <p>
              Quickly identify what needs attention and
              act before small issues become delays.
            </p>
          </div>
        </div>

        <div className="home-feature">
          <span>03</span>
          <div>
            <strong>Designed for every role</strong>
            <p>
              Give operations teams and riders the
              information they need at the right moment.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
```
