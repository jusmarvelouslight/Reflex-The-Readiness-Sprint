```tsx
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
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="topbar-actions">
        <div className="connection-status">
          <span className="status-dot" />
          <span>System operational</span>
        </div>

        <div className="user-profile" aria-label="Current user">
          <div className="user-avatar">R</div>

          <div className="user-info">
            <strong>Control Room</strong>
            <span>Operations</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
```
