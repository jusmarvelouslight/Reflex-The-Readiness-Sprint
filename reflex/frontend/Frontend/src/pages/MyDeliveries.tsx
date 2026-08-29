import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000/api/v1";

interface Delivery {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  itemDescription: string;
  status: "PENDING" | "ASSIGNED" | "PICKED_UP" | "DELIVERED" | "CANCELLED";
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const result = await res.json();

      if (!result.success) {
        setLoginError(result.error?.message || "Login failed");
        return;
      }

      localStorage.setItem("riderToken", result.data.token);
      setToken(result.data.token);
    } catch {
      setLoginError("Could not reach the server. Is the backend running?");
    }
  }

  async function fetchDeliveries() {
    if (!token) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/deliveries`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const result = await res.json();

      if (!result.success) {
        setError(result.error?.message || "Failed to load deliveries");
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

  async function advanceStatus(delivery: Delivery) {
    const nextStatus =
      delivery.status === "ASSIGNED" ? "PICKED_UP" : "DELIVERED";

    try {
      const res = await fetch(`${API_BASE}/deliveries/${delivery.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });

      const result = await res.json();

      if (!result.success) {
        alert(result.error?.message || "Could not update status");
        return;
      }

      // Refresh the list so the UI reflects the real saved state
      fetchDeliveries();
    } catch {
      alert("Network error — could not update status. Please try again.");
    }
  }

  // --- Not logged in yet ---
  if (!token) {
    return (
      <div className="rider-page">
        <h2>Rider Login</h2>
        <form onSubmit={handleLogin}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit">Log in</button>

          {loginError && <p className="error-state">{loginError}</p>}
        </form>
      </div>
    );
  }

  // --- Logged in: show deliveries ---
  return (
    <div className="rider-page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Rider view</p>
          <h2>My Deliveries</h2>
          <p>Deliveries currently assigned to you.</p>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-state">{error}</p>}

      <section className="panel">
        <div className="rider-list">
          {deliveries.length === 0 && !loading && (
            <p>No deliveries assigned to you right now.</p>
          )}

          {deliveries.map((delivery) => (
            <div className="rider-row" key={delivery.id}>
              <div className="rider-info">
                <strong>{delivery.itemDescription}</strong>
                <span>{delivery.deliveryAddress}</span>
                <span>Retailer: {delivery.retailer.name}</span>
              </div>

              <span
                className={`rider-status ${delivery.status
                  .toLowerCase()
                  .replace("_", "-")}`}
              >
                {delivery.status}
              </span>

              {(delivery.status === "ASSIGNED" ||
                delivery.status === "PICKED_UP") && (
                <button onClick={() => advanceStatus(delivery)}>
                  {delivery.status === "ASSIGNED"
                    ? "Mark picked up"
                    : "Mark delivered"}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default MyDeliveries;