const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const Users = require("../models/user.model");
const ApiResponse = require("../utils/ApiResponse");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

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

const registerUser = asyncHandler(async (req, resp) => {
  console.log("register called");

  const { fullName, email, password } = req.body;
  console.log("reqbody", req.body);

  if (
    [fullName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are required");
  }

  // Validate if the role exists
  // const existingRole = await roleModel.findOne({ role: role.toLowerCase() });
  // if (!existingRole) {
  //   throw new ApiError(400, "Invalid Role.")
  // }

  const existedUser = await Users.findOne({
    $or: [{ fullName }, { email }],
  });
  console.log("existedUser", existedUser);

  if (existedUser) {
    // throw new ApiError(409, `user with ${email} or ${userName} is already exist.`)
    resp.status(409).json({ statusCode: 409, success: false, message: `user with ${email} or ${fullName} is already exist.` });
  }

  // console.log("req.file ", req.files);
  // const avatarLocalPath = req.files?.avatar[0]?.path;
  // // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // let coverImageLocalPath;
  // if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
  //     coverImageLocalPath = req.files.coverImage[0].path;
  // }

  // if(!avatarLocalPath) {
  //     throw new ApiError(400, "Avatar file is required");
  // }

  // const avatar = await uploadOnCloudinary(avatarLocalPath);
  // const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // if(!avatar) {
  //     throw new ApiError(400, "Avatar file is required");
  // }

  const user = await Users.create({
    fullName,
    // avatar: avatar.url,
    // coverImage: coverImage?.url || "",
    email,
    password
  });

  const createdUser = await Users.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    // throw new ApiError(500, "Something went wrong while creating user");
    resp.status(500).json({ statusCode: 500, success: false, message: `Something went wrong while creating user` });
  }

  return resp
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, resp) => {
  console.log("login called");

  const { fullName, email, password } = req.body;
  if (!(fullName || email)) {
    // throw new ApiError(400, "userName or email is required");
    resp.status(400).json({ statusCode: 400, success: false, message: `fullName or email is required.` })
  }

  const user = await Users.findOne({
    $or: [{ fullName }, { email }],
  });

  if (!user) {
    // throw new ApiError(404, "user does not exists");
    resp.status(400).json({ statusCode: 400, success: false, message: `user does not exists.` })
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    // throw new ApiError(404, "Invalid Credentials");
    resp.status(400).json({ statusCode: 400, success: false, message: `Invalid Credentials.` })
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await Users.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return resp
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, resp) => {
  await Users.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return resp
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user looged out"));
});

const refreshAccessToken = asyncHandler(async (req, resp) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  console.log("requestedbody", req.cookies);
  console.log("incomingRefreshToken", incomingRefreshToken);

  if (!incomingRefreshToken) {
    // throw new ApiError(401, "Unauthorized Request");
    resp.status(401).status({ statusCode: 401, success: false, message: `Unauthorized Request.` })
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECERET
    );

    const user = await Users.findById(decodedToken._id);

    if (!user) {
      // throw new ApiError(401, "Invalid refresh token");
      resp.status(401).status({ statusCode: 401, success: false, message: `Invalid refresh token.` })
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      // throw new ApiError(401, "Refresh token is expired or used");
      resp.status(401).status({ statusCode: 401, success: false, message: `Refresh token is expired or used.` });
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return resp
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentUserPassword = asyncHandler(async (req, resp) => {
  const { oldPassword, newPassword } = req.body;

  const user = await Users.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    // throw new ApiError(400, "Invalid old password");
    resp.status(400).status({ statusCode: 400, success: false, message: `Invalid old password.` });
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return resp
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, resp) => {
  return resp
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfully"));
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentUserPassword,
  getCurrentUser,
};
