import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function JobPortal({ jobs, onPostJob, onApplyJob, onUpdateStatus }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [salary, setSalary] = useState("");

  const handlePost = (e) => {
    e.preventDefault();
    onPostJob({
      title,
      company,
      package: salary,
      location: "Remote / Hybrid",
      experience: "Fresher / 1-2 yrs",
      type: "Full-time",
      benefits: ["Health insurance", "Certification support", "Mentorship"]
    });
    setTitle(""); setCompany(""); setSalary("");
    alert("Drive active on database endpoints!");
  };

  const handleRequestInterview = (job) => {
    alert(`Interview requested for ${job.title} at ${job.company}. The recruiter will contact you soon.`);
  };

  const totalJobs = jobs.length;
  const appliedCount = jobs.filter(job => job.applicants?.some(a => a.name === user.name)).length;
  const topCompany = jobs[0]?.company || "TalentX";

  return (
    <div>
      <h2>💼 Placement Desk & Jobs Matrix</h2>
      <div className="card-container" style={{ marginBottom: "1.5rem" }}>
        <h3>Placement Insights</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
          <div style={{ padding: "1rem", background: "#ecfeff", borderRadius: "12px" }}>
            <strong>Open Positions</strong>
            <p style={{ margin: 0, fontSize: "1.5rem", color: "#0f766e" }}>{totalJobs}</p>
          </div>
          <div style={{ padding: "1rem", background: "#f5f3ff", borderRadius: "12px" }}>
            <strong>My Applications</strong>
            <p style={{ margin: 0, fontSize: "1.5rem", color: "#5b21b6" }}>{appliedCount}</p>
          </div>
          <div style={{ padding: "1rem", background: "#fef3c7", borderRadius: "12px" }}>
            <strong>Top Hiring Partner</strong>
            <p style={{ margin: 0, fontSize: "1.1rem", color: "#92400e" }}>{topCompany}</p>
          </div>
        </div>
      </div>

      {user.role === "Admin" && (
        <div className="card-container">
          <h3>Post Recruitment Metric (Control Panel)</h3>
          <form onSubmit={handlePost} className="inline-form">
            <input type="text" placeholder="Job Profile Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input type="text" placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} required />
            <input type="text" placeholder="Salary Package (e.g. 5 LPA)" value={salary} onChange={(e) => setSalary(e.target.value)} required />
            <button type="submit" className="btn-primary">Post Placement</button>
          </form>
        </div>
      )}

      <div className="data-grid">
        {jobs.map(job => {
          const hasApplied = job.applicants?.some(a => a.name === user.name);
          return (
            <div key={job._id} className="item-card">
              <h3>{job.title}</h3>
              <h4>🏢 {job.company}</h4>
              <p>📍 Location: {job.location || "Remote / Hybrid"}</p>
              <p>💼 Experience: {job.experience || "Fresher / 1-2 yrs"}</p>
              <p>🕒 Type: {job.type || "Full-time"}</p>
              <p>Compensation Index: <strong>{job.package}</strong></p>
              <p style={{ marginTop: "0.75rem", color: "var(--text-muted)" }}>Benefits: {(job.benefits || ["Flexible hours", "Career support"]).join(" • ")}</p>

              {user.role === "Student" && (
                <>
                  <button className="btn-primary" style={{ width: "100%", marginTop: "1rem" }} onClick={() => navigate(`/dashboard/job/${job._id}`)}>
                    {hasApplied ? "View Application" : "Apply for Opening"}
                  </button>
                  {hasApplied && (
                    <button className="btn-move" style={{ width: "100%", marginTop: "0.75rem" }} onClick={() => handleRequestInterview(job)}>
                      Request Interview
                    </button>
                  )}
                </>
              )}

              <div style={{ marginTop: "1rem", borderTop: "1px solid var(--border)", paddingTop: "0.5rem" }}>
                <h5>Applicant Monitoring Stream</h5>
                {job.applicants?.map((app, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", alignItems: "center" }}>
                    <span>👤 {app.name}</span>
                    <strong style={{ color: "var(--primary)" }}>{app.status}</strong>
                    {user.role === "Admin" && (
                      <button className="btn-move" style={{ width: "auto", fontSize: "0.75rem", padding: "0.2rem" }} onClick={() => {
                        const status = prompt("Update Status ('Shortlisted' / 'Rejected'):" );
                        if (status) onUpdateStatus(job._id, app.name, status);
                      }}>
                        Status Action
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}