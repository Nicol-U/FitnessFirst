import React, { useEffect, useState } from 'react';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import GreenButton, { GrayRactangles } from '../Components/CustomButton';
import { Link, useLocation, useNavigate } from "react-router-dom"; // ✅ import useLocation
import Input from '@mui/material/Input';
import { Checkbox } from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';
import EventNoteIcon from '@mui/icons-material/EventNote';

export function Dashboard() {
  const [ShowPopUp, setShowPopUp] = useState(false);
  const [dayCount, setDayCount] = useState(checkIfNewDay());
  const location = useLocation();

  return (
    <div className="page">
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
  <div 
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "55px",
      width: "320px",
      background: "#191A17",
      borderRadius: "100px",
      color: "#F6FFC0",
      fontSize: 24,
      gap: "10px"
  
    }}
  >
    <LocalFireDepartmentIcon sx={{fontSize: 35}} />
    <p> {dayCount} DAY STREAK</p>
  </div>
</div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: "90vw",
        maxWidth: "80%",
        marginLeft: "150px"
    }}>

        <h1 className="heading" style={{ fontSize: 24, fontWeight: 900 }}>
          <span style={{ color: "#fff" }}>TARGET MILESTONES</span>
        </h1>

        <GreenButton
          onClick={() => setShowPopUp(true)}
        >
          + Add Goal
        </GreenButton>

        {ShowPopUp && <AddGoalPopup onClose={() => setShowPopUp(false)} />}
      </div>
        
        <div >
        <RadioToggle />
        </div>
          <div style={{...styles.box, width: "400px"}}>
             <div style={styles.circle}> <DescriptionIcon /> </div>     

            <div style={{display: "flex", flexDirection: "column"}} >

            <h2 style={{margin: 2, fontSize:22}}>VIEW WORKOUT PLANS</h2>
          <h3 style={{color: "#ADAAAA", margin: 2, fontSize:15}}>Access your custom elite archive</h3>
          </div>
        </div>
        
        <div style={{...styles.box, width: "400px"}}>
             <div style={styles.circle}> <EventNoteIcon /> </div>     

            <div style={{display: "flex", flexDirection: "column", }} >

            <h2 style={{margin: 2, fontSize:22}}>VIEW WORKOUT HISTORY</h2>
          <h3 style={{color: "#ADAAAA", margin: 2, fontSize:15}}>Track your evolution and consistency</h3>
          </div>

          
        </div>
      </div>
  );
}

// To James: this function is the code for the pop up to add goal 
function AddGoalPopup({ onClose }) {
  return (
    <div style={overlayStyle}> // this is at the bottom of the page setting out the layout
      <div style={popupStyle}>  // same with this 
        <h2>Popup Content</h2>
        <p>This is a simple popup.</p>
        <div style={{display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center', 
        marginTop: '30%'
        }}> 
        <GreenButton BGColor='Black' Txtcolor='Gray' onClick={onClose}>
          Cancel
        </GreenButton>

        <GreenButton> Save </GreenButton>
        </div>
      </div>
    </div>
  );
}

function checkIfNewDay() {
  const cntDay = JSON.parse(localStorage.getItem("DayCount")) || 0;
  const SavedDay = JSON.parse(localStorage.getItem("NextDay")) || null;
  const currentDay = new Date().getDate();
  const NextDay = (currentDay + 1) % 31;

    if (currentDay < SavedDay){

    return cntDay;
  }

  else if ((currentDay === SavedDay) && (SavedDay !== null) && (cntDay !== 0)) {
    localStorage.setItem("DayCount", JSON.stringify(cntDay + 1));
    localStorage.setItem("NextDay", JSON.stringify(NextDay));
    return cntDay + 1;
  } 

  else {
    localStorage.setItem("NextDay", JSON.stringify(NextDay));
    localStorage.setItem("DayCount", JSON.stringify(1));
    return 1;
  }
}




function RadioToggle() {
  const [selectedValue, setSelectedValue] = useState(true);
  const [crossedOut, setCrossedOut] = useState(null);

  const clicked = () => {
    setSelectedValue(prev => {
      const newValue = !prev;
      setCrossedOut(newValue ? null : "line-through");
      return newValue;
    });
  };

  return (
    <div style={styles.box}>  
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "50px",
        cursor: "pointer",
        userSelect: "none",
        color: "#FFFF",
        fontSize: 12,
      
      }}
    >
      <input
        style={{ display: "none" }}
        type="checkbox"
        name="myCheckbox"
        onChange={clicked}
      />

      <span
        style={{
          ...styles.radio,
          backgroundColor: selectedValue ? "black" : "#F6FFC0",
          borderColor: selectedValue ? "#555" : "#F6FFC0",
        }}
      >
        
        {!selectedValue && (
          <span style={styles.checkmark}>✓</span>
        )}
      </span>
      
        <div style={{display: "flex", flexDirection: "column"}} >
      <h2 style={{margin: 2, textDecoration: crossedOut}}>Option 1 </h2>
          <h3 style={{color: "#ADAAAA", margin: 2, textDecoration: crossedOut}}>text1</h3>
          </div>
    </label>
        </div>

  );
}
const boxwidth = "75%";
const styles = {
  box: {
    display: "flex",
    backgroundColor: "#212020",
    flex: 1,
    color: " white",
    border: "1px solid #2a2a2a",
    borderRadius: 14,
    padding: "12px 28px 12px 40px",
    width: "90vw",
    marginRight: "100px",
    maxHeight: "9vh",
    marginLeft: "150px",
    fontFamily: "'lexend', sans-serif",
    maxWidth: "75%",
  },

  
  radio: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    border: "2px solid #555",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    color: "black",
    transition: "0.2s"
  },

  circle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#3a3a3a",
    marginRight: "25px",
    marginLeft: 0,
    marginTop: "5px",
    
  },

  checkmark: {
    fontSize: "16px",
    lineHeight: 1,
    pointerEvents: "none"
  }
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
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
