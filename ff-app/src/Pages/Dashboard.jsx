import React, { useEffect, useState, useRef, forwardRef } from 'react';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import GreenButton from '../Components/CustomButton';
import { Link, useLocation } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
import EventNoteIcon from '@mui/icons-material/EventNote';

// ─── Helpers ────────────────────────────────────────────────────────────────

function checkIfNewDay() {
  const cntDay   = JSON.parse(localStorage.getItem('DayCount')) || 0;
  const savedDay = JSON.parse(localStorage.getItem('NextDay'))  || null;
  const currentDay = new Date().getDate();
  const nextDay    = (currentDay + 1) % 31;

  if (currentDay < savedDay) {
    return cntDay;
  } else if (currentDay === savedDay && savedDay !== null && cntDay !== 0) {
    localStorage.setItem('DayCount', JSON.stringify(cntDay + 1));
    localStorage.setItem('NextDay',  JSON.stringify(nextDay));
    return cntDay + 1;
  } else {
    localStorage.setItem('NextDay',  JSON.stringify(nextDay));
    localStorage.setItem('DayCount', JSON.stringify(1));
    return 1;
  }
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function Dashboard() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [dayCount]                = useState(checkIfNewDay);

  // Single source of truth for goals — shared with popup and toggle
  const [goals, setGoals] = useState(
    () => JSON.parse(localStorage.getItem('goals')) || []
  );

  const location = useLocation();
  const popupRef = useRef(null);

  useEffect(() => {
    function handleOutClick(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopUp(false);
      }
    }
    if (showPopUp) document.addEventListener('mousedown', handleOutClick);
    return () => document.removeEventListener('mousedown', handleOutClick);
  }, [showPopUp]);

  return (
  <div className="page" style={{
    paddingLeft: '40px',
    paddingRight: '40px',
    paddingTop: '20px',    /* reduced top padding */
  }}>
{/* Streak badge */}
<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '55px',
    width: '100%',
    maxWidth: '320px',
    fontSize: 'clamp(14px, 4vw, 24px)',
    background: '#191A17',
    borderRadius: '100px',
    color: '#F6FFC0',
    gap: '10px',
  }}>
    <LocalFireDepartmentIcon sx={{ fontSize: 35 }} />
    <p style={{ margin: 0 }}>{dayCount} DAY STREAK</p>
  </div>
</div>

{/* Header row */}
<div style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '15px',
  width: '100%',           /* was 90% with marginLeft */
  maxWidth: '1100px',
  margin: '0 auto',        /* center instead of marginLeft: 20px */
  boxSizing: 'border-box',
}}>
  <h1 style={{ fontSize: 'clamp(18px, 4vw, 28px)', fontWeight: 900, margin: 0 }}>
    <span style={{ color: '#fff' }}>TARGET MILESTONES</span>
  </h1>
  <GreenButton onClick={() => setShowPopUp(true)}>+ Add Goal</GreenButton>
  {showPopUp && (
    <AddGoalPopup
      ref={popupRef}
      onClose={() => setShowPopUp(false)}
      goals={goals}
      setGoals={setGoals}
    />
  )}
</div>

