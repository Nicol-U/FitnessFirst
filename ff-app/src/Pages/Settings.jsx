
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useState } from "react";
/*
export function Settings() {
  return (

    <div className="page">
      {/* Header }
      <div className= 'toprow'>
          <h1 className='heading' style={{ fontSize: 46, fontWeight: 900, marginLeft: "150px"}}>
            <span style={{ color: "#fff" }}>SETTINGS </span>
          </h1>
      </div>
      </div>
  );
}

export default Settings;*/

/*export function GrayRactangles({widthSize="75%", heightSize="90vh", children}){
  const styles1 = {
    display: "flex",
    backgroundColor: "#212020",
    flex: 1,
    color: " white",
    border: "1px solid #2a2a2a",
    borderRadius: 14,
    padding: "12px 28px 12px 40px",
    width: "90vw",
    marginRight: "100px",
    maxHeight: heightSize,
    marginLeft: "150px",
    fontFamily: "'lexend', sans-serif",
    maxWidth: widthSize,
  };

:root {
  --primary-color: #DFFF00;
  --primary-font: 'lexend', sans-serif;
  --primary-bg-color: #0E0E0E;
  --selection-black: #393939;
  --main-gray: #ADAAAA;
}
*/



const ACCENT = "#DFFF00";
const DARK_BG = "#0E0E0E";
const CARD_BG = "#1a1a1a";
const CARD_BORDER = "#2a2a2a";
const INPUT_BORDER = "#444";
const MUTED = "#888";
const TEXT = "#ffffff";

const SIDEBAR_WIDTH = "300px";

const styles = {
  page: {
    backgroundColor: DARK_BG,
    minHeight: "100vh",
    fontFamily: "'lexend', 'Arial Black', 'Arial', sans-serif",
    color: TEXT,
    marginLeft: SIDEBAR_WIDTH,
    paddingLeft: "40px",
    paddingRight: "40px",
    paddingTop: "0",
    paddingBottom: "80px",
    boxSizing: "border-box",
  },
  topRow: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingTop: "40px",
    paddingBottom: "8px",
  },
  headingBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  subheading: {
    fontSize: "12px",
    color: MUTED,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    borderLeft: `3px solid ${ACCENT}`,
    paddingLeft: "10px",
    marginBottom: "4px",
  },
  heading: {
    fontSize: 48,
    fontWeight: 900,
    letterSpacing: "-0.2px",
    lineHeight: 1,
    color: TEXT,
    margin: 0,
    textTransform: "uppercase",
  },
  binaryWatermark: {
    fontSize: "48px",
    fontWeight: 900,
    color: "#2a2a2a",
    letterSpacing: "4px",
    userSelect: "none",
    lineHeight: 1,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.8fr 1fr",
    gap: "16px",
    marginTop: "24px",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginTop: "16px",
  },
  card: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: "12px",
    padding: "28px",
    position: "relative",
    overflow: "hidden",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "24px",
  },
  cardDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: ACCENT,
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: "12px",
    fontWeight: 900,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: TEXT,
  },
  fieldGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px 32px",
  },
  fieldLabel: {
    fontSize: "10px",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: MUTED,
    marginBottom: "8px",
  },
  fieldInput: {
    fontSize: "20px",
    fontWeight: 700,
    color: TEXT,
    background: "transparent",
    border: "none",
    borderBottom: `1px solid ${INPUT_BORDER}`,
    //borderBottom: "none",
    width: "100%",
    paddingBottom: "6px",
    outline: "none",
    fontFamily: "inherit",
  },
  securityNote: {
    fontSize: "11px",
    color: MUTED,
    lineHeight: 1.6,
    marginTop: "16px",
    padding: "12px",
    backgroundColor: "#111",
    borderRadius: "6px",
  },
  securityNoteHighlight: {
    color: ACCENT,
    fontWeight: 700,
  },
  passwordRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: `1px solid ${INPUT_BORDER}`,
    paddingBottom: "6px",
  },
  passwordDots: {
    fontSize: "18px",
    letterSpacing: "3px",
    color: MUTED,
  },
  changeBtn: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: ACCENT,
    background: "none",
    border: "none",
    cursor: "pointer",
    textTransform: "uppercase",
    padding: 0,
    fontFamily: "inherit",
  },
  toggleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  toggleLabel: {
    fontSize: "15px",
    fontWeight: 700,
    color: TEXT,
  },
  toggleSub: {
    fontSize: "10px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: MUTED,
    marginTop: "2px",
  },
  ampmBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#333",
    color: TEXT,
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.1em",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
    fontFamily: "inherit",
  },
  selectWrapper: {
    position: "relative",
  },
  selectField: {
    background: "#333333",
    border: "none",
    borderBottom: `1px solid ${INPUT_BORDER}`,
    color: TEXT,
    fontSize: "16px",
    fontWeight: 700,
    fontFamily: "inherit",
    width: "100%",
    paddingBottom: "8px",
    paddingTop: "4px",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    WebkitAppearance: "none",
  },
  selectArrow: {
    position: "absolute",
    right: "4px",
    top: "50%",
    transform: "translateY(-60%)",
    color: MUTED,
    pointerEvents: "none",
    fontSize: "16px",
  },
  avatarPlaceholder: {
    position: "absolute",
    top: "24px",
    right: "24px",
    width: "52px",
    height: "52px",
    //borderRadius: "50%",
    //backgroundColor: "#2a2a2a",
    //border: `1px solid ${CARD_BORDER}`,
    //display: "flex",
    //alignItems: "center",
    //justifyContent: "center",
    color: MUTED,
  },
  displayIconBg: {
    position: "absolute",
    top: "8px",
    right: "8px",
    width: "48px",
    height: "96px",
    //borderRadius: "50%",
    //backgroundColor: "#222",
    //display: "flex",
    //alignItems: "center",
    //justifyContent: "center",
    opacity: 0.5,
    marginTop: "15px",
  },
  actionRow: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "24px",
    marginTop: "28px",
  },
  discardBtn: {
    background: "none",
    border: "none",
    color: MUTED,
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    cursor: "pointer",
    padding: "12px 0",
    fontFamily: "inherit",
  },
  updateBtn: {
    backgroundColor: ACCENT,
    color: "#000",
    border: "none",
    borderRadius: "8px",
    padding: "14px 32px",
    fontSize: "13px",
    fontWeight: 900,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  confrimMessage: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#09f114d1",
    fontFamily: "inherit",
  },
};

