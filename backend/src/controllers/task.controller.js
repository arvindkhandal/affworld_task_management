const Task = require('../models/task.model');
const { ApiError } = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/asyncHandler');

// Create Task
const createTask = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "Task name is required")
  }

  const task = await Task.create({ name, description });

  if (!task) {
    throw new ApiError(404, "Task not created")
  }
  res.status(201).json(new ApiResponse(201, task, "Task created successfully"));
});

// Get All Task
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find();

  if (!tasks) {
    throw new ApiError(404, "No tasks found");
  }
  res.status(200).json(new ApiResponse(200, tasks, "All task found"));
});

// Get Task By ID
const getTaskById = asyncHandler(async (req, res) => {
  const { id: taskId } = req.params;
  const task = await Task.findById({ _id: taskId });
  if (!task) {
    throw new ApiError(404, "Task not found")
  }
  res.status(200).json(new ApiResponse(200, task, "Task found"));
});

// Update Task
const updateTask = asyncHandler(async (req, res) => {
  const { id: taskId } = req.params;
  const task = await Task.findByIdAndUpdate({ _id: taskId }, req.body, {
    new: true,
    runValidators: true,
    overwrite: true
  });
  if (!task) {
    throw new ApiError(400, "Task not updated");
  }
  res.status(200).json(new ApiResponse(200, task, "Task updated successfully"));
});

// Delete Task
const deleteTask = asyncHandler(async (req, res) => {
  const { id: taskId } = req.params;
  const task = await Task.findByIdAndDelete({ _id: taskId });
  if (!task) {
    throw new ApiError(400, "Task not deleted");
  }
  res.status(200).json(new ApiResponse(200, {}, "Task deleted successfully"));
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
}




