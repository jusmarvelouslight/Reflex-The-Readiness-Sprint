```tsx
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Deliveries from "./pages/Deliveries";
import Riders from "./pages/Riders";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

type Screen = "dashboard" | "deliveries" | "riders";

function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");

  const renderScreen = () => {
    switch (screen) {
      case "deliveries":
        return <Deliveries />;

      case "riders":
        return <Riders />;

      case "dashboard":
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    switch (screen) {
      case "deliveries":
        return {
          title: "Deliveries",
          subtitle: "Monitor and manage delivery activity",
        };

      case "riders":
        return {
          title: "Riders",
          subtitle: "Review rider availability and assignments",
        };

      case "dashboard":
      default:
        return {
          title: "Reflex Control Room",
          subtitle: "Last-mile delivery operations",
        };
    }
  };

  const page = getPageTitle();

  return (
    <div className="app-shell">
      <Sidebar
        activeScreen={screen}
        onNavigate={setScreen}
      />

      <main className="main-content">
        <Topbar
          title={page.title}
          subtitle={page.subtitle}
        />

        <section className="page-content">
          {renderScreen()}
        </section>
      </main>
    </div>
  );
}

export default App;
```
