import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Deliveries from "./pages/Deliveries";
import Dispatcher from "./pages/Dispatcher";
import Home from "./pages/Home";
import MyDeliveries from "./pages/MyDeliveries";
import Riders from "./pages/Riders";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
export type Screen =
 | "home"
 | "dashboard"
 | "dispatcher"
 | "deliveries"
 | "riders"
 | "my-deliveries";
function App() {
 const [screen, setScreen] = useState<Screen>("home");
 if (screen === "home") {
 return <Home onNavigate={setScreen} />;
 }
 if (screen === "my-deliveries") {
 return <MyDeliveries onHome={() => setScreen("home")} />;
 }
 const pageTitles = {
 dashboard: {
 title: "Control room",
 subtitle: "Live last-mile delivery operations",
 },
 dispatcher: {
 title: "Dispatcher",
 subtitle: "Coordinate rider assignments and delivery handoffs",
 },
 deliveries: {
 title: "Deliveries",
 subtitle: "Monitor and manage delivery activity",
 },
 riders: {
 title: "Riders",
 subtitle: "Monitor fleet availability and assignments",
 },
 } as const;
 const currentPage = pageTitles[screen];
 return (
 <div className="app-shell">
 <Sidebar activeScreen={screen} onNavigate={setScreen} />
 <main className="main-content">
 <Topbar
 title={currentPage.title}
 subtitle={currentPage.subtitle}
 onHome={() => setScreen("home")}
 />
 <div className="content-area">
 {screen === "dashboard" && <Dashboard onNavigate={setScreen} />}
 {screen === "dispatcher" && <Dispatcher />}
 {screen === "deliveries" && <Deliveries onNavigate={setScreen} />}
 {screen === "riders" && <Riders />}
 </div>
 </main>
 </div>
 );
}
export default App;