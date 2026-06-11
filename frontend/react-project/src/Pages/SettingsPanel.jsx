import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function SettingsPanel() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.name || "CHANDRA");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [timezone, setTimezone] = useState("UTC");
  const [language, setLanguage] = useState("en-US");
  const [dataSharing, setDataSharing] = useState(false);
  const [emailVerified, setEmailVerified] = useState(true);
  const [notificationFrequency, setNotificationFrequency] = useState("Immediate");
  const [fontSize, setFontSize] = useState("medium");
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    setTimeout(() => {
      setIsSaving(false);
      setMessage("✅ Workspace configuration updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    }, 1200);
  };

  const handleResetSettings = () => {
    setDisplayName(user?.name || "CHANDRA");
    setNotifications(true);
    setDarkMode(false);
    setDailyDigest(true);
    setTwoFAEnabled(false);
    setTimezone("UTC");
    setLanguage("en-US");
    setMessage("Preferences restored to default values.");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleChangePassword = () => {
    const oldPass = prompt("Enter current password:");
    if (!oldPass) return;
    const newPass = prompt("Enter new password:");
    if (!newPass) return;
    setIsSaving(true);
    setMessage("");
    setTimeout(() => {
      setIsSaving(false);
      setMessage("✅ Password updated successfully.");
      setTimeout(() => setMessage(""), 3000);
    }, 1000);
  };

  const handleToggle2FA = () => {
    if (!twoFAEnabled) {
      const phone = prompt("Enter phone number to enable 2FA (e.g. +1234567890):");
      if (!phone) return;
      setTwoFAEnabled(true);
      setMessage("✅ Two-factor authentication enabled.");
      setTimeout(() => setMessage(""), 3000);
    } else {
      if (!confirm("Disable two-factor authentication?")) return;
      setTwoFAEnabled(false);
      setMessage("Two-factor authentication disabled.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleExportSettings = () => {
    const data = {
      displayName,
      notifications,
      darkMode,
      dailyDigest,
      twoFAEnabled,
      timezone,
      language
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "settings-export.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setMessage("Settings exported to settings-export.json");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleContactSupport = () => {
    const body = encodeURIComponent(`User: ${user?.email || 'unknown'}\nDescribe your issue:`);
    window.location.href = `mailto:support@eduportal.com?subject=Support%20Request&body=${body}`;
  };

  const handleToggleDataSharing = () => {
    setDataSharing(prev => !prev);
    setMessage(dataSharing ? "Data sharing disabled." : "Data sharing enabled for analytics.");
    setTimeout(() => setMessage(""), 2500);
  };

  const handleDeleteAccount = () => {
    if (!confirm("This will permanently delete your account. Continue?")) return;
    setMessage("Account deletion requested — simulated.");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleResendVerification = () => {
    setEmailVerified(false);
    setMessage("Verification email sent (simulated). Please check your inbox.");
    setTimeout(() => setMessage(""), 3000);
    setEmailVerified(true);
  };

  const handleToggleAutoUpdate = () => {
    setAutoUpdate(prev => !prev);
    setMessage(autoUpdate ? "Auto-update disabled." : "Auto-update enabled.");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="settings-wrapper">
      <h2>⚙️ System Workspace Settings</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
        Configure your profile metadata parameters and workspace automation options.
      </p>

      <div className="card-container" style={{ marginBottom: "1.5rem" }}>
        <h3>Account Overview</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
          <div style={{ padding: "1rem", background: "#eef2ff", borderRadius: "12px" }}>
            <strong>Workspace Role</strong>
            <p style={{ margin: 0, fontSize: "1.2rem", color: "var(--primary)" }}>{user?.role || "Student"}</p>
          </div>
          <div style={{ padding: "1rem", background: "#f0fdf4", borderRadius: "12px" }}>
            <strong>Account Tier</strong>
            <p style={{ margin: 0, fontSize: "1.2rem", color: "#16a34a" }}>Professional</p>
          </div>
          <div style={{ padding: "1rem", background: "#fef3c7", borderRadius: "12px" }}>
            <strong>Security Status</strong>
            <p style={{ margin: 0, fontSize: "1.2rem", color: "#c2410c" }}>Verified</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="settings-form-layout">
        <div className="card-container">
          <h3>Profile Metadata</h3>
          <div className="auth-form" style={{ marginTop: "0.5rem" }}>
            <label>Display Name</label>
            <input 
              type="text" 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)} 
              required 
            />
            <label>Registered Email Address</label>
            <input type="email" value={user?.email || "student@college.edu"} disabled style={{ background: "#f1f5f9", cursor: "not-allowed" }} />
          </div>
        </div>

        <div className="card-container">
          <h3>System Preferences</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Enable Push Email Notifications</span>
              <input 
                type="checkbox" 
                checked={notifications} 
                onChange={(e) => setNotifications(e.target.checked)} 
                style={{ width: "20px", height: "20px", cursor: "pointer" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
              <span>Enable Dark Appearance Mode (Beta)</span>
              <input 
                type="checkbox" 
                checked={darkMode} 
                onChange={(e) => setDarkMode(e.target.checked)} 
                style={{ width: "20px", height: "20px", cursor: "pointer" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
              <span>Daily Digest Email</span>
              <input 
                type="checkbox" 
                checked={dailyDigest} 
                onChange={(e) => setDailyDigest(e.target.checked)} 
                style={{ width: "20px", height: "20px", cursor: "pointer" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
              <span>Two-Factor Authentication</span>
              <button type="button" className="btn-move" onClick={handleToggle2FA} style={{ padding: "0.4rem 0.6rem" }}>
                {twoFAEnabled ? "Disable 2FA" : "Enable 2FA"}
              </button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
              <span>Timezone</span>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} style={{ padding: "0.25rem" }}>
                <option value="UTC">UTC</option>
                <option value="Asia/Kolkata">Asia/Kolkata</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
              <span>Language</span>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: "0.25rem" }}>
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="hi-IN">Hindi</option>
                <option value="es-ES">Spanish</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <button type="submit" className="btn-primary" disabled={isSaving}>
            {isSaving ? "⏳ Synchronizing..." : "Save Workspace Changes"}
          </button>
          <button type="button" className="btn-move" onClick={handleResetSettings} style={{ marginTop: "0.25rem" }}>
            Reset to Default
          </button>
          <button type="button" className="btn-move" onClick={handleChangePassword} style={{ marginTop: "0.25rem" }}>
            Change Password
          </button>
          <button type="button" className="btn-move" onClick={handleExportSettings} style={{ marginTop: "0.25rem" }}>
            Export Settings
          </button>
          <button type="button" className="btn-move" onClick={handleContactSupport} style={{ marginTop: "0.25rem" }}>
            Contact Support
          </button>
          {message && <strong style={{ color: "#10b981" }}>{message}</strong>}
        </div>
      </form>

      <div className="card-container" style={{ marginTop: "1.5rem" }}>
        <h3>Security & Support</h3>
        <p style={{ margin: "0.5rem 0" }}>Password status: <strong>Active</strong></p>
        <p style={{ margin: "0.5rem 0" }}>Two-factor authentication: <strong>Available</strong></p>
        <p style={{ margin: "0.5rem 0" }}>Support email: <strong>support@eduportal.com</strong></p>
      </div>
      <div className="card-container" style={{ marginTop: "1rem" }}>
        <h3>Privacy & Account</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Share anonymized usage data</span>
            <button className="btn-move" onClick={handleToggleDataSharing}>{dataSharing ? "Disable" : "Enable"}</button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Email verified</span>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <strong style={{ color: emailVerified ? "#10b981" : "#d97706" }}>{emailVerified ? "Yes" : "No"}</strong>
              <button className="btn-move" onClick={handleResendVerification}>Resend Verification</button>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Delete account</span>
            <button className="btn-danger" onClick={handleDeleteAccount}>Delete</button>
          </div>
        </div>
      </div>

      <div className="card-container" style={{ marginTop: "1rem" }}>
        <h3>Notifications & Accessibility</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: "0.75rem", alignItems: "center" }}>
          <div>Notification frequency</div>
          <select value={notificationFrequency} onChange={(e) => setNotificationFrequency(e.target.value)}>
            <option>Immediate</option>
            <option>Hourly</option>
            <option>Daily</option>
            <option>Weekly</option>
          </select>

          <div>Interface font size</div>
          <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>

          <div>Auto-update app</div>
          <button className="btn-move" onClick={handleToggleAutoUpdate}>{autoUpdate ? "Disable" : "Enable"}</button>
        </div>
      </div>
    </div>
  );
}