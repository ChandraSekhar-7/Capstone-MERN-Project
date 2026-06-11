import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="brand">
        <h2>🎓 EduPortal</h2>
        <span className="role-tag">{user?.role} Mode</span>
      </div>
      <ul className="nav-links">
        <li className={activeTab === "courses" ? "active" : ""} onClick={() => setActiveTab("courses")}>
          📚 Course Training
        </li>
        <li className={activeTab === "assignments" ? "active" : ""} onClick={() => setActiveTab("assignments")}>
          📝 Assignments
        </li>
        <li className={activeTab === "jobs" ? "active" : ""} onClick={() => setActiveTab("jobs")}>
          💼 Placement Portal
        </li>
        {/* ⚙️ New Settings navigation entry node */}
        <li className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>
          ⚙️ Workspace Settings
        </li>
      </ul>
    </aside>
  );
}