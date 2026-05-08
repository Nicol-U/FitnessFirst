import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GreenButton from "../Components/CustomButton";

export function CreateAcc() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPswd] = useState("");
  const [birthdate, setBirth] = useState("");
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate("/");
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.logo}>FITNESSFIRST</h1>

      <div style={styles.mainLayout}>
        {/* Headers on the Left */}
        <div style={styles.leftSide}>
          <h2 style={styles.heroText}>
            THE<br />
            <span style={{ color: "#DFFF00" }}>ARCHIVE</span><br />
            AWAITS.
          </h2>
          <p style={styles.heroSubtext}>
            Enter the elite performance ecosystem. Your data, refined. Your potential, archived.
          </p>
        </div>

        {/* Form Fields */}
        <div style={styles.rightSide}>
          <h2 style={styles.formTitle}>IDENTITY SETUP</h2>

          {/* name + username */}
          <div style={styles.row}>
            <div style={styles.halfField}>
              <label style={styles.label}>FULL NAME</label>
              <div style={styles.inputWrapper}>
                <input
                  type="text"
                  placeholder="Alex Rivera"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.halfField}>
              <label style={styles.label}>USERNAME</label>
              <div style={styles.inputWrapper}>
                <input
                  type="text"
                  placeholder="@archive_user"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {/* email field */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>EMAIL ADDRESS</label>
            <div style={styles.inputWrapper}>
              <input
                type="email"
                placeholder="alex@performance.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          {/* pswd + birthday */}
          <div style={styles.row}>
            <div style={styles.halfField}>
              <label style={styles.label}>PASSWORD</label>
              <div style={styles.inputWrapper}>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPswd(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.halfField}>
              <label style={styles.label}>BIRTHDATE</label>
              <div style={styles.inputWrapper}>
                <input
                  type="text"
                  placeholder="mm/dd/yyyy"
                  value={birthdate}
                  onChange={(e) => {
                    let val = e.target.value.replace(/[^0-9]/g, "");
                    if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
                    if (val.length > 5) val = val.slice(0, 5) + "/" + val.slice(5);
                    if (val.length > 10) val = val.slice(0, 10);
                    setBirth(val);
                  }}
                  maxLength={10}
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {/* initialize green button */}
          <div style={{ marginTop: "10px" }}>
            <GreenButton width="100%" onClick={handleCreateAccount}>
              INITIALIZE PROFILE
            </GreenButton>
          </div>

          {/* accept terms line */}
          <p style={styles.termsText}>
            BY CONTINUING, YOU AGREE TO THE{" "}
            <span style={styles.termsLink}>ARCHIVE PROTOCOL & PRIVACY</span>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "black",
    fontFamily: "'Lexend', sans-serif",
    padding: "30px 50px",
    boxSizing: "border-box",
  },
  logo: {
    color: "#DFFF00",
    fontSize: "24px",
    fontWeight: 700,
    letterSpacing: "4px",
    fontStyle: "italic",
    marginBottom: "40px",
  },
  mainLayout: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: "80px",
    flexWrap: "wrap",
  },
  leftSide: {
    flex: 1,
    minWidth: "280px",
    maxWidth: "450px",
  },
  heroText: {
    color: "#fff",
    fontSize: "64px",
    fontWeight: 800,
    lineHeight: 1.05,
    margin: "0 0 20px 0",
  },
  heroSubtext: {
    color: "#aaa",
    fontSize: "16px",
    lineHeight: 1.6,
    maxWidth: "350px",
  },
  rightSide: {
    flex: 1,
    minWidth: "320px",
    maxWidth: "480px",
    backgroundColor: "#111",
    borderRadius: "16px",
    padding: "40px 36px",
    border: "1px solid #2a2a2a",
  },
  formTitle: {
    color: "#fff",
    fontSize: "22px",
    fontWeight: 600,
    letterSpacing: "2px",
    marginBottom: "28px",
  },
  row: {
    display: "flex",
    gap: "16px",
    marginBottom: "18px",
  },
  halfField: {
    flex: 1,
  },
  fieldGroup: {
    width: "100%",
    marginBottom: "18px",
  },
  label: {
    color: "#aaa",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "1.5px",
    marginBottom: "8px",
    display: "block",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    padding: "14px 16px",
    width: "100%",
    boxSizing: "border-box",
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    fontSize: "15px",
    fontFamily: "'Lexend', sans-serif",
    width: "100%",
  },
  termsText: {
    color: "#666",
    fontSize: "10px",
    letterSpacing: "1px",
    textAlign: "center",
    marginTop: "20px",
  },
  termsLink: {
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default CreateAcc;