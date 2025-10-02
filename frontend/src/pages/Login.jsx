import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
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
    console.log("Login attempt with:", { email, password: password ? "***" : "empty" });
    setError("");
    setSuccess("");
    if (!validate()) return;
    setLoading(true);
    try {
      console.log("Sending request to backend...");
              const res = await fetch("https://finance-backend-g8ab.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);
      if (!res.ok) throw new Error(data.message || "Login failed");
      login(data.user, data.token);
      setSuccess("Login successful! Redirecting...");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-bg">
      <div className="auth-split-left">
        <div className="auth-welcome">
          <h1>Welcome back!</h1>
          <p>You can sign in to access with your existing account.</p>
        </div>
        {/* SVG/abstract shapes can be added here for more style */}
      </div>
      <div className="auth-split-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Sign In</h2>
          <div className="auth-input-group">
            <span className="auth-input-icon">
              <svg width="20" height="20" fill="none" stroke="#aaa" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            <input
              type="email"
              id="login-email"
              name="email"
              placeholder="Username or email"
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
              id="login-password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
            />
            <button type="button" className="auth-show-btn" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {/* <div className="auth-form-row">
            <label className="auth-remember">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /> Remember me
            </label>
            <span className="auth-forgot" onClick={() => alert('Forgot password coming soon!')}>Forgot password?</span>
          </div> */}
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}
          <div className="auth-bottom-text">
            New here? <a href="/signup">Create an Account</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 