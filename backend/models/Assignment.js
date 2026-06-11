const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: String, required: true },
  deadline: { type: String, required: true },
  submissions: [
    {
      student: String,
      link: String,
      grade: { type: String, default: "Pending Evaluation" }
    }
  ]
});

module.exports = mongoose.model("Assignment", AssignmentSchema);