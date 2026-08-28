```tsx
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Deliveries from "./pages/Deliveries";
import Riders from "./pages/Riders";

type Screen = "dashboard" | "deliveries" | "riders";

function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">R</div>

          <div className="brand-copy">
            <strong>Reflex</strong>
            <span>Control Room</span>
          </div>
        </div>

        <nav className="nav" aria-label="Main navigation">
          <button
            className={`nav-link ${
              screen === "dashboard" ? "active" : ""
            }`}
            onClick={() => setScreen("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={`nav-link ${
              screen === "deliveries" ? "active" : ""
            }`}
            onClick={() => setScreen("deliveries")}
          >
            Deliveries
          </button>

          <button
            className={`nav-link ${
              screen === "riders" ? "active" : ""
            }`}
            onClick={() => setScreen("riders")}
          >
            Riders
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="system-status">
            <span className="status-dot" />
            System operational
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="page-heading">
            <h1>Reflex Control Room</h1>
            <p>Last-mile delivery operations</p>
          </div>

          <div className="topbar-actions">
            <span>Frontend / UX</span>
          </div>
        </header>

        <section className="page-content">
          {screen === "dashboard" && <Dashboard />}
          {screen === "deliveries" && <Deliveries />}
          {screen === "riders" && <Riders />}
        </section>
      </main>
    </div>
  );
}

export default App;
```
