import { useState } from "react";
import Deliveries from "./pages/Deliveries";
import MyDeliveries from "./pages/MyDeliveries";

type Screen =
  | "home"
  | "dashboard"
  | "deliveries"
  | "my-deliveries";

function App() {
  const [screen, setScreen] =
    useState<Screen>("home");

  const navigate = (next: Screen) => {
    setScreen(next);
  };

  if (screen === "home") {
    return (
      <div className="app-shell">
        <main className="main-content">
          <div className="content-area">
            <section className="hero-panel">
              <p className="eyebrow">
                REFLEX CONTROL ROOM
              </p>

              <h1>
                Last-mile operations,
                <br />
                under control.
              </h1>

              <p>
                Monitor deliveries, inspect
                delivery activity and manage
                operational readiness from one
                control room.
              </p>

              <div className="button-row">
                <button
                  onClick={() =>
                    navigate("dashboard")
                  }
                >
                  Open Control Room
                </button>

                <button
                  onClick={() =>
                    navigate("my-deliveries")
                  }
                >
                  My Deliveries
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  if (screen === "my-deliveries") {
    return (
      <div className="app-shell">
        <main className="main-content">
          <div className="content-area">
            <button
              onClick={() => navigate("home")}
            >
              ← Home
            </button>

            <MyDeliveries />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <main className="main-content">
        <div className="content-area">
          <header>
            <p className="eyebrow">
              REFLEX CONTROL ROOM
            </p>

            <h1>
              Delivery Operations
            </h1>

            <p>
              Live delivery activity and
              operational monitoring.
            </p>

            <div className="button-row">
              <button
                onClick={() =>
                  navigate("home")
                }
              >
                ← Home
              </button>

              <button
                onClick={() =>
                  navigate("my-deliveries")
                }
              >
                My Deliveries
              </button>
            </div>
          </header>

          <Deliveries />
        </div>
      </main>
    </div>
  );
}

export default App;