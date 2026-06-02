import React, { useState } from "react";
import { Link } from "react-router-dom";
import GreenButton from "../Components/CustomButton";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) { setError("Please enter your email."); return; }
    setError("");
    try {
      const res = await fetch("http://localhost:3001/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSent(true);
    } catch {
      setError("Could not connect to server.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.logo}>FITNESSFIRST</h1>
        <h2 style={styles.title}>Reset Password</h2>

        {sent ? (
          <>
            <p style={styles.subtitle}>
              Check your email for a reset link. It expires in 1 hour.
            </p>
            <Link to="/login" style={styles.link}>Back to Login</Link>
          </>
        ) : (
          <>
            <p style={styles.subtitle}>
              Enter your account email and we'll send you a reset link.
            </p>

            {error && <p style={styles.error}>{error}</p>}

            <div style={styles.fieldGroup}>
              <label style={styles.label}>EMAIL</label>
              <div style={styles.inputWrapper}>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  style={styles.input}
                />
              </div>
            </div>

            <GreenButton width="100%" onClick={handleSubmit}>
              SEND RESET LINK
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

export default ForgotPassword;
