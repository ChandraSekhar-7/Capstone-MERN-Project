import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function CourseManagement({ courses, onCreateCourse, onEnrollCourse }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [enrollCourse, setEnrollCourse] = useState(null);
  const [enrollData, setEnrollData] = useState({ name: "", email: "", phone: "", studentId: "" });

  const handleCreateCourse = (e) => {
    e.preventDefault();
    onCreateCourse({
      title,
      trainer: user.name,
      duration,
      level: "Advanced",
      category: "Full-Stack Development",
      description: "Build real-world applications using the MERN stack with live project coaching.",
      modules: 12,
      outcomes: ["Build full-stack systems", "Deploy cloud-ready apps", "Integrate secure APIs"]
    });
    setTitle(""); setDuration("");
    alert("Course catalog added to remote MongoDB Cluster!");
  };

  const handleViewSyllabus = (course) => {
    alert(`Course: ${course.title}\nLevel: ${course.level || "Intermediate"}\nCategory: ${course.category || "Development"}\nModules: ${course.modules || "N/A"}\n\nDescription:\n${course.description || "A practical course designed to build real-world skills."}`);
  };

  const totalEnrolled = courses.reduce((sum, course) => sum + (course.enrolled?.length || 0), 0);
  const activeCourses = courses.length;
  const featuredTrainer = courses[0]?.trainer || "Expert Mentor";

  return (
    <div>
      <h2>📚 Classroom Course Directory</h2>

      <div className="card-container" style={{ marginBottom: "1.5rem" }}>
        <h3>Training Snapshot</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
          <div style={{ padding: "1rem", background: "#eef2ff", borderRadius: "12px" }}>
            <strong>Active Courses</strong>
            <p style={{ margin: 0, fontSize: "1.5rem", color: "var(--primary)" }}>{activeCourses}</p>
          </div>
          <div style={{ padding: "1rem", background: "#f0fdf4", borderRadius: "12px" }}>
            <strong>Total Students Enrolled</strong>
            <p style={{ margin: 0, fontSize: "1.5rem", color: "#16a34a" }}>{totalEnrolled}</p>
          </div>
          <div style={{ padding: "1rem", background: "#fff7ed", borderRadius: "12px" }}>
            <strong>Featured Mentor</strong>
            <p style={{ margin: 0, fontSize: "1.1rem", color: "#c2410c" }}>{featuredTrainer}</p>
          </div>
        </div>
      </div>

      {(user.role === "Trainer" || user.role === "Admin") && (
        <div className="card-container">
          <h3>➕ Add New Course Route (Staff Panel)</h3>
          <form onSubmit={handleCreateCourse} className="inline-form">
            <input type="text" placeholder="Course Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input type="text" placeholder="Duration (e.g. 6 Weeks)" value={duration} onChange={(e) => setDuration(e.target.value)} required />
            <button type="submit" className="btn-primary">Publish Course</button>
          </form>
        </div>
      )}

      <div className="data-grid">
        {courses.map(course => {
          const isEnrolled = course.enrolled?.includes(user.name);
          return (
            <div key={course._id} className="item-card">
              <h3>{course.title}</h3>
              <p>👨‍🏫 Mentor: <strong>{course.trainer}</strong></p>
              <p>⏳ Timeline: {course.duration}</p>
              <p>🧠 Level: {course.level || "Intermediate"}</p>
              <p>📁 Category: {course.category || "Development"}</p>
              <p style={{ marginTop: "0.75rem", color: "var(--text-muted)" }}>{course.description || "A practical course designed to build real-world skills."}</p>
              <p>🔢 Modules: {course.modules || 0}</p>
              <p>🎯 Outcomes: {course.outcomes ? course.outcomes.join(", ") : "Project-ready skills"}</p>
              <p>👥 Total Enrollments: {course.enrolled?.length || 0}</p>

              <button className="btn-move" style={{ width: "100%", marginBottom: "0.75rem" }} onClick={() => handleViewSyllabus(course)}>
                View Syllabus
              </button>

              {user.role === "Student" && (
                <>
                  <button 
                    className="btn-primary" 
                    disabled={isEnrolled} 
                    onClick={() => { setEnrollCourse(course); setEnrollData({ name: user.name || "", email: user.email || "", phone: "", studentId: "" }); }}
                    style={{ backgroundColor: isEnrolled ? "#d1fae5" : "", color: isEnrolled ? "#059669" : "" }}
                  >
                    {isEnrolled ? "✓ Enrolled & Active" : "Enroll in Course"}
                  </button>

                  {enrollCourse && enrollCourse._id === course._id && (
                    <div className="enroll-modal-backdrop" onClick={() => setEnrollCourse(null)}>
                      <div className="enroll-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Enroll in {course.title}</h3>
                        <form className="enroll-form" onSubmit={(e) => { e.preventDefault(); if (!enrollData.name || !enrollData.email) { alert("Please enter name and email."); return; } onEnrollCourse(course._id, { studentName: enrollData.name, email: enrollData.email, phone: enrollData.phone, studentId: enrollData.studentId, notes: enrollData.notes }); setEnrollCourse(null); setEnrollData({ name: "", email: "", phone: "", studentId: "" }); }}>
                          <input placeholder="Full name" value={enrollData.name} onChange={(e) => setEnrollData(prev => ({ ...prev, name: e.target.value }))} />
                          <input placeholder="Email" value={enrollData.email} onChange={(e) => setEnrollData(prev => ({ ...prev, email: e.target.value }))} />
                          <input placeholder="Phone" value={enrollData.phone} onChange={(e) => setEnrollData(prev => ({ ...prev, phone: e.target.value }))} />
                          <input placeholder="Student ID / Reg" value={enrollData.studentId} onChange={(e) => setEnrollData(prev => ({ ...prev, studentId: e.target.value }))} />
                          <textarea placeholder="Notes (optional)" value={enrollData.notes || ""} onChange={(e) => setEnrollData(prev => ({ ...prev, notes: e.target.value }))} />
                          <div className="enroll-actions">
                            <button type="button" className="enroll-cancel" onClick={() => { setEnrollCourse(null); setEnrollData({ name: "", email: "", phone: "", studentId: "" }); }}>Cancel</button>
                            <button type="submit" className="btn-primary">Submit Enrollment</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}