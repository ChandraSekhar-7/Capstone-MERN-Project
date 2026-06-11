import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="welcome-text">
        <h3>Welcome back, {user?.name || "User"}!</h3>
        <p>Smart Student Learning & Placement System</p>
      </div>
      <div className="user-profile">
        <div className="avatar">{user?.name?.charAt(0)}</div>
        <button onClick={logout} className="btn-logout">Logout</button>
      </div>
    </header>
  );
}