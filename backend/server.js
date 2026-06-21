const express = require("express");
const mongoose = require("mongoose");
const dns = require("dns");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Course = require("./models/Course");
const Assignment = require("./models/Assignment");
const Job = require("./models/Job");
const User = require("./models/User");

const app = express();
app.use(express.json());
app.use(cors({
  origin: "https://capstone-mern-project-frontend.onrender.com", // 🔌 Paste your actual live Render frontend link here
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

function normalizeMongoUri(uri) {
  if (!uri) return uri;
  try {
    const useSrv = uri.startsWith("mongodb+srv://");
    const [prefix, rest] = uri.split("//");
    const [authorityAndPath, query] = rest.split("?");
    const [authority, path = ""] = authorityAndPath.split("/");
    const dbPath = path || "capstone";
    let normalized = `${prefix}//${authority}/${dbPath}`;
    if (query) normalized += `?${query}`;
    if (!normalized.includes("retryWrites=")) {
      normalized += normalized.includes("?") ? "&retryWrites=true" : "?retryWrites=true";
    }
    if (!normalized.includes("w=majority")) {
      normalized += normalized.includes("?") ? "&w=majority" : "?w=majority";
    }
    return normalized;
  } catch {
    return uri;
  }
}

const MONGO_URI = normalizeMongoUri(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/capstone");
const mongooseOptions = {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  family: 4,
  tls: MONGO_URI.startsWith("mongodb+srv://"),
};
let dbConnected = false;

async function initializeDatabase() {
  try {
    if (MONGO_URI.startsWith("mongodb+srv://")) {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
    }
    await mongoose.connect(MONGO_URI, mongooseOptions);
    dbConnected = true;
    console.log("🍃 MongoDB Database Connected & Signed with JWT Environment!");
  } catch (err) {
    console.error("Database initialization error:", err);
    if (MONGO_URI.startsWith("mongodb+srv://")) {
      console.error(
        "Atlas connection failed. Verify your MongoDB Atlas IP access list and cluster status. " +
        "For testing, allow your IP or use 0.0.0.0/0 temporarily, and confirm credentials/database name in .env."
      );
    }
    console.warn("Continuing startup without database connection. Some API routes may fail until the database is available.");
  }
}

// --- ACCOUNT REGISTER ROUTE ---
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });
    const newUser = new User({ name, email, password, role });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- SECURED LOGIN PORTAL ROUTE (JWT Output) ---
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const account = await User.findOne({ email, password, role });
    if (!account) return res.status(401).json({ error: "Invalid credentials matching profile data" });
    
    // Sign secure token payload
    const token = jwt.sign(
      { id: account._id, role: account.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: account._id,
        name: account.name,
        email: account.email,
        role: account.role
      }
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- CLASSROOM COURSES ROUTE STREAMS ---
app.get("/api/courses", async (req, res) => { res.json(await Course.find()); });
app.post("/api/courses", async (req, res) => {
  const newCourse = new Course(req.body);
  await newCourse.save();
  res.status(201).json(newCourse);
});
app.post("/api/courses/:id/enroll", async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course.enrolled.includes(req.body.studentName)) {
    course.enrolled.push(req.body.studentName);
    await course.save();
  }
  res.json(course);
});

// --- CLASSWORK ASSIGNMENTS DATA CHANNELS ---
app.get("/api/assignments", async (req, res) => { res.json(await Assignment.find()); });
app.post("/api/assignments", async (req, res) => {
  const newAsg = new Assignment(req.body);
  await newAsg.save();
  res.status(201).json(newAsg);
});
app.post("/api/assignments/:id/submit", async (req, res) => {
  const asg = await Assignment.findById(req.params.id);
  asg.submissions.push({ student: req.body.studentName, link: req.body.link });
  await asg.save();
  res.json(asg);
});
app.post("/api/assignments/:id/grade", async (req, res) => {
  const asg = await Assignment.findById(req.params.id);
  const sub = asg.submissions.find(s => s.student === req.body.studentName);
  if (sub) sub.grade = req.body.grade;
  await asg.save();
  res.json(asg);
});

// --- CAREER RECRUITMENT DRIVES PORTAL LINKS ---
app.get("/api/jobs", async (req, res) => { res.json(await Job.find()); });
app.post("/api/jobs", async (req, res) => {
  const newJob = new Job(req.body);
  await newJob.save();
  res.status(201).json(newJob);
});
app.post("/api/jobs/:id/apply", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const { studentName, email, phone, portfolio, resume } = req.body;
    if (job.applicants.some(a => a.name === studentName || (email && a.email === email))) {
      return res.status(400).json({ error: "Applicant already registered for this position" });
    }

    job.applicants.push({
      name: studentName,
      email,
      phone,
      portfolio,
      resume,
      status: "Applied (Pending Review)"
    });
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/jobs/:id/status", async (req, res) => {
  const job = await Job.findById(req.params.id);
  const applicant = job.applicants.find(a => a.name === req.body.studentName);
  if (applicant) applicant.status = req.body.status;
  await job.save();
  res.json(job);
});

const PORT = process.env.PORT || 5000;
initializeDatabase().finally(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Master Backend Engine active running on Port ${PORT}`);
    if (!dbConnected) {
      console.warn("⚠️ MongoDB is not connected. Database routes will fail until the connection is restored.");
    }
  });
});
