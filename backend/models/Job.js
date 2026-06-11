const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  package: { type: String, required: true },
  applicants: [
    {
      name: String,
      email: String,
      phone: String,
      portfolio: String,
      resume: String,
      status: { type: String, default: "Applied (Pending Review)" }
    }
  ]
});

module.exports = mongoose.model("Job", JobSchema);