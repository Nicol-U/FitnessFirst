
import Sidebar from '../Components/Sidebar';
import React, { useState, useEffect } from 'react';


export function Dashboard() {
  const [ShowPopUp, setShowPopUp] = useState(false);

  return (

    <div className="page">
      {/* Header */}
      <div className= 'toprow'>
          <h1 className='heading' style={{ fontSize: 46, fontWeight: 900 }}>
            <span style={{ color: "#fff" }}>DASHBOARD</span>
          </h1>
        
      <button style={{display: "grid", alignItems: "right", color: "#DFFF00", background: "black"}} onClick={() => setShowPopUp(true)}>+ Add Goal</button>
      {ShowPopUp && <AddGoalPopup onClose={() => setShowPopUp(false)}/>}
      </div>
      </div>
  );
};

function AddGoalPopup({onClose}) {
  return (
    <div style={overlayeStyle}>
      <div style={popupStyle}>
        <h2>Popup Content</h2>
        <p>This is a simple popup.</p>
        <button style={{ color: "#ADAAAA", background: "#1A1A1A" }} onClick={onClose}>
          Discard
        </button>
      </div>
    </div>
  );
};

const overlayeStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.)",
  display: "grid",
  justifyContent: "center",
  alignItems: "center",
};

const popupStyle = {
  backgroundColor: "#20201F",
  color: "#DFFF00",
  fontFamily: "'lexend', sans-serif",
  padding: "20px",
  borderRadius: "5px",
  minWidth: "500px",
  minHeight: "300px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
};

export default Dashboard;
