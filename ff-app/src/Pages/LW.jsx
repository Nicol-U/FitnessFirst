import Sidebar from '../Components/Sidebar';

export function LW() {
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
      <h1>Log Workouts</h1>
      <Sidebar />
    </div>
  );
}
export default LW;
