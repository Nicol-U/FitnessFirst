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

        {/* divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>OR</span>
          <div style={styles.dividerLine} />
        </div>

        {/*with Google (button)*/}
        <button style={styles.socialButton} onClick={() => {}}>
          <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: "10px" }}>
            <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 0 12c0 1.94.46 3.77 1.28 5.39l3.56-2.77z" />
            <path fill="#fff" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.07l3.66 2.84c.87-2.6 3.3-4.16 6.16-4.16z" />
          </svg>
          LOGIN WITH GOOGLE
        </button>

        {/*with Apple (button)*/}
        <button style={{ ...styles.socialButton, marginTop: "10px" }} onClick={() => {}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" style={{ marginRight: "10px" }}>
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          LOGIN WITH APPLE
        </button>

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