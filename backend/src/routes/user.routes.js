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
const { verifyJWT } = require("../middlewares/auth.middleware");

const passport = require("../utils/passport");
const {
  successGoogleLogin,
  failureGoogleLogin,
} = require("../controllers/googleAuthController");

const router = express.Router();
router.use(passport.initialize());
router.use(passport.session());

// Route for Google authentication
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Google callback route
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/users/auth/google/failure",
  }),
  successGoogleLogin
);

// Success and failure routes
router.get("/auth/google/success", successGoogleLogin);
router.get("/auth/google/failure", failureGoogleLogin);

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentUserPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").post(resetPassword);

module.exports = router;