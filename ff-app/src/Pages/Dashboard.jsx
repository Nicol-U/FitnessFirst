import React, { useEffect, useState, useRef, forwardRef } from 'react';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import GreenButton from '../Components/CustomButton';
import { Link, useLocation } from "react-router-dom"; // ✅ import useLocation
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


const AddGoalPopup = forwardRef(({ onClose }, ref) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [addingDescription, setAddingDescription] = useState(false);

  // Save goal to local storage
  const saveGoalToLocalStorage = (goal) => {
    // Get existing goals
    const existingGoals =
      JSON.parse(localStorage.getItem("goals")) || [];

    // Add new goal
    existingGoals.push(goal);

    // Save updated array
    localStorage.setItem(
      "goals",
      JSON.stringify(existingGoals)
    );
  };

  const handleSave = () => {
    // First save = save title + move to description page
    if (!addingDescription) {
      if (title.trim() === "") return;

      setAddingDescription(true);
      return;
    }

    // Final goal object
    const newGoal = {
      id: Date.now(), // unique id
      title,
      description,
      completed: false,
    };

    // Save to local storage
    saveGoalToLocalStorage(newGoal);

    console.log("Saved Goals:",
      JSON.parse(localStorage.getItem("goals"))
    );

    onClose();
  };

  return (
    <div style={overlayStyle}>
      <div ref={ref} style={popupStyle}>
        <h2>
          {addingDescription ? "Add Description" : "New Goal"}
        </h2>

        <p>
          {addingDescription ? "Goal Description" : "Goal Title"}
        </p>

        {!addingDescription ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Beast Mode"
            style={TxtBoxStyle}
          />
        ) : (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your goal..."
            style={TxtBoxStyle}
          />
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "30px",
          }}
        >
          <GreenButton
            BGColor="Black"
            Txtcolor="Gray"
            onClick={onClose}
          >
            Cancel
          </GreenButton>

          <GreenButton onClick={handleSave}>
            {addingDescription ? "Finish" : "Save"}
          </GreenButton>
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
  const [goals, setGoals] = useState(
    JSON.parse(localStorage.getItem("goals")) || []
  );

  const clicked = (id) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id
        ? {
            ...goal,
            completed: !goal.completed,
          }
        : goal
    );

    // Update state
    setGoals(updatedGoals);

    // Update local storage
    localStorage.setItem(
      "goals",
      JSON.stringify(updatedGoals)
    );
  };

  return (
    <>
      {goals.map((goal) => (
        <div
          key={goal.id}
          style={{
            ...styles.box,
            boxSizing: "border-box",
            marginLeft: "0px",
            width: "100%",
          }}
        >
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
              checked={goal.completed}
              onChange={() => clicked(goal.id)}
            />

            <span
              style={{
                ...styles.radio,
                backgroundColor: goal.completed
                  ? "#F6FFC0"
                  : "black",

                borderColor: goal.completed
                  ? "#F6FFC0"
                  : "#555",
              }}
            >
              {goal.completed && (
                <span style={styles.checkmark}>
                  ✓
                </span>
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
              <h2
                style={{
                  margin: 0,
                  textDecoration: goal.completed
                    ? "line-through"
                    : "none",
                }}
              >
                {goal.title}
              </h2>

              <h3
                style={{
                  color: "#ADAAAA",
                  margin: 2,
                  textDecoration: goal.completed
                    ? "line-through"
                    : "none",
                }}
              >
                {goal.description}
              </h3>
            </div>
          </label>
        </div>
      ))}
    </>
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

const TxtBoxStyle = {
  padding: "8px",
  fontSize: "16px",
  border: "1px solid #DAF900",
  borderRadius: "4px",
  fontSize: 20,
  width: '100%',
  backgroundColor: "rgba(72, 72, 71, .3)",
  color: 'white'
}