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
const passport = require('passport'); 
require('../utils/passport');



const googleAuthController = require('../controllers/googleAuthController');

const router = express.Router();
router.use(passport.initialize()); 
router.use(passport.session());

console.log("user route called");

router.route("/register").post(
  registerUser
);
router.get('/auth/google' , passport.authenticate('google', { scope: 
	[ 'email', 'profile' ] 
})); 

router.get( '/auth/google/callback', 
	passport.authenticate( 'google', { 
		successRedirect: '/success', 
		failureRedirect: '/failure'
}));

router.get('/success' , googleAuthController.successGoogleLogin); 

router.get('/failure' , googleAuthController.failureGoogleLogin);

router.route("/login").post(loginUser);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentUserPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").post(resetPassword);

module.exports = router;