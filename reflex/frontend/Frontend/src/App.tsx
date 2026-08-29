```tsx
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Deliveries from "./pages/Deliveries";
import Riders from "./pages/Riders";
import MyDeliveries from "./pages/MyDeliveries";

type Screen = "dashboard" | "deliveries" | "riders" | "myDeliveries";

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function DeliveryIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 6.5 12 3l9 3.5v11L12 21l-9-3.5v-11Z" />
      <path d="M3 6.5 12 10l9-3.5M12 10v11" />
    </svg>
  );
}

function RiderIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 21c.7-4.1 3-6.2 7-6.2s6.3 2.1 7 6.2" />
    </svg>
  );
}

function MyDeliveryIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5.5h16v13H4z" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 17V9M10 17V5M16 17v-7M22 17V3" />
    </svg>
  );
}

function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");

  const navigation = [
    {
      id: "dashboard" as Screen,
      label: "Overview",
      icon: <DashboardIcon />,
    },
    {
      id: "deliveries" as Screen,
      label: "Deliveries",
      icon: <DeliveryIcon />,
    },
    {
      id: "riders" as Screen,
      label: "Riders",
      icon: <RiderIcon />,
    },
    {
      id: "myDeliveries" as Screen,
      label: "My Deliveries",
      icon: <MyDeliveryIcon />,
    },
  ];

  const currentPage =
    navigation.find((item) => item.id === screen)?.label ?? "Overview";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <span>R</span>
          </div>

          <div className="brand-copy">
            <strong>Reflex</strong>
            <span>Control Room</span>
          </div>
        </div>

        <div className="workspace-label">
          <span>WORKSPACE</span>
        </div>

        <nav className="nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              key={item.id}
              className={`nav-link ${
                screen === item.id ? "active" : ""
              }`}
              onClick={() => setScreen(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>

              {screen === item.id && <span className="nav-active-dot" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-insight">
          <div className="insight-icon">
            <ActivityIcon />
          </div>

          <div>
            <span className="insight-label">Network health</span>
            <strong>98.6%</strong>
          </div>

          <span className="health-pulse" />
        </div>

        <div className="sidebar-footer">
          <div className="system-status">
            <span className="status-dot" />
            <span>
              <strong>System operational</strong>
              <small>All services online</small>
            </span>
          </div>

          <div className="environment-badge">
            <span className="environment-dot" />
            LIVE
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Control Room</span>
            <span className="breadcrumb-separator">/</span>
            <strong>{currentPage}</strong>
          </div>

          <div className="topbar-actions">
            <div className="system-time">
              <span className="time-dot" />
              Operations live
            </div>

            <div className="topbar-divider" />

            <div className="user-profile">
              <div className="avatar">CR</div>

              <div className="user-copy">
                <strong>Control Room</strong>
                <span>Operations</span>
              </div>

              <span className="chevron">⌄</span>
            </div>
          </div>
        </header>

        <div className="page-content">
          <div className="page-accent" />

          {screen === "dashboard" && <Dashboard />}
          {screen === "deliveries" && <Deliveries />}
          {screen === "riders" && <Riders />}
          {screen === "myDeliveries" && <MyDeliveries />}
        </div>
      </main>
    </div>
  );
}

export default App;
```
