import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("Student");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, role);
  };

  return (
    <div className="auth-container">
      <div className="auth-card card-container">
        <h2>🔑 Login Portal</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>Select Workspace Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Student">Student Portal</option>
            <option value="Trainer">Trainer Portal</option>
            <option value="Admin">Admin Control Center</option>
          </select>

          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" className="password-toggle" onClick={() => setShowPassword((current) => !current)}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button type="submit" className="btn-primary">Sign In</button>
        </form>
        <p style={{ marginTop: "1.5rem", textAlign: "center" }}>
          New account request? <Link to="/register">Register Here</Link>
        </p>
      </div>
    </div>
  );
}