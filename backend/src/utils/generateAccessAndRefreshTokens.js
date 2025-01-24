const { ApiError } = require("../utils/ApiError")
const Users = require("../models/user.model")

const generateAccessAndRefreshTokens = async (userId) => {
    try {
      const user = await Users.findById(userId);
  
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
  
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
  
      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(
        500,
        "Something went wrong while generating access & refresh token"
      );
    }
  };

  module.exports = {generateAccessAndRefreshTokens};