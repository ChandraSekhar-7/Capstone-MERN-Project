import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// --- Page Workspaces ---
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import CourseManagement from "./Pages/CourseManagement";
import AssignmentSystem from "./Pages/AssignmentSystem";
import JobPortal from "./Pages/JobPortal";
import JobDetails from "./Pages/JobDetails";
import SettingsPanel from "./Pages/SettingsPanel";

// --- Shared Framework Components ---
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

export default function App() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("courses");
  
  // MERN Database Collection States
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [jobs, setJobs] = useState([]);

  // --- Real-time MongoDB Synchronization Stream ---
  useEffect(() => {
    if (user) {
      fetch("http://localhost:5000/api/courses")
        .then(res => res.json())
        .then(data => setCourses(Array.isArray(data) ? data : []))
        .catch(err => console.error("Error connecting to MongoDB courses:", err));

      fetch("http://localhost:5000/api/assignments")
        .then(res => res.json())
        .then(data => setAssignments(Array.isArray(data) ? data : []))
        .catch(err => console.error("Error connecting to MongoDB assignments:", err));

      fetch("http://localhost:5000/api/jobs")
        .then(res => res.json())
        .then(data => setJobs(Array.isArray(data) ? data : []))
        .catch(err => console.error("Error connecting to MongoDB jobs:", err));
    }
  }, [user, activeTab]);

  // --- MongoDB Operations ---
  const handleEnrollCourse = (id, studentData) => {
    if (!user && !studentData) return;
    const payload = studentData ? studentData : { studentName: user.name };
    fetch(`http://localhost:5000/api/courses/${id}/enroll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(updated => setCourses(prev => prev.map(c => c._id === id ? updated : c)))
      .catch(err => console.error("Enrollment pipeline synchronization error:", err));
  };

  const handleCreateCourse = (courseData) => {
    fetch("http://localhost:5000/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(courseData)
    })
      .then(res => res.json())
      .then(newCourse => setCourses(prev => [...prev, newCourse]))
      .catch(err => console.error("Course publishing transmission error:", err));
  };

  const handleCreateAssignment = (asgData) => {
    fetch("http://localhost:5000/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(asgData)
    })
      .then(res => res.json())
      .then(newAsg => setAssignments(prev => [...prev, newAsg]))
      .catch(err => console.error("Assignment deployment transmission error:", err));
  };

  const handleSubmitAssignment = (id, link) => {
    if (!user?.name) return;
    fetch(`http://localhost:5000/api/assignments/${id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentName: user.name, link })
    })
      .then(res => res.json())
      .then(updated => setAssignments(prev => prev.map(a => a._id === id ? updated : a)))
      .catch(err => console.error("Task deliverable upload error:", err));
  };

  const handleGradeAssignment = (id, studentName, grade) => {
    fetch(`http://localhost:5000/api/assignments/${id}/grade`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentName, grade })
    })
      .then(res => res.json())
      .then(updated => setAssignments(prev => prev.map(a => a._id === id ? updated : a)))
      .catch(err => console.error("Marks evaluation transmission error:", err));
  };

  const handlePostJob = (jobData) => {
    fetch("http://localhost:5000/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobData)
    })
      .then(res => res.json())
      .then(newJob => setJobs(prev => [...prev, newJob]))
      .catch(err => console.error("Placement drive data entry error:", err));
  };

  const handleApplyJob = (id, applicantData) => {
    if (!user?.name) return;
    const payload = {
      studentName: applicantData?.studentName || user.name,
      email: applicantData?.email || user.email || "",
      phone: applicantData?.phone || "",
      portfolio: applicantData?.portfolio || "",
      resume: applicantData?.resume || ""
    };

    fetch(`http://localhost:5000/api/jobs/${id}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) return res.json().then(err => { throw new Error(err.error || "Job application failed"); });
        return res.json();
      })
      .then(updated => setJobs(prev => prev.map(j => j._id === id ? updated : j)))
      .catch(err => console.error("Recruitment pipeline registration error:", err));
  };

  const handleUpdateJobStatus = (id, studentName, status) => {
    fetch(`http://localhost:5000/api/jobs/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentName, status })
    })
      .then(res => res.json())
      .then(updated => setJobs(prev => prev.map(j => j._id === id ? updated : j)))
      .catch(err => console.error("Applicant profile status processing error:", err));
  };

  // --- Dynamic Layout Tab Switcher Routing Layer ---
  const safetyCourses = courses && courses.length > 0 ? courses : [
    {
      _id: "demo_c1",
      title: "Full-Stack MERN Development",
      trainer: "Dr. Suresh Sir",
      duration: "12 Weeks",
      level: "Advanced",
      category: "Full-Stack Development",
      description: "Build real-world applications using the MERN stack with guided coaching.",
      modules: 12,
      outcomes: ["Build full-stack systems", "Deploy cloud-ready apps", "Integrate secure APIs"],
      enrolled: ["CHANDRA"]
    },
    {
      _id: "demo_c2",
      title: "Data Structures & Algorithms",
      trainer: "Prof. Karimulla",
      duration: "8 Weeks",
      level: "Intermediate",
      category: "Computer Science",
      description: "Learn algorithm patterns and prepare for technical interviews.",
      modules: 9,
      outcomes: ["Master arrays and trees", "Optimize runtime", "Solve coding challenges"],
      enrolled: []
    },
    {
      _id: "demo_c3",
      title: "Cloud Deployment & DevOps Practices",
      trainer: "Ms. Ananya Rao",
      duration: "6 Weeks",
      level: "Intermediate",
      category: "Cloud & DevOps",
      description: "Containerize, CI/CD, and deploy applications to cloud platforms.",
      modules: 8,
      outcomes: ["Dockerize apps", "Configure CI/CD", "Deploy to cloud"],
      enrolled: []
    }
  ];

  const safetyAssignments = assignments && assignments.length > 0 ? assignments : [
    {
      _id: "demo_a1",
      title: "Build an Express.js REST API with MongoDB",
      course: "Full-Stack MERN Development",
      deadline: "2026-06-25",
      description: "Implement REST endpoints for course, assignment, and job data.",
      rubric: ["Architecture", "Functionality", "Code quality"],
      resources: ["https://docs.mongodb.com", "https://react.dev"],
      submissions: [{ student: "CHANDRA", link: "https://github.com/chandra/mern-api", grade: "A+" }]
    },
    {
      _id: "demo_a2",
      title: "Containerize the MERN App with Docker",
      course: "Cloud Deployment & DevOps Practices",
      deadline: "2026-07-05",
      description: "Create Dockerfiles for backend and frontend and run locally using docker-compose.",
      rubric: ["Containers", "Networking", "Documentation"],
      resources: ["https://docs.docker.com", "https://docs.docker.com/compose/"],
      submissions: []
    },
    {
      _id: "demo_a3",
      title: "Configure CI/CD with GitHub Actions",
      course: "Cloud Deployment & DevOps Practices",
      deadline: "2026-07-12",
      description: "Add a workflow to run tests and deploy on push to main branch.",
      rubric: ["Workflows", "Tests", "Deployment"],
      resources: ["https://docs.github.com/actions"],
      submissions: []
    }
  ];

  const safetyJobs = jobs && jobs.length > 0 ? jobs : [
    {
      _id: "demo_j1",
      title: "Graduate Engineer Trainee (GET)",
      company: "Infosys",
      package: "4.5 LPA",
      location: "Bangalore / Remote",
      experience: "Fresher / 1-2 yrs",
      type: "Full-time",
      benefits: ["Health insurance", "Mentorship", "Certification support"],
      applicants: [{ name: "CHANDRA", status: "Shortlisted" }]
    },
    {
      _id: "demo_j2",
      title: "Frontend Engineer - React",
      company: "TechNova",
      package: "6.0 LPA",
      location: "Remote",
      experience: "0-2 yrs",
      type: "Full-time",
      benefits: ["Remote-first", "Learning budget"],
      applicants: []
    },
    {
      _id: "demo_j3",
      title: "DevOps Engineer (Intern)",
      company: "CloudWorks",
      package: "3.0 LPA",
      location: "Hybrid",
      experience: "Intern / Fresher",
      type: "Internship",
      benefits: ["Stipend", "Mentorship"],
      applicants: []
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "courses":
        return <CourseManagement courses={safetyCourses} onCreateCourse={handleCreateCourse} onEnrollCourse={handleEnrollCourse} />;
      case "assignments":
        return <AssignmentSystem assignments={safetyAssignments} onCreateAsg={handleCreateAssignment} onSubmitAsg={handleSubmitAssignment} onGradeAsg={handleGradeAssignment} />;
      case "jobs":
        return <JobPortal jobs={safetyJobs} onPostJob={handlePostJob} onApplyJob={handleApplyJob} onUpdateStatus={handleUpdateJobStatus} />;
      case "settings":
        return <SettingsPanel />;
      default:
        return <CourseManagement courses={safetyCourses} />;
    }
  };

  return (
    <Routes>
      {/* Public Gateway Channels */}
      <Route path="/" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
      
      {/* Secure Core Dashboard Frame Layout */}
      <Route 
        path="/dashboard" 
        element={
          user ? (
            <div className="app-layout">
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
              <div className="main-wrapper">
                <Navbar />
                <main className="main-content">{renderTabContent()}</main>
              </div>
            </div>
          ) : <Navigate to="/" />
        } 
      />
      <Route
        path="/dashboard/job/:id"
        element={
          user ? (
            <div className="app-layout">
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
              <div className="main-wrapper">
                <Navbar />
                <main className="main-content">
                  <JobDetails jobs={safetyJobs} onApplyJob={handleApplyJob} />
                </main>
              </div>
            </div>
          ) : <Navigate to="/" />
        }
      />
    </Routes>
  );
}