import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");

  const handleSubmit = (e) => {
    e.preventDefault();
    register(name, email, password, role);
  };

  return (
    <div className="auth-container">
      <div className="auth-card card-container">
        <h2>📝 Registration Desk</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password Security" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <label>Choose Account Matrix Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Student">Student Model</option>
            <option value="Trainer">Trainer Model</option>
            <option value="Admin">System Administrator</option>
          </select>

          <button type="submit" className="btn-primary">Create Account</button>
        </form>
        <p style={{ marginTop: "1.5rem", textAlign: "center" }}>
          Already registered? <Link to="/">Log In</Link>
        </p>
      </div>
    </div>
  );
}