
import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000/api/v1";

interface Delivery {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  itemDescription: string;
  status:
    | "PENDING"
    | "ASSIGNED"
    | "PICKED_UP"
    | "DELIVERED"
    | "CANCELLED";
  retailer: {
    id: string;
    name: string;
  };
}

function MyDeliveries() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("riderToken")
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        setLoginError(
          result.error?.message || "Login failed"
        );
        return;
      }

      localStorage.setItem(
        "riderToken",
        result.data.token
      );

      setToken(result.data.token);
    } catch {
      setLoginError(
        "Could not reach the server. Is the backend running?"
      );
    }
  }

  async function fetchDeliveries() {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${API_BASE}/deliveries`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (!result.success) {
        setError(
          result.error?.message ||
            "Failed to load deliveries"
        );

        setLoading(false);
        return;
      }

      setDeliveries(result.data.deliveries);
    } catch {
      setError("Could not reach the server.");
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchDeliveries();
  }, [token]);

  async function advanceStatus(
    delivery: Delivery
  ) {
    const nextStatus =
      delivery.status === "ASSIGNED"
        ? "PICKED_UP"
        : "DELIVERED";

    try {
      const res = await fetch(
        `${API_BASE}/deliveries/${delivery.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        }
      );

      const result = await res.json();

      if (!result.success) {
        alert(
          result.error?.message ||
            "Could not update status"
        );
        return;
      }

      fetchDeliveries();
    } catch {
      alert(
        "Network error — could not update status. Please try again."
      );
    }
  }

  const activeDeliveries = deliveries.filter(
    (delivery) =>
      delivery.status === "ASSIGNED" ||
      delivery.status === "PICKED_UP"
  ).length;

  const completedDeliveries = deliveries.filter(
    (delivery) => delivery.status === "DELIVERED"
  ).length;

  if (!token) {
    return (
      <div className="rider-login-page">
        <div className="rider-login-card">
          <div className="rider-login-brand">
            <div className="brand-mark">R</div>

            <div>
              <strong>Reflex</strong>
              <span>Control Room</span>
            </div>
          </div>

          <div className="rider-login-heading">
            <p className="eyebrow">Rider portal</p>
            <h2>Welcome back.</h2>
            <p>
              Sign in to view and manage your assigned
              deliveries.
            </p>
          </div>

          <form
            className="rider-login-form"
            onSubmit={handleLogin}
          >
            <label className="form-field">
              <span>Email address</span>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="form-field">
              <span>Password</span>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </label>

            {loginError && (
              <div className="login-error">
                <span>!</span>
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="primary-button login-button"
            >
              Sign in
              <span>→</span>
            </button>
          </form>

          <p className="rider-login-footer">
            Reflex last-mile operations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rider-page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Rider portal</p>

          <h2>My Deliveries</h2>

          <p>
            Stay on top of the deliveries currently
            assigned to you.
          </p>
        </div>

        <div className="rider-online">
          <span className="status-dot" />
          Online
        </div>
      </div>

      <div className="mini-stats rider-stats">
        <div className="mini-stat">
          <span>Total deliveries</span>
          <strong>{deliveries.length}</strong>
        </div>

        <div className="mini-stat">
          <span>Active</span>
          <strong>{activeDeliveries}</strong>
        </div>

        <div className="mini-stat success">
          <span>Completed</span>
          <strong>{completedDeliveries}</strong>
        </div>
      </div>

      {loading && (
        <div className="loading-state">
          <span className="loading-spinner" />
          Loading your deliveries...
        </div>
      )}

      {error && (
        <div className="error-state rider-error">
          <strong>Unable to load deliveries</strong>
          <span>{error}</span>
          <button
            type="button"
            className="secondary-button"
            onClick={fetchDeliveries}
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Your queue</p>

              <h3>Assigned deliveries</h3>

              <p className="panel-subtitle">
                Update each delivery as you move through
                your route.
              </p>
            </div>

            <span className="panel-count">
              {deliveries.length} deliveries
            </span>
          </div>

          {deliveries.length === 0 ? (
            <div className="empty-state rider-empty">
              <div className="empty-icon">✓</div>

              <strong>
                You're all caught up
              </strong>

              <p>
                There are no deliveries assigned to
                you right now.
              </p>
            </div>
          ) : (
            <div className="rider-delivery-list">
              {deliveries.map((delivery) => (
                <article
                  className="rider-delivery-card"
                  key={delivery.id}
                >
                  <div className="rider-delivery-main">
                    <div className="rider-delivery-icon">
                      {delivery.status ===
                      "DELIVERED"
                        ? "✓"
                        : "↗"}
                    </div>

                    <div className="rider-delivery-info">
                      <div className="rider-delivery-title">
                        <strong>
                          {delivery.itemDescription}
                        </strong>

                        <span className="delivery-id">
                          {delivery.id}
                        </span>
                      </div>

                      <div className="rider-delivery-meta">
                        <span>
                          <b>Destination</b>
                          {delivery.deliveryAddress}
                        </span>

                        <span>
                          <b>Retailer</b>
                          {delivery.retailer.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rider-delivery-actions">
                    <span
                      className={`rider-status ${delivery.status
                        .toLowerCase()
                        .replace("_", "-")}`}
                    >
                      <span className="rider-status-dot" />
                      {delivery.status.replace(
                        "_",
                        " "
                      )}
                    </span>

                    {(delivery.status ===
                      "ASSIGNED" ||
                      delivery.status ===
                        "PICKED_UP") && (
                      <button
                        type="button"
                        className="primary-button compact-button"
                        onClick={() =>
                          advanceStatus(delivery)
                        }
                      >
                        {delivery.status ===
                        "ASSIGNED"
                          ? "Mark picked up"
                          : "Mark delivered"}
                        <span>→</span>
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default MyDeliveries;

