const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: `${process.env.BACKEND_BASE_URL}/api/v1/users/auth/google/callback`,
      passReqToCallback: true,
    },
    (request, accessToken, refreshToken, profile, done) => {
      console.log("Google profile:", profile);
      return done(null, profile);
    }
  )
);

module.exports = passport