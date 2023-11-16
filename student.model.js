const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    student_id: { type: String, required: true },
    score:{ type: Array, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
