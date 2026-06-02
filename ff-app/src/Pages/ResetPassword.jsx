import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import GreenButton from "../Components/CustomButton";

export function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const token = new URLSearchParams(location.search).get("token");

  const handleSubmit = async () => {
    if (!password || !confirm) { setError("Please fill in both fields."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError("");

    try {
      const res = await fetch("http://localhost:3001/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setDone(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch {
      setError("Could not connect to server.");
    }
  };

  if (!token) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.logo}>FITNESSFIRST</h1>
          <p style={{ color: "#ff4d4d", marginTop: "20px" }}>Invalid reset link.</p>
          <Link to="/login" style={{ ...styles.link, marginTop: "16px", display: "block" }}>Back to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.logo}>FITNESSFIRST</h1>
        <h2 style={styles.title}>New Password</h2>

        {done ? (
          <p style={{ color: "#DFFF00", marginTop: "20px", textAlign: "center" }}>
            Password updated! Redirecting to login…
          </p>
        ) : (
          <>
            <p style={styles.subtitle}>Choose a new password for your account.</p>

            {error && <p style={styles.error}>{error}</p>}

            <div style={styles.fieldGroup}>
              <label style={styles.label}>NEW PASSWORD</label>
              <div style={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                />
                <div onClick={() => setShowPassword((p) => !p)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>CONFIRM PASSWORD</label>
              <div style={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  style={styles.input}
                />
              </div>
            </div>

            <GreenButton width="100%" onClick={handleSubmit}>
              UPDATE PASSWORD
            </GreenButton>

            <p style={styles.backText}>
              <Link to="/login" style={styles.link}>Back to Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "black",
    fontFamily: "'Lexend', sans-serif",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "420px",
    padding: "40px 20px",
  },
  logo: {
    color: "#DFFF00",
    fontSize: "28px",
    fontWeight: 700,
    letterSpacing: "4px",
    marginBottom: "8px",
  },
  title: {
    color: "#fff",
    fontSize: "28px",
    fontWeight: 600,
    margin: "10px 0 4px 0",
  },
  subtitle: {
    color: "#888",
    fontSize: "14px",
    marginBottom: "30px",
    textAlign: "center",
  },
  error: {
    color: "#ff4d4d",
    fontSize: "13px",
    marginBottom: "14px",
  },
  fieldGroup: {
    width: "100%",
    marginBottom: "18px",
  },
  label: {
    color: "#aaa",
    fontSize: "12px",
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
    borderRadius: "10px",
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
  },
  backText: {
    color: "#888",
    fontSize: "14px",
    marginTop: "20px",
  },
  link: {
    color: "#DFFF00",
    textDecoration: "none",
    fontWeight: 500,
  },
};

export default ResetPassword;