//define toggle component

function Toggle({ checked, onChange }) {
  //checked: state of the button (true or false)
  //onChange: function that sets the value of checked
  return (
    // container
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: "48px",
        height: "26px",
        borderRadius: "13px",
        backgroundColor: checked ? ACCENT : "#444",
        position: "relative",
        cursor: "pointer",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      {/* moveable circle */}
      <div
        style={{
          position: "absolute",
          top: "3px",
          left: checked ? "25px" : "3px",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: checked ? "#000" : "#888",
          transition: "left 0.2s",
        }}
      />
      
    </div>
    
  );
}

export function Settings() {
  // set default elements and update functions begin
  const [form, setForm] = useState({
    fullName: "ALEX RIVERA",
    username: "arivera_88",
    currentWeight: "85.0",
    targetWeight: "82.5",
    email: "alex.rivera@example.com",
  });

  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [alertTime, setAlertTime] = useState("06:30");
  const [ampm, setAmpm] = useState("AM");
  const [fontDensity, setFontDensity] = useState("STANDARD");
  const [confirmMessage, setConfirmMessage] = useState("");

  // function handleField takes a parameter "key" and returns a function that takes parameter "e" and calls the function setForm. The value of "e" comes from the user input because function handleField is used in function onChange
  const handleField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));
    // function setForm takes a parameter "f", which is the previous state (see line 397 as an example), and returns an object (not return two separate commands) that copy the previous state first then update "key" using e's value

  const handleDiscard = () => {
    setForm({
      fullName: "ALEX RIVERA",
      username: "arivera_88",
      currentWeight: "85.0",
      targetWeight: "82.5",
      email: "alex.rivera@example.com",
    });
    setWorkoutReminders(true);
    setDarkMode(true);
    setAlertTime("06:30");
    setAmpm("AM");
    setFontDensity("STANDARD");
  };

  const handleSave = () => {
    //TODO: backend
    setConfirmMessage("Settings Updated");
  };
  // Set default elements and update functions end

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.topRow}>
        <div style={styles.headingBlock}>
          <h1 style={styles.heading}>SETTINGS</h1>
          <p style={styles.subheading}>Configure your elite performance parameters.</p>
        </div>
        <div style={styles.binaryWatermark}>010101</div>
      </div>

      {/* Top row: Profile Identity + Security */}
      <div style={styles.grid}>

        {/* Profile Identity Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardDot} />
            <span style={styles.cardTitle}>Profile Identity</span>
          </div>
          <PermIdentityIcon style = {styles.avatarPlaceholder}></PermIdentityIcon>
          <div style={styles.fieldGrid}>
            <div>
              <div style={styles.fieldLabel}>Full Name</div>
              <input style={styles.fieldInput} value={form.fullName} onChange={handleField("fullName")} />
            </div>
            <div>
              <div style={styles.fieldLabel}>Username</div>
              <input style={styles.fieldInput} value={form.username} onChange={handleField("username")} />
            </div>
            <div>
              <div style={styles.fieldLabel}>Current Weight (kg)</div>
              <input style={styles.fieldInput} value={form.currentWeight} onChange={handleField("currentWeight")} />
            </div>
            <div>
              <div style={styles.fieldLabel}>Target Weight (kg)</div>
              <input style={styles.fieldInput} value={form.targetWeight} onChange={handleField("targetWeight")} />
            </div>
          </div>
        </div>

        {/* Security Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardDot} />
            <span style={styles.cardTitle}>Security</span>
          </div>
          <div style={styles.displayIconBg}>
            <SecurityIcon></SecurityIcon>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <div style={styles.fieldLabel}>Email Address</div>
            <input style={styles.fieldInput} value={form.email} onChange={handleField("email")} />
          </div>
          <div>
            <div style={styles.fieldLabel}>Password</div>
            <div style={styles.passwordRow}>
              <span style={styles.passwordDots}>••••••••••••</span>
              <button style={styles.changeBtn}>Change</button>
            </div>
          </div>
          <div style={styles.securityNote}>
            Two-factor authentication is currently{" "}
            <span style={styles.securityNoteHighlight}>ENABLED</span> for enhanced
            archive security.
          </div>
        </div>
      </div>

      {/* Bottom row: Notifications + Display */}
      <div style={styles.grid2}>

        {/* Notifications Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardDot} />
            <span style={styles.cardTitle}>Notifications</span>
          </div>
          <div style={styles.displayIconBg}>
            <NotificationsNoneIcon></NotificationsNoneIcon>
          </div>
          <div style={styles.toggleRow}>
            <div>
              <div style={styles.toggleLabel}>Workout Reminders</div>
              <div style={styles.toggleSub}>Push notification triggers</div>
            </div>
            <Toggle checked={workoutReminders} onChange={setWorkoutReminders} />
          </div>
          <div style={{ marginTop: "20px" }}>
            <div style={styles.fieldLabel}>Preferred Alert Time</div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "none", paddingBottom: "6px" }}>
              {/* This will result in 24 hours timer internally, not 12 hours am/pm */}
              <input
                type = "time"
                style={{ ...styles.fieldInput, fontSize: "32px", fontWeight: 900, border: "none", flex: 1, paddingBottom: 0 }}
                value={alertTime}
                onChange={(e) => setAlertTime(e.target.value)}
              />
              {/* <button style={styles.ampmBadge} onClick={() => setAmpm(ampm === "AM" ? "PM" : "AM")}>
                {ampm}
              </button> */}
            </div>
          </div>
        </div>

        {/* Display Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardDot} />
            <span style={styles.cardTitle}>Display</span>
          </div>
          <div style={styles.displayIconBg}>
            <ColorLensIcon></ColorLensIcon>
          </div>
          <div style={styles.toggleRow}>
            <div>
              <div style={styles.toggleLabel}>Dark Mode</div>
              <div style={styles.toggleSub}>High-contrast performance theme</div>
            </div>
            <Toggle checked={darkMode} onChange={setDarkMode} />
          </div>
          <div style={{ marginTop: "24px" }}>
            <div style={styles.fieldLabel}>Font Density</div>
            <div style={styles.selectWrapper}>
              <select
                style={styles.selectField}
                value={fontDensity}
                onChange={(e) => setFontDensity(e.target.value)}
              >
                <option value="STANDARD">STANDARD</option>
                <option value="COMPACT">COMPACT</option>
                <option value="COMFORTABLE">COMFORTABLE</option>
              </select>
              <span style={styles.selectArrow}>▾</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={styles.actionRow}>
        <button style={styles.discardBtn} onClick={handleDiscard}>Discard Changes</button>
        <button style={styles.updateBtn} onClick={handleSave}>Update Archive</button>
        <p style = {styles.confrimMessage}>{confirmMessage}</p>
      </div>

    </div>
  );
}

export default Settings;