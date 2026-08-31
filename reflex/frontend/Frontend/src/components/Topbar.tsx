interface TopbarProps {
  title?: string;
  subtitle?: string;
}

function Topbar({
  title = "Reflex Control Room",
  subtitle = "Last-mile delivery operations",
}: TopbarProps) {
  return (
    <header className="topbar">
      <div className="page-heading">
        <div className="topbar-kicker">
          <span className="topbar-kicker-line" />
          Operations workspace
        </div>

        <h1>{title}</h1>

        <p>{subtitle}</p>
      </div>

      <div className="topbar-actions">
        <div className="connection-status">
          <span className="status-dot" />

          <div>
            <strong>System operational</strong>
            <span>Live network</span>
          </div>
        </div>

        <div className="topbar-divider" />

        <div className="user-profile" aria-label="Current user">
          <div className="user-avatar">R</div>

          <div className="user-info">
            <strong>Control Room</strong>
            <span>Operations</span>
          </div>

          <span className="profile-chevron" aria-hidden="true">
            ↓
          </span>
        </div>
      </div>
    </header>
  );
}

export default Topbar;