

const Users = require("../models/user.model"); 
const { generateAccessAndRefreshTokens } = require("../utils/generateAccessAndRefreshTokens");
const ApiResponse = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError"); 

const successGoogleLogin = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Google Authentication Failed");
    }

    const { email, displayName } = req.user; 
    if (!email || !displayName) {
      throw new ApiError(400, "Incomplete Google Profile Information");
    }

    let user = await Users.findOne({ email });

    if (!user) {
      user = await Users.create({
        fullName: displayName,
        email,
      });
      console.log("New user created:", user);
    } else {
      console.log("Existing user found:", user);
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    // Set cookies for tokens
    const options = {
      httpOnly: true,
      secure: true, 
    };

    return res
      .status(200)
      .cookie('user', JSON.stringify({ accessToken, options, refreshToken, user }), {
        httpOnly: false, 
        secure: false,   
        sameSite: 'Lax',
        maxAge: 3600000,   
      })
      .redirect(`${process.env.FRONTEND_BASE_URL}/taskmanagement`)
  } catch (error) {
    next(error); 
  }
};

const failureGoogleLogin = (req, res) => {
  res.status(401).json(new ApiResponse(401, null, "Google Authentication Failed"));
};

module.exports = {
  successGoogleLogin,
  failureGoogleLogin,
};
