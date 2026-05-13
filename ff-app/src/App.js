import './App.css';
import Sidebar from './Components/Sidebar';
import {HashRouter as Router, Routes, Route} from 'react-router-dom';
import { Dashboard } from './Pages/Dashboard';
import {Login } from './Pages/login';
import {LogWorkoutPlan} from './Pages/WLPlans';
import {LW} from './Pages/LW';
import {History} from './Pages/History';
import {Settings} from './Pages/Settings';
import {login} from './Pages/login';
import {CreateAcc} from './Pages/CreateAcc';

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route path="/createacc" element={<CreateAcc />} />
        
        <Route path="/*" element={
         <div className="AppLayout">
          <Sidebar />
          <div className="MainContent">
            <Routes>

          

         
        <Route path="/" element={<Dashboard />} />
        <Route path="/logworkoutplan" element={<LogWorkoutPlan />} />
        <Route path="/LW" element={<LW />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/history" element={<History />} />
        <Route path="/login" element={<Login/>} />

        </Routes>
          </div>
        </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;