{/* Goals + links */}
<div style={{
  width: '100%',
  maxWidth: '1100px',
  margin: '0 auto',        /* center instead of 0 auto with 90% width */
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  boxSizing: 'border-box',
}}>

        {/*  Pass goals + setGoals so toggle/delete update shared state */}
        <RadioToggle goals={goals} setGoals={setGoals} />

        {LinksData.map((val, key) => (
          <Link
            key={key}
            to={val.link}
            style={{ textDecoration: 'none', width: '100%' }}
            id={location.pathname === val.link ? 'active' : ''}
          >
            <div style={{
              ...styles.box,
              display: 'flex', alignItems: 'center', gap: '15px',
              width: '85%', maxWidth: '900px', margin: 0,
              boxSizing: 'border-box', minHeight: '50px',
            }}>
              <div style={styles.circle}>{val.icon}</div>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                <h2 style={{ margin: 0, fontSize: 'clamp(16px, 3vw, 22px)', wordBreak: 'break-word' }}>
                  {val.title}
                </h2>
                <h3 style={{ color: '#ADAAAA', margin: 0, fontSize: 'clamp(12px, 2vw, 15px)', wordBreak: 'break-word' }}>
                  {val.subTitle}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Add Goal Popup ──────────────────────────────────────────────────────────

const AddGoalPopup = forwardRef(({ onClose, goals, setGoals }, ref) => {
  const [title,              setTitle]              = useState('');
  const [description,        setDescription]        = useState('');
  const [addingDescription,  setAddingDescription]  = useState(false);

  const handleSave = () => {
    if (!addingDescription) {
      if (title.trim() === '') return;
      setAddingDescription(true);
      return;
    }

    const newGoal = { id: Date.now(), title, description, completed: false };

    // Derive next state from current, persist, then lift up
    const updated = [...goals, newGoal];
    localStorage.setItem('goals', JSON.stringify(updated));
    setGoals(updated);   // ← causes RadioToggle to re-render immediately

    onClose();
  };

  return (
    <div style={overlayStyle}>
      <div ref={ref} style={popupStyle}>
        <h2>{addingDescription ? 'Add Description' : 'New Goal'}</h2>
        <p>{addingDescription ? 'Goal Description' : 'Goal Title'}</p>

        {!addingDescription ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Beast Mode"
            style={txtBoxStyle}
          />
        ) : (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your goal..."
            style={txtBoxStyle}
          />
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px' }}>
          <GreenButton BGColor="Black" Txtcolor="Gray" onClick={onClose}>Cancel</GreenButton>
          <GreenButton onClick={handleSave}>{addingDescription ? 'Finish' : 'Save'}</GreenButton>
        </div>
      </div>
    </div>
  );
});

// ─── Goal Toggle List ────────────────────────────────────────────────────────

// Receives goals + setGoals as props — no local state needed
function RadioToggle({ goals, setGoals }) {

  const toggle = (id) => {
    const updated = goals.map((g) =>
      g.id === id ? { ...g, completed: !g.completed } : g
    );
    setGoals(updated);
    localStorage.setItem('goals', JSON.stringify(updated));
  };

  // deleteGoal is now defined and wired up
  const deleteGoal = (id) => {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    localStorage.setItem('goals', JSON.stringify(updated));
  };

  return (
    <>
      {goals.map((goal) => (
        <div key={goal.id} style={{ ...styles.box, boxSizing: 'border-box', marginLeft: '0px', width: '100%' }}>
          <label style={{
            display: 'flex', alignItems: 'center', gap: '15px',
            cursor: 'pointer', userSelect: 'none', color: '#FFFF',
            fontSize: 12, width: '100%', flexWrap: 'wrap',
          }}>
            <input
              style={{ display: 'none' }}
              type="checkbox"
              checked={goal.completed}
              onChange={() => toggle(goal.id)}
            />

            <span style={{
              ...styles.radio,
              backgroundColor: goal.completed ? '#F6FFC0' : 'black',
              borderColor:     goal.completed ? '#F6FFC0' : '#555',
            }}>
              {goal.completed && <span style={styles.checkmark}>✓</span>}
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
              <h2 style={{ margin: 0, textDecoration: goal.completed ? 'line-through' : 'none' }}>
                {goal.title}
              </h2>
              <h3 style={{ color: '#ADAAAA', margin: 2, textDecoration: goal.completed ? 'line-through' : 'none' }}>
                {goal.description}
              </h3>
            </div>
          
          {/* Delete button now works */}
          <button
            onClick={() => deleteGoal(goal.id)}
            style={deleteButtonStyle}
          >
            Delete
          </button>
          </label>


        </div>
      ))}
    </>
  );
}

// ─── Data Info for links ─────────────────────────────────────────────────────────────

const LinksData = [
  {
    title: 'VIEW WORKOUT PLANS',
    subTitle: 'Access your custom elite archive',
    icon: <DescriptionIcon />,
    link: '/logworkoutplan',
  },
  {
    title: 'VIEW WORKOUT HISTORY',
    subTitle: 'Track your evolution and consistency',
    icon: <EventNoteIcon />,
    link: '/history',
  },
];

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = {
  box: {
    display: 'flex',
    backgroundColor: '#212020',
    flex: 1,
    color: 'white',
    border: '1px solid #2a2a2a',
    borderRadius: 14,
    padding: '12px 28px 12px 40px',
    alignItems: 'center',
    margin: '20px auto',
    fontFamily: "'lexend', sans-serif",
    maxWidth: '900px',
    width: '100%',
    flexWrap: 'wrap',
  },
  radio: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    border: '2px solid #555',
    display: 'flex',
    fontSize: '16px',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
    transition: '0.2s',
  },
  circle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '50px',
    minHeight: '50px',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#3a3a3a',
  },
  checkmark: {
    fontSize: '16px',
    lineHeight: 1,
    pointerEvents: 'none',
  },
};

const overlayStyle = {
  position: 'fixed',
  top: 0, left: 0,
  width: '100vw', height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
};

const popupStyle = {
  backgroundColor: '#20201F',
  color: '#DFFF00',
  fontFamily: "'lexend', sans-serif",
  padding: '20px',
  borderRadius: '5px',
  width: '75%',
  maxWidth: '700px',
  minHeight: '300px',
  boxShadow: '0 0 10px rgba(0,0,0,0.3)',
  boxSizing: 'border-box',
};

const txtBoxStyle = {
  padding: '8px',
  border: '1px solid #DAF900',
  borderRadius: '4px',
  fontSize: 20,
  width: '100%',
  backgroundColor: 'rgba(72, 72, 71, .3)',
  color: 'white',
};

const deleteButtonStyle = {
  marginLeft: 'auto',
  padding: '6px 14px',
  backgroundColor: 'transparent',
  border: '1px solid #555',
  borderRadius: '6px',
  color: '#ADAAAA',
  cursor: 'pointer',
  fontSize: 12,
  fontFamily: "'lexend', sans-serif",
  transition: 'border-color 0.2s, color 0.2s',
};

export default Dashboard;