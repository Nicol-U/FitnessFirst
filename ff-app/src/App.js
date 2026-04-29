import './App.css';
import Sidebar from './Components/Sidebar';
import {HashRouter as Router, Routes, Route} from 'react-router-dom';
import { Dashboard } from './Pages/Dashboard';
import {Login } from './Pages/login';
import {LogWorkoutPlan} from './Pages/WLPlans';
import {LW} from './Pages/LW';
import {History} from './Pages/History';
import {Settings} from './Pages/Settings';
/* function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Fitness First</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
        Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
*/

/*function App() {
  return (
    <div className="App">
      <Sidebar />
    </div>
  );
}

export default App;
*/

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/*" element={
         <div classname="AppLayout">
          <Sidebar />
          <div classname="MainContent">
            <Routes>


         
        <Route path="/" element={<Dashboard />} />
        <Route path="/logworkoutplan" element={<LogWorkoutPlan />} />
        <Route path="/LW" element={<LW />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        
        </Routes>
          </div>
        </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;