const jwt = require("jsonwebtoken");
const Users = require("../models/user.model");
const { default: mongoose, isValidObjectId } = require("mongoose");
const Roles = require("../models/role.model");
const { asyncHandler } = require("../utils/asyncHandler");

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    console.log("token", token);

    if (!token) {
      throw new ApiError(401, "Unauthorized Request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("decodedToken", decodedToken);

    const user = await Users.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    console.log("user", user);

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

const checkPermission = (requiredPermission) => {
  return asyncHandler(async (req, _, next) => {
    try {
      const roleId = req.user?.role;

      if (!roleId && !isValidObjectId(roleId)) {
        throw new ApiError(401, "Unauthorized user & request");
      }

      const permissionSets = await Roles.findById(roleId).select("permissions");
      console.log("permissionSets", permissionSets);

      if (!permissionSets) {
        throw new ApiError(404, "No role found");
      }

      if (!permissionSets.includes(requiredPermission)) {
        throw new ApiError(401, "not authorizd to perform this task");
      }

      next();
    } catch (error) {
      throw new ApiError(401, error?.message || "Not Authorized");
    }
  });
};

module.exports = {
  verifyJWT,
  checkPermission,
};
