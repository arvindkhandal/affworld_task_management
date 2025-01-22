const Post = require("../models/post.model");
const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");
const { uploadOnCloudinary } = require("../utils/cloudinary");

// Create a new post
const createPost = asyncHandler(async (req, res) => {
  const { caption } = req.body;
  const { id: userId } = req.params;
  const photoBuffer = req.file?.buffer;

  if (!photoBuffer) {
    throw new ApiError(400, "Photo is required.");
  }

  const uploadedPhoto = await uploadOnCloudinary(photoBuffer);

  if (!(uploadedPhoto || uploadedPhoto.url)) {
    throw new ApiError(500, "Failed to upload photo on cloudinary.");
  }

  const post = await Post.create({
    photo: uploadedPhoto.url,
    caption,
    user: { _id: userId }
  });

  if (!post) {
    throw new ApiError(500, "Failed to create post");
  }
  res.status(201).json({ success: true, message: "Post created successfully.", post });
});

// Get All Posts
const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate("user", "fullName userName").sort({ createdAt: -1 });
  res.status(200).json({ success: true, posts });
});

// Get Post by ID
const getPostById = asyncHandler(async (req, res) => {
  const { id: postId } = req.params;
  const post = await Post.findById({ _id: postId }).populate("user", "fullName userName");

  if (!post) {
    throw new ApiError(404, "Post not found.")
  }
  res.status(200).json({ success: true, post });
});

// Update a post
const updatePost = asyncHandler(async (req, res) => {
  const { caption } = req.body;
  const { id: postId } = req.params;
  const post = await Post.findById({ _id: postId });

  if (!post) {
    throw new ApiError(404, "Post not found.");
  }

  if (req.user._id.toString() !== post.user.toString()) {
    throw new ApiError(403, "Unauthorized to update this post")
  }

  if (req.file) {
    const uploadedPhoto = await uploadOnCloudinary(req.file.buffer);
    if (uploadedPhoto && uploadedPhoto.url) {
      post.photo = uploadedPhoto.url;
    }
  }

  post.caption = caption || post.caption;
  await post.save();

  res.status(200).json({ success: true, message: "Post updated successfully.", post });
});

// Delete a post
const deletePost = asyncHandler(async (req, res) => {
  const { id: postId } = req.params;
  const post = await Post.findById({ _id: postId });

  if (!post) {
    throw new ApiError(404, "Post not found.")
  }

  if (req.user._id.toString() !== post.user.toString()) {
    throw new ApiError(403, "Unauthorized to delete this post.");
  }

  await post.delete();

  res.status(200).json({ success: true, message: "Post deleted successfully." });
});

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
}

