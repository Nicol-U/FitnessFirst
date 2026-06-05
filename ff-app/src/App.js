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
import { ForgotPassword } from './Pages/ForgotPassword';
import { ResetPassword } from './Pages/ResetPassword';
import { ThemeProvider, useTheme } from './Components/ThemeContext';
//import { ThemeContext } from '@emotion/react';

function ProtectedLayout() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const { fontScale, alertTime, setAlertTime, workoutReminders, setWorkoutReminders } = useTheme();

  useEffect(() => {
    fetch('http://localhost:3001/auth/me', { credentials: 'include' })
      .then(res => {
        setIsAuthenticated(res.ok);
        setAuthChecked(true);
      })
      .catch(() => setAuthChecked(true));
  }, []);

  // Load notification settings from backend once authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("http://localhost:3001/settings", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        const s = data.settings;
        setWorkoutReminders(s?.workout_reminders ?? true);
        setAlertTime(s?.alert_time?.slice(0, 5) ?? "06:30");
      })
      .catch(() => {});
  }, [isAuthenticated, setAlertTime, setWorkoutReminders]);

  // Request notification permission once
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Schedule notification — runs on any page as long as user is logged in
  useEffect(() => {
    if (!workoutReminders) return;

    let lastFiredDate = null;

    const checkTime = () => {
      if (Notification.permission !== "granted") return;
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const today = now.toDateString();

      if (`${hh}:${mm}` === alertTime && lastFiredDate !== today) {
        lastFiredDate = today;
        new Notification("FitnessFirst – Workout Reminder 💪", {
          body: "Time to crush your workout! You've got this.",
          icon: "/logo192.png",
        });
      }
    };

    checkTime();
    const intervalId = setInterval(checkTime, 5 * 1000);
    return () => clearInterval(intervalId);
  }, [workoutReminders, alertTime]);

  if (!authChecked) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (

    <div className="AppLayout">
      <Sidebar />
      <div className="MainContent" style={{ ...fontScale }}>
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
    <ThemeProvider>
    <Router>
      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route path="/createacc" element={<CreateAcc />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
