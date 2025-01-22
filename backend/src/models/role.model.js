const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  permissions: [
    {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  ],
});

module.exports = mongoose.model("Role", roleSchema);
