import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return false;
    }
    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validate()) return;
    setLoading(true);
    try {
              const res = await fetch("https://finance-backend-g8ab.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      login(data.user, data.token);
      setSuccess("Signup successful! Redirecting...");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-bg">
      <div className="auth-split-left">
        <div className="auth-welcome">
          <h1>Join us!</h1>
          <p>Create an account to start tracking your expenses.</p>
        </div>
      </div>
      <div className="auth-split-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
          <div className="auth-input-group">
            <span className="auth-input-icon">
              <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>
            </span>
            <input
              type="text"
              id="signup-name"
              name="name"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              disabled={loading}
              autoComplete="name"
            />
          </div>
          <div className="auth-input-group">
            <span className="auth-input-icon">
              <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            <input
              type="email"
              id="signup-email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>
          <div className="auth-input-group">
            <span className="auth-input-icon">
              <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              id="signup-password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="new-password"
            />
            <button type="button" className="auth-show-btn" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}
          <div className="auth-bottom-text">
            Already have an account? <a href="/login">Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup; 