const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  photo: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
