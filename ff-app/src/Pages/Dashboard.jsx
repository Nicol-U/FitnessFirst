import Sidebar from '../Components/Sidebar';
import React, {useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

export function Dashboard() {
  const [ShowPopUp, setShowPopUp] = useState(false);
  const [dayCount, setDayCount] = useState(checkIfNewDay());

  return (
    <div className='page'>
        <div style={{marginLeft: "200px", marginBottom: "20px", marginTop: "20px", height: "55px", width: "300px", textAlign: "center",  background: "#191A17", borderRadius: "100px", color: "#DFFF00", fontSize: 24}}>
          <p style={{ marginTop: "10px"}}> <LocalFireDepartmentIcon style={{marginTop: "2px"}}/> Day {dayCount}</p>
        </div>
        <div style={{marginLeft: "200px"}}>
              <h1 className="heading" style={{ fontSize: 46, fontWeight: 900 }}>
                <span style={{ color: "#fff" }}>DASHBOARD</span>
              </h1>
        </div>
          <button
            style={{
              display: "grid",
              color: "#DFFF00",
              background: "black",
              justifySelf: "end"
            }}
            onClick={() => setShowPopUp(true)}
          >
            + Add Goal
          </button>
          
          {ShowPopUp && <AddGoalPopup onClose={() => setShowPopUp(false)} />}

    </div>
  );
}

function AddGoalPopup({ onClose }) {
  return (
    <div style={overlayStyle}>
      <div style={popupStyle}>
        <h2>Popup Content</h2>
        <p>This is a simple popup.</p>

        <button
          style={{ color: "#ADAAAA", background: "#1A1A1A" }}
          onClick={onClose}
        >
          Discard
        </button>
      </div>
    </div>
  );
}

function checkIfNewDay() {
  const cntDay = JSON.parse(localStorage.getItem("DayCount")) || 0;
  const SavedDay = JSON.parse(localStorage.getItem("NextDay")) || null;
  const currentDay = new Date().getDate();
  const NextDay = (SavedDay + 1) % 31; // Assuming a month has 31 days for simplicity



  if ((currentDay == SavedDay) && (SavedDay != null) && (cntDay != 0)) {
    localStorage.setItem("DayCount", JSON.stringify(cntDay + 1));
    localStorage.setItem("NextDay", JSON.stringify(SavedDay));
    return cntDay + 1;
  }

  else {
    localStorage.setItem("NextDay", JSON.stringify((currentDay +1) % 31));
    localStorage.setItem("DayCount", JSON.stringify(1));    
    return 1;
}
}




const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)", // FIXED
  display: "grid",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
};

const popupStyle = {
  backgroundColor: "#20201F",
  color: "#DFFF00",
  fontFamily: "'lexend', sans-serif",
  padding: "20px",
  borderRadius: "5px",
  minWidth: "500px",
  minHeight: "300px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)"
};

export default Dashboard;
