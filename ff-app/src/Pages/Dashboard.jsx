
import Sidebar from '../Components/Sidebar';

export function Dashboard() {
  return (
    <div
      style={{ padding: 'flux',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        backgroundColor: 'black',
        color: 'white'
       }}
    >
      <h1>Dashboard</h1>
      <Sidebar />
    </div>
  );
}

export default Dashboard;
