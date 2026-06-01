import './App.css';
import { useEffect, useState } from 'react';
import Sidebar from './Components/Sidebar';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './Pages/Dashboard';
import { Login } from './Pages/login';
import { LogWorkoutPlan } from './Pages/WLPlans';
import { LW } from './Pages/LW';
import { History } from './Pages/History';
import { Settings } from './Pages/Settings';
import { CreateAcc } from './Pages/CreateAcc';

function ProtectedLayout() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/auth/me', { credentials: 'include' })
      .then(res => {
        setIsAuthenticated(res.ok);
        setAuthChecked(true);
      })
      .catch(() => setAuthChecked(true));
  }, []);

  if (!authChecked) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="AppLayout">
      <Sidebar />
      <div className="MainContent">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/logworkoutplan" element={<LogWorkoutPlan />} />
          <Route path="/LW" element={<LW />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/createacc" element={<CreateAcc />} />
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </Router>
  );
}

export default App;