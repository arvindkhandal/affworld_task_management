const { asyncHandler } = require("../utils/asyncHandler");
const roleModel = require("../models/role.model");
const { ApiError } = require("../utils/ApiError");

// Create a role
const createRole = asyncHandler(async (req, res) => {
  const role = await roleModel.create(req.body);

  if (!role) {
    throw new ApiError(400, "Failed to create role.");
  }
  res.status(201).json({ success: true, message: "Role created successfully.", role });
});

// Get all role
const getRoles = asyncHandler(async (req, res) => {
  const roles = await roleModel.find();

  if (!roles) {
    throw new ApiError(404, "No roles found");
  }
  res.status(200).json({ success: true, message: "Roles are found", roles });
});

// Get role by ID
const getRoleById = asyncHandler(async (req, res) => {
  const { id: roleId } = req.params;
  const role = await roleModel.findById({ _id: roleId });

  if (!role) {
    throw new ApiError(404, "Role not found.");
  }
  res.status(200).json({ success: true, message: "Role found.", role });
});

// Update role
const updateRole = asyncHandler(async (req, res) => {
  const { id: roleId } = req.params;
  const role = await roleModel.findByIdAndUpdate({ _id: roleId }, req.body, {
    new: true,
    runValidators: true,
    overwrite: true
  });

  if (!role) {
    throw new ApiError(404, "Role not found.");
  }
  res.status(200).json({ success: true, message: "Role Updated Successfully.", role });
});

const deleteRole = asyncHandler(async (req, res) => {
  const { id: roleId } = req.params;
  const role = await roleModel.findByIdAndDelete({ _id: roleId });

  if (!role) {
    throw new ApiError(404, "Role not found.");
  }

  res.status(200).json({ success: true, message: "Role deleted successfully." });
});

module.exports = {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole
}

