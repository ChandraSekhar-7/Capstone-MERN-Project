import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function JobDetails({ jobs, onApplyJob }) {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const job = jobs.find((item) => item._id === id);
  const [form, setForm] = useState({
    studentName: user?.name || "",
    email: user?.email || "",
    phone: "",
    portfolio: "",
    resume: ""
  });
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (job && user) {
      setHasApplied(job.applicants?.some((app) => app.name === user.name || app.email === user.email));
    }
  }, [job, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in before applying.");
      return;
    }

    if (hasApplied) {
      alert("You have already applied for this job.");
      return;
    }

    onApplyJob(job._id, form);
    alert("Your job application has been submitted.");
    navigate("/dashboard");
  };

  if (!job) {
    return (
      <div className="card-container">
        <h3>Job not found</h3>
        <p>The requested job listing is unavailable.</p>
        <button className="btn-move" onClick={() => navigate("/dashboard")}>Back to Jobs</button>
      </div>
    );
  }

  return (
    <div>
      <div className="card-container" style={{ marginBottom: "1.5rem" }}>
        <h2>📄 Apply to {job.title}</h2>
        <p><strong>Company:</strong> {job.company}</p>
        <p><strong>Location:</strong> {job.location || "Remote / Hybrid"}</p>
        <p><strong>Experience:</strong> {job.experience}</p>
        <p><strong>Type:</strong> {job.type}</p>
        <p><strong>Compensation:</strong> {job.package}</p>
        <p><strong>Benefits:</strong> {(job.benefits || []).join(" • ")}</p>
      </div>

      <div className="card-container">
        <h3>{hasApplied ? "Application Already Submitted" : "Submit Your Application"}</h3>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Full Name"
            value={form.studentName}
            onChange={(e) => setForm((prev) => ({ ...prev, studentName: e.target.value }))}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Portfolio / LinkedIn"
            value={form.portfolio}
            onChange={(e) => setForm((prev) => ({ ...prev, portfolio: e.target.value }))}
          />
          <textarea
            placeholder="Resume summary or link"
            value={form.resume}
            onChange={(e) => setForm((prev) => ({ ...prev, resume: e.target.value }))}
          />
          <div className="auth-actions" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button type="button" className="btn-move" onClick={() => navigate("/dashboard")}>Back to Job Listings</button>
            <button type="submit" className="btn-primary" disabled={hasApplied}>{hasApplied ? "Already Applied" : "Submit Application"}</button>
          </div>
        </form>
      </div>

      {job.applicants?.length > 0 && (
        <div className="card-container">
          <h3>Applicant Summary</h3>
          {job.applicants.map((app, index) => (
            <div key={index} style={{ borderTop: index > 0 ? "1px solid var(--border)" : "none", paddingTop: index > 0 ? "0.75rem" : 0 }}>
              <p><strong>{app.name}</strong> — {app.status}</p>
              {app.email && <p>Email: {app.email}</p>}
              {app.phone && <p>Phone: {app.phone}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
