import React, { useEffect, useContext, useState, useRef, forwardRef } from 'react';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import GreenButton from '../Components/CustomButton';
import { Link, useLocation } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useTheme } from '../Components/ThemeContext';

// ─── Helpers ────────────────────────────────────────────────────────────────

async function checkIfNewDay() {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/user/streak`, {
      method: 'PATCH',    // put get by accident took forever 
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Failed to update streak');

    const data = await res.json();
    console.log('streak data:', data);  // check shape
    return data.streak[0].day_tally;

  } catch (err) {
    console.error(err);
    return 0;
  }
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function Dashboard() {
  const { theme, darkMode, setDarkMode } = useTheme();

  const [showPopUp, setShowPopUp] = useState(false);
  const [dayCount, setStreak] = useState(0);

  useEffect(() => {
    checkIfNewDay().then(streak => setStreak(streak));
  }, []);  

  const [goals, setGoals] = useState([]);

// fix 1: fetch goals correctly with fallback
useEffect(() => {
  fetch( `${process.env.REACT_APP_API_URL}/goals`, { credentials: 'include' })
    .then(res => res.json())
    .then(data => setGoals(data.goals || []))
    .catch(err => console.error(err));
}, []);

 


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
    backgroundColor: theme.pageBg,
    paddingLeft: '40px',
    paddingRight: '40px',
    paddingTop: '20px',    
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
    background: theme.cardBg, //'#191A17',
    borderRadius: '100px',
    color: theme.accent ,//'#F6FFC0',
    gap: '10px',
  }}>
    <LocalFireDepartmentIcon sx={{ fontSize: 35 }} />
    <p style={{ margin: 0 }}>{dayCount } DAY STREAK</p>
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
    <span style={{ color: theme.text }}>TARGET MILESTONES</span>
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
  margin: '0 auto',       
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
              ...styles(theme).box,
              display: 'flex', alignItems: 'center', gap: '15px',
              width: '85%', maxWidth: '900px', margin: 0,
              boxSizing: 'border-box', minHeight: '50px',
            }}>
              <div style={styles(theme).circle}>{val.icon}</div>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                <h2 style={{ margin: 0, fontSize: 'clamp(16px, 3vw, 22px)', wordBreak: 'break-word' }}>
                  {val.title}
                </h2>
                <h3 style={{ color: theme.text, margin: 0, fontSize: 'clamp(12px, 2vw, 15px)', wordBreak: 'break-word' }}>
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
  const { theme, darkMode, setDarkMode } = useTheme();

  const handleSave = async () => {
    if (!addingDescription) {
      if (title.trim() === '') return;
      setAddingDescription(true);
      return;
    }

    try{
      const res = await fetch(`${process.env.REACT_APP_API_URL}/goals/add/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, description }),
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to add goal");
      return;
      }

