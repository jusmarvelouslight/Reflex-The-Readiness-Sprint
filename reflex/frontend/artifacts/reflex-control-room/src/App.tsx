import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Deliveries } from './pages/Deliveries';
import { MyDeliveries } from './pages/MyDeliveries';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <header className="navbar">
          <div className="logo">Reflex Control Room</div>
          <nav>
            <Link to="/">All Deliveries</Link>
            <Link to="/my-deliveries">My Deliveries</Link>
          </nav>
        </header>

        <main className="content-container">
          <Routes>
            <Route path="/" element={<Deliveries />} />
            <Route path="/my-deliveries" element={<MyDeliveries />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;