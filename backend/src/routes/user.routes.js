const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentUserPassword,
  getCurrentUser,
  forgotPassword,
  resetPassword
} = require("../controllers/user.controller");
const upload = require("../middlewares/multer.middleware");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = express.Router();

console.log("user route called");

router.route("/register").post(
  registerUser
);

router.route("/login").post(loginUser);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentUserPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").post(resetPassword);

module.exports = router;