const updated = await fetch(`${process.env.REACT_APP_API_URL}/goals`, { credentials: 'include' });
    const updatedData = await updated.json();
    setGoals(updatedData.goals || []);
    onClose();

    }

    catch(err){
      console.error(err);
    };
  };

  return (
    <div style={overlayStyle(theme)}>
      <div ref={ref} style={popupStyle(theme)}>
        <h2>{addingDescription ? 'Add Description' : 'New Goal'}</h2>
        <p>{addingDescription ? 'Goal Description' : 'Goal Title'}</p>

        {!addingDescription ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Beast Mode"
            style={txtBoxStyle(theme)}
          />
        ) : (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your goal..."
            style={txtBoxStyle(theme)}
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

// Receives goals + setGoals 
function RadioToggle({ goals, setGoals }) {

  const toggle = async (id) => {
    const updated = goals.find((g) => g.id === id);
    console.log("check input in front", updated.is_completed);

    try {

      const res = await fetch(`${process.env.REACT_APP_API_URL}/goals/${id}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type' : 'application/json'},
        credentials: 'include', 
        body: JSON.stringify({ is_completed: !updated.is_completed }),
      });

      const data = await res.json();
      console.log("toggle response:", data);
      setGoals(prev => prev.map(g => g.id === id ? data.goal : g));

      }
      catch (err){
        alert("Failed to update goal status");
      }
    
    };

const deleteGoal = async (id) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/goals/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!res.ok) throw new Error("Failed to delete goal");

    setGoals(prev => prev.filter(p => p.id !== id)); 

  } catch (err) {
    alert("Failed to delete goal");
  }
};

  const { theme, darkMode, setDarkMode } = useTheme();

  return (
    <>
  {goals.map((goal) => (
    <div
       key={`goal-${goal.id}`}
      style={{
        ...styles(theme).box,
        margin: "5px auto",
        boxSizing: 'border-box',
        marginLeft: '0px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* label only wraps the checkbox and text */}
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        cursor: 'pointer',
        userSelect: 'none',
        color: theme.text,
        fontSize: 12,
        flex: 1,           // takes up rest of space
        flexWrap: 'wrap',
      }}>
        <input
          style={{ display: 'none' }}
          type="checkbox"
          checked={goal.is_completed}
          onChange={() => toggle(goal.id)}
        />
        
        <span style={{
          // COLOR ISSUE FIX
          ...styles(theme).radio,
          backgroundColor: goal.is_completed ?  theme.muted : theme.watermark ,
          borderColor: goal.is_completed ? theme.watermark : theme.muted ,//'#F6FFC0' : '#555',
        }}>

          {goal.is_completed && <span style={styles(theme).checkmark}>✓</span>}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          <h2 style={{ margin: 0, textDecoration: goal.is_completed ? 'line-through' : 'none' }}>
            {goal.title}
          </h2>
          <h3 style={{ color: theme.toggleNotDone, margin: 2, textDecoration: goal.is_completed ? 'line-through' : 'none' }}>
            {goal.description}
          </h3>
        </div>
      </label>

      {/* delete button outside label so clicks don't conflict */}
      <button
        onClick={(e) => { e.stopPropagation(); deleteGoal(goal.id); }}
        style={deleteButtonStyle(theme)}
      >
        Delete
      </button>
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

const styles = (theme) => ({
  
  box: {
    display: 'flex',
    backgroundColor: theme.cardBg,//'#212020',
    flex: 1,
    color: theme.text, //'white',
    border: `1px solid ${theme.cardBorder}`,// #2a2a2a',
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
    border: `2px solid ${theme.toggleoffknob}`,// #555',
    display: 'flex',
    fontSize: '16px',
    alignItems: 'center',
    justifyContent: 'center',
    color:  theme.pageBg, //'black',
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
    backgroundColor: theme.selectBg, //'#3a3a3a',
  },
  checkmark: {
    fontSize: '16px',
    lineHeight: 1,
    pointerEvents: 'none',
  },
});

const overlayStyle = (theme) => ({
  position: 'fixed',
  top: 0, left: 0,
  width: '100vw', height: '100vh',
  backgroundColor: theme.securityNoteBg, //'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
});

const popupStyle = (theme) => ({
  backgroundColor: theme.cardBg, //'#20201F',
  color: theme.accent, //'#DFFF00',
  fontFamily: "'lexend', sans-serif",
  padding: '20px',
  borderRadius: '5px',
  width: '75%',
  maxWidth: '700px',
  minHeight: '300px',
  boxShadow: '0 0 10px rgba(0,0,0,0.3)',
  boxSizing: 'border-box',
});

const txtBoxStyle = (theme) => ({
  padding: '8px',
  border: '1px solid #DAF900',
  borderRadius: '4px',
  fontSize: 20,
  width: '100%',
  backgroundColor: theme.securityNoteBg, // 'rgba(72, 72, 71, .3)',
  color: theme.text, //'white',
});

const deleteButtonStyle = (theme) => ({
  marginLeft: 'auto',
  padding: '6px 14px',
  backgroundColor: 'transparent',
  border: '1px solid #555',
  borderRadius: '6px',
  color: theme.muted, //'#ADAAAA',
  cursor: 'pointer',
  fontSize: 12,
  fontFamily: "'lexend', sans-serif",
  transition: 'border-color 0.2s, color 0.2s',
});

export default Dashboard;