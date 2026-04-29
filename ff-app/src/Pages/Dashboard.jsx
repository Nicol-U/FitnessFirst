
import Sidebar from '../Components/Sidebar';

export function Dashboard() {
  return (
    <div className="mainContent"
      style={{ padding: 'flux',
        justifyContent: 'center',
        alignItems: 'LEFT',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        backgroundColor: 'black',
        color: 'white',
        paddingLeft: '250px'
        // padding left at 250 makes sure our header isn't behind the sidebar 
        // looking into flex box as a better solution 
       }}
    >
      <h1>Dashboard</h1>
       <p> Welcome to the Dashboard </p>
    </div>
  );
}

export default Dashboard;
