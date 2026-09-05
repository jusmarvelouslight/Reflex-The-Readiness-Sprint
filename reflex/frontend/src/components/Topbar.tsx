import { useState } from "react";
import Icon from "./Icon";

interface TopbarProps {
  title?: string;
  subtitle?: string;
  onHome?: () => void;
}

function Topbar({
  title = "Control room",
  subtitle =
    "Live last-mile delivery operations",
  onHome,
}: TopbarProps) {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu-button"
          type="button"
          aria-label={
            menuOpen
              ? "Close navigation"
              : "Open navigation"
          }
          aria-expanded={menuOpen}
          onClick={() =>
            setMenuOpen(
              (open) => !open,
            )
          }
        >
          <Icon
            name="menu"
            size={19}
          />
        </button>

        <div>
          <button
            className="topbar-kicker"
            type="button"
            onClick={onHome}
          >
            <span className="topbar-kicker-line" />
            Operations workspace
          </button>

          <h1>{title}</h1>

          <p>{subtitle}</p>
        </div>
      </div>

      <div className="topbar-actions">
        <button
          className="back-home-button"
          type="button"
          onClick={onHome}
        >
          <Icon
            name="arrow-left"
            size={14}
          />
          Back to home
        </button>

        <div className="connection-status">
          <span className="status-dot" />

          <span>
            <strong>
              System operational
            </strong>

            <small>
              Live network
            </small>
          </span>
        </div>

        <div className="topbar-divider" />

        <div className="profile-menu-wrapper">
          <button
            className="user-profile"
            type="button"
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
            onClick={() =>
              setProfileOpen(
                (open) => !open,
              )
            }
          >
            <span className="user-avatar">
              CO
            </span>

            <span className="user-info">
              <strong>
                Control Room
              </strong>

              <small>
                Operations
              </small>
            </span>

            <Icon
              name="chevron-down"
              size={14}
            />
          </button>

          {profileOpen && (
            <div
              className="profile-popover"
              role="menu"
            >
              <strong>
                Control Room
              </strong>

              <span>
                Operations workspace
              </span>

              <div className="profile-popover-status">
                <span className="status-dot" />
                System operational
              </div>
            </div>
          )}
        </div>
      </div>

      {menuOpen && (
        <div
          className="mobile-nav-note"
          role="status"
        >
          Use the workspace navigation on
          the left to switch views.
        </div>
      )}
    </header>
  );
}

export default Topbar;