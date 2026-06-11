const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  trainer: { type: String, required: true },
  duration: { type: String, required: true },
  enrolled: [{ type: String }]
});

module.exports = mongoose.model("Course", CourseSchema);