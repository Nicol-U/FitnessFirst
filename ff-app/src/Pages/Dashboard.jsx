import React, { useEffect, useState, useRef, forwardRef } from 'react';
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
  const popupRef = useRef(null);
  
  useEffect(() => {
    function handleOutClick(event){
      if (popupRef.current && !popupRef.current.contains(event.target)){
        setShowPopUp(false);
      }
    }

    if (ShowPopUp){
      document.addEventListener('mousedown', handleOutClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutClick);

    };

  }, [ShowPopUp]);

  return (
    <div className="page" >
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
  <div 
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "55px",
      width: "90%",
      maxWidth: "320px",
      fontSize: "clamp(16px, 4vw, 24px)",
      background: "#191A17",
      borderRadius: "100px",
      color: "#F6FFC0",
      gap: "10px",
  
    }}
  >
    <LocalFireDepartmentIcon sx={{fontSize: 35}} />
    <p> {dayCount} DAY STREAK</p>
  </div>
</div>
      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    width: "90%",
    maxWidth: "1100px",
    margin: "10px auto",
    marginLeft: "30px"
  }}
>

        <h1 className="heading" style={{ fontSize: 24, fontWeight: 900 }}>
          <span style={{ color: "#fff" }}>TARGET MILESTONES</span>
        </h1>
        <GreenButton
          onClick={() => setShowPopUp(true)}
        >
          + Add Goal
        </GreenButton>
          {ShowPopUp && <AddGoalPopup ref={popupRef} onClose={() => setShowPopUp(false)} />}
      </div>
        

      
<div
  style={{
    width: "90%",
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  }}
>

  <div >
  <RadioToggle />
  </div>

  {LinksData.map((val, key) => {
    return (
      <Link
        key={key}
        to={val.link}
        style={{ textDecoration: "none", width: "100%" }}
        id={location.pathname === val.link ? "active" : ""}
      >
        <div
          style={{
            ...styles.box,

            display: "flex",
            alignItems: "center",
            gap: "15px",

            width: "85%",
            maxWidth: "900px",

            margin: 0,
            boxSizing: "border-box",
            minHeight: "50px",
          }}
        >
          <div style={styles.circle}>
            {val.icon}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minWidth: 0,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(16px, 3vw, 22px)",
                wordBreak: "break-word",
              }}
            >
              {val.title}
            </h2>

            <h3
              style={{
                color: "#ADAAAA",
                margin: 0,
                fontSize: "clamp(12px, 2vw, 15px)",
                wordBreak: "break-word",
              }}
            >
              {val.subTitle}
            </h3>
          </div>
        </div>
      </Link>
    );
  })}
</div>
      </div>
  );
}


// To James: this function is the code for the pop up to add goal 
const AddGoalPopup = forwardRef(({ onClose }, ref ) => {
  

  return (
    <div style={overlayStyle}>
      <div ref={ref} style={popupStyle}>
        <h2>Popup Content</h2>
        <p>This is a simple popup.</p>
        <div style={{display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center', 
        marginTop: '30%',
        }}> 
        
        <GreenButton BGColor='Black' Txtcolor='Gray' onClick={onClose}>
          Cancel
        </GreenButton>

        <GreenButton> Save </GreenButton>
        </div>
      </div>
    </div>
  );
});

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
    <div style={{...styles.box, boxSizing: "border-box", marginLeft: "0px", width: "100%"}}>  
    <label
  style={{
    display: "flex",
    alignItems: "center",
    gap: "15px",
    cursor: "pointer",
    userSelect: "none",
    color: "#FFFF",
    fontSize: 12,
    width: "100%",
    flexWrap: "wrap",
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
      <div
  style={{
    display: "flex",
  
    flexDirection: "column",
    flex: 1,
    minWidth: 0,
  }}
>
      <h2 style={{margin: 0, textDecoration: crossedOut}}>Option 1 </h2>
          <h3 style={{color: "#ADAAAA", margin: 2, textDecoration: crossedOut}}>text1</h3>
          </div>
    </label>
        </div>

  );
}
const styles = {
  box: {
    display: "flex",
    backgroundColor: "#212020",
    flex: 1,
    color: " white",
    border: "1px solid #2a2a2a",
    borderRadius: 14,
    padding: "12px 28px 12px 40px",
    marginRight: "100px",
    alignItems: "center",
    
    margin: "20px auto",
    fontFamily: "'lexend', sans-serif",
    maxWidth: "900px",
    width: "100%",
    flexWrap: "wrap",
  },

  
  radio: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    border: "2px solid #555",
    display: "flex",
    fontSize: "16px",
    alignItems: "center",
    justifyContent: "center",
    color: "black",
    transition: "0.2s"
  },

circle: {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minWidth: "50px",
  minHeight: "50px",

  width: "50px",
  height: "50px",

  borderRadius: "50%",
  backgroundColor: "#3a3a3a",

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
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",

  display: "flex",
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

  width: "75%",
  maxWidth: "700px",

  minHeight: "300px",

  boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
  boxSizing: "border-box"
};

export default Dashboard;

const LinksData = [
  {
    title: "VIEW WORKOUT PLANS",
    subTitle: "Access your custom elite archive",
    icon: <DescriptionIcon />,
    link: "/logworkoutplan"
  },
  {
    title: "VIEW WORKOUT HISTORY",
    subTitle: "Track your evolution and consistency",
    icon: <EventNoteIcon/>,
    link: "/history"
  }
]