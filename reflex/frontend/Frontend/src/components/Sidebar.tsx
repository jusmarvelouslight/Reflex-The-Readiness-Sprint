```tsx
type Screen =
  | "dashboard"
  | "deliveries"
  | "riders";

interface SidebarProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

function Sidebar({
  activeScreen,
  onNavigate,
}: SidebarProps) {
  const navigationItems: {
    id: Screen;
    label: string;
    icon: string;
    description: string;
  }[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "⌂",
      description: "Operations overview",
    },
    {
      id: "deliveries",
      label: "Deliveries",
      icon: "▣",
      description: "Manage delivery flow",
    },
    {
      id: "riders",
      label: "Riders",
      icon: "◉",
      description: "Monitor your fleet",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div
          className="brand-mark"
          aria-hidden="true"
        >
          R
        </div>

        <div className="brand-copy">
          <strong>Reflex</strong>
          <span>Control Room</span>
        </div>
      </div>

      <div className="sidebar-divider" />

      <nav
        className="nav"
        aria-label="Main navigation"
      >
        <span className="nav-heading">
          Workspace
        </span>

        {navigationItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-link ${
              activeScreen === item.id
                ? "active"
                : ""
            }`}
            onClick={() =>
              onNavigate(item.id)
            }
            aria-current={
              activeScreen === item.id
                ? "page"
                : undefined
            }
          >
            <span
              className="nav-icon"
              aria-hidden="true"
            >
              {item.icon}
            </span>

            <span className="nav-link-copy">
              <strong>{item.label}</strong>
              <small>{item.description}</small>
            </span>

            {activeScreen === item.id && (
              <span
                className="nav-active-indicator"
                aria-hidden="true"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-status-card">
          <div className="system-status">
            <span
              className="status-dot"
              aria-hidden="true"
            />

            <div>
              <strong>System operational</strong>
              <span>All services running</span>
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <span>REFLEX SPRINT</span>
          <span>v1.0</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
```
