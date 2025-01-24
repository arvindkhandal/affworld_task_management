const passport = require('passport'); 
const GoogleStrategy = require('passport-google-oauth2').Strategy; 

passport.serializeUser((user , done) => { 
	done(null , user); 
}) 
passport.deserializeUser(function(user, done) { 
	done(null, user); 
}); 

passport.use(new GoogleStrategy({ 
	clientID:process.env.clientID,
	clientSecret:process.env.clientSecret,
    callbackURL: `${process.env.BACKEND_BASE_URL}/auth/google/callback`,  
	passReqToCallback:true
}, 
function(request, accessToken, refreshToken, profile, done) { 
	return done(null, profile); 
} 
));