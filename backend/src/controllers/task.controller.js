const Task = require('../models/task.model');
const { ApiError } = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/asyncHandler');

// Create Task
const createTask = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    // throw new ApiError(400, "Task name is required")
    res.status(400).status({ statusCode: 400, success: false, message: `Task name is required.` });
  }

  const task = await Task.create({ name, description });

  if (!task) {
    // throw new ApiError(404, "Task not created")
    res.status(400).status({ statusCode: 400, success: false, message: `Task not created.` });
  }
  res.status(201).json(new ApiResponse(201, task, "Task created successfully"));
});

// Get All Task
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find();

  if (!tasks || tasks.length === 0) {
    return res.status(404).json({
      statusCode: 404,
      success: false,
      message: "No tasks found."
    });
  }

  // Map tasks to frontend format
  const transformedTasks = mapBackendToFrontend(tasks);

  res.status(200).json({
    statusCode: 200,
    success: true,
    message: "All tasks found.",
    data: transformedTasks
  });
});

// Utility function for transforming data
function mapBackendToFrontend(tasks) {
  const INITIAL_DATA = [
    { id: "af1", label: "Pending", items: [], tint: 1 },
    { id: "af4", label: "Completed", items: [], tint: 2 },
    { id: "af7", label: "Done", items: [], tint: 3 }
  ];

  const statusMapping = {
    Pending: "af1",
    Completed: "af4",
    Done: "af7"
  };

  return INITIAL_DATA.map(category => ({
    ...category,
    items: tasks
      .filter(task => statusMapping[task.status] === category.id)
      .map(task => ({
        id: task._id.toString(), // Convert MongoDB ObjectId to string
        label: task.name,
        description: task.description
      }))
  }));
}
// Get Task By ID
const getTaskById = asyncHandler(async (req, res) => {
  const { id: taskId } = req.params;
  const task = await Task.findById({ _id: taskId });
  if (!task) {
    // throw new ApiError(404, "Task not found")
    res.status(404).status({ statusCode: 404, success: false, message: `Task not found.` });
  }
  res.status(200).json(new ApiResponse(200, task, "Task found"));
});

// Update Task
const updateTask = asyncHandler(async (req, res) => {
  const { id: taskId } = req.params;
  const { status, name, description } = req.body;

  // Validate that at least one field is being updated
  if (!status && !name && !description) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: "No update fields provided."
    });
  }

  const task = await Task.findByIdAndUpdate(
    taskId,
    { status, name, description },
    { new: true, runValidators: true, overwrite: false }
  );

  if (!task) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: "Task not updated."
    });
  }

  // Fetch updated tasks and transform for frontend
  const tasks = await Task.find();
  const transformedTasks = mapBackendToFrontend(tasks);

  res.status(200).json({
    statusCode: 200,
    success: true,
    message: "Task updated successfully",
    data: transformedTasks
  });
});


// Delete Task
const deleteTask = asyncHandler(async (req, res) => {
  const { id: taskId } = req.params;
  const task = await Task.findByIdAndDelete({ _id: taskId });
  if (!task) {
    // throw new ApiError(400, "Task not deleted");
    res.status(400).status({ statusCode: 400, success: false, message: `Task not deleted.` });
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




