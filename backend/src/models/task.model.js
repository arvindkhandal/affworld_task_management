const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Task name is required"]
  },
  description: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Done"],
    default: "Pending"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true })

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;