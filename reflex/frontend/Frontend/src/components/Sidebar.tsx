
type Screen = "dashboard" | "deliveries" | "riders";

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
  }[] = [
    {
      id: "dashboard",
      label: "Dashboard",
    },
    {
      id: "deliveries",
      label: "Deliveries",
    },
    {
      id: "riders",
      label: "Riders",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          R
        </div>

        <div className="brand-copy">
          <strong>Reflex</strong>
          <span>Control Room</span>
        </div>
      </div>

      <nav
        className="nav"
        aria-label="Main navigation"
      >
        <span className="nav-heading">Workspace</span>

        {navigationItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-link ${
              activeScreen === item.id ? "active" : ""
            }`}
            onClick={() => onNavigate(item.id)}
            aria-current={
              activeScreen === item.id ? "page" : undefined
            }
          >
            <span className="nav-icon" aria-hidden="true">
              {item.id === "dashboard" && "⌂"}
              {item.id === "deliveries" && "▣"}
              {item.id === "riders" && "◉"}
            </span>

            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="system-status">
          <span
            className="status-dot"
            aria-hidden="true"
          />
          <span>System operational</span>
        </div>

        <div className="sidebar-version">
          Reflex Sprint
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

