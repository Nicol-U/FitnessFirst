import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GreenButton from "../Components/CustomButton";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Invalid username or password");
        return;
      }
      navigate("/");
    } catch {
      alert("Could not connect to server");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* FitnessFirst */}
        <h1 style={styles.logo}>FITNESSFIRST</h1>

        {/* sub title */}
        <h2 style={styles.title}>Login to the Archive</h2>
        <p style={styles.subtitle}>Enter your credentials to resume your journey.</p>

        {/* username entry thingy */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>USERNAME</label>
          <div style={styles.inputWrapper}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "12px", flexShrink: 0 }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              type="text"
              placeholder="Precision Athlete"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
            />
          </div>
        </div>

        {/* psd entry thingy */}
        <div style={styles.fieldGroup}>
          <div style={styles.labelRow}>
            <label style={styles.label}>PASSWORD</label>
            <Link to="/forgot-password" style={styles.forgot}>FORGOT?</Link>
          </div>
          <div style={styles.inputWrapper}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "12px", flexShrink: 0 }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <div
              onClick={() => setShowPassword((prev) => !prev)}
              style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
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

        {/*login button*/}
        <GreenButton width="100%" onClick={handleLogin}>
          LOGIN TO THE ARCHIVE
        </GreenButton>

        {/* sign up link to create account page */}
        <p style={styles.signUpText}>
          Need an account?{" "}
          <Link to="/createacc" style={styles.signUpLink}>
            Create one here
          </Link>
        </p>
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
  },

  fieldGroup: {
    width: "100%",
    marginBottom: "18px",
  },

  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },

  label: {
    color: "#aaa",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: "1.5px",
    marginBottom: "8px",
    display: "block",
  },

  forgot: {
    color: "#DFFF00",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "1px",
    cursor: "pointer",
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

  divider: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    margin: "22px 0",
  },

  dividerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "#2a2a2a",
  },

  dividerText: {
    color: "#555",
    fontSize: "12px",
    padding: "0 14px",
    letterSpacing: "1px",
  },

  socialButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "14px",
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 500,
    fontFamily: "'Lexend', sans-serif",
    letterSpacing: "1px",
    cursor: "pointer",
    boxSizing: "border-box",
  },

  signUpText: {
    color: "#888",
    fontSize: "14px",
    marginTop: "24px",
  },

  signUpLink: {
    color: "#DFFF00",
    textDecoration: "none",
    fontWeight: 500,
  },
};

export default Login;