import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AssignmentSystem({ assignments, onCreateAsg, onSubmitAsg, onGradeAsg }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [deadline, setDeadline] = useState("");
  const [submissionLinks, setSubmissionLinks] = useState({});

  const handleCreate = (e) => {
    e.preventDefault();
    onCreateAsg({
      title,
      course,
      deadline,
      description: "Complete the exercise using the course stack.",
      rubric: ["Architecture", "Functionality", "Code quality"],
      resources: ["https://docs.mongodb.com", "https://react.dev"]
    });
    setTitle(""); setCourse(""); setDeadline("");
    alert("Assignment broadcasted!");
  };

  const handleLinkChange = (id, value) => {
    setSubmissionLinks(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (id) => {
    const link = submissionLinks[id] || "";
    if (!link) {
      alert("Please provide a link before submitting.");
      return;
    }
    onSubmitAsg(id, link);
    setSubmissionLinks(prev => ({ ...prev, [id]: "" }));
  };

  const handleGradeClick = (asgId, student) => {
    const grade = prompt("Enter Grade Evaluation Rank:");
    if (grade) {
      onGradeAsg(asgId, student, grade);
    }
  };

  const pendingSubmissions = assignments.filter(asg => asg.submissions?.some(sub => sub.grade === "Pending Evaluation")).length;
  const upcomingDue = assignments.reduce((closest, asg) => {
    if (!asg.deadline) return closest;
    const date = new Date(asg.deadline);
    return !closest || date < new Date(closest.deadline) ? asg : closest;
  }, null);

  return (
    <div>
      <h2>📝 Assignment System Grid</h2>
      <div className="card-container" style={{ marginBottom: "1.5rem" }}>
        <h3>Assignment Insights</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
          <div style={{ padding: "1rem", background: "#eff6ff", borderRadius: "12px" }}>
            <strong>Open Assignments</strong>
            <p style={{ margin: 0, fontSize: "1.5rem", color: "var(--primary)" }}>{assignments.length}</p>
          </div>
          <div style={{ padding: "1rem", background: "#fef3c7", borderRadius: "12px" }}>
            <strong>Pending Reviews</strong>
            <p style={{ margin: 0, fontSize: "1.5rem", color: "#dd6b20" }}>{pendingSubmissions}</p>
          </div>
          <div style={{ padding: "1rem", background: "#ecfdf5", borderRadius: "12px" }}>
            <strong>Next Deadline</strong>
            <p style={{ margin: 0, fontSize: "1.1rem", color: "#15803d" }}>{upcomingDue?.deadline || "No deadline"}</p>
          </div>
        </div>
      </div>

      {user.role === "Trainer" && (
        <div className="card-container">
          <h3>Deploy Task Worksheet</h3>
          <form onSubmit={handleCreate} className="inline-form">
            <input type="text" placeholder="Task Objective" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input type="text" placeholder="Course Name" value={course} onChange={(e) => setCourse(e.target.value)} required />
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
            <button type="submit" className="btn-primary">Deploy</button>
          </form>
        </div>
      )}

      <div className="data-grid">
        {assignments.map(asg => (
          <div key={asg._id} className="item-card">
            <h4>{asg.title}</h4>
            <p>Course Matrix: {asg.course}</p>
            <p style={{ color: "red" }}>Due Date: {asg.deadline}</p>
            <p style={{ marginTop: "0.75rem", color: "var(--text-muted)" }}>{asg.description || "Submit a completed project deliverable with code and documentation."}</p>
            <p><strong>Rubric:</strong> {asg.rubric?.join(", ") || "Architecture, Quality, Delivery"}</p>
            <p><strong>Resources:</strong> {asg.resources?.join(" • ") || "Project template, API docs"}</p>

            {user.role === "Student" && (
              <div style={{ marginTop: "1rem" }}>
                <input type="text" placeholder="Paste Deliverable Repository URL" value={submissionLinks[asg._id] || ""} onChange={(e) => handleLinkChange(asg._id, e.target.value)} style={{ width: "100%", padding: "0.5rem" }} />
                <button className="btn-primary" style={{ width: "100%", marginTop: "0.5rem" }} onClick={() => handleSubmit(asg._id)}>Submit Link</button>
              </div>
            )}

            <div style={{ marginTop: "1rem" }}>
              <h5>Submissions Pipeline Tracker ({asg.submissions?.length || 0})</h5>
              {asg.submissions?.map((sub, i) => (
                <div key={i} style={{ background: "#f8fafc", padding: "0.5rem", marginTop: "0.5rem", borderRadius: "6px" }}>
                  <p style={{ margin: 0 }}>👤 {sub.student} - <a href={sub.link} target="_blank" rel="noreferrer">Review</a></p>
                  <p style={{ margin: 0 }}>Grade Evaluation: <strong style={{ color: "var(--primary)" }}>{sub.grade}</strong></p>
                    {user.role === "Trainer" && sub.grade === "Pending Evaluation" && (
                      <button className="btn-move" style={{ fontSize: "0.8rem", padding: "0.2rem", marginTop: "0.25rem" }} onClick={() => handleGradeClick(asg._id, sub.student)}>Evaluate Grade</button>
                    )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}