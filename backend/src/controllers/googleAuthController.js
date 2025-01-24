const jwt = require("jsonwebtoken");
const Users = require("../models/user.model");

const loadAuth = (req, res) => {
  res.render("auth");
};

const successGoogleLogin = async (req, res) => {
  if (!req.user) res.redirect("/failure");
  console.log(req.user);
  let user = await Users.findOne({ email: req.user.email });
  console.log("user find", user);
  if (!user) {
    console.log("user not find");
    const highestId = await Users.findOne({}, "id").sort("-id");
    const nextId = highestId ? highestId.id + 1 : 1;
    console.log("id should be", nextId);
    user = new Users({
      name: req.user.displayName,
      email: req.user.email,
      id: nextId,
    });
    console.log("user to be saved", user);
    user = await user.save();
    console.log("user id ", user.id);
    console.log("user saved", user);
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
  //   res.send("Welcome " + req.user.email);
  res.send({ 
    token, 
    message: "Welcome " + req.user.email,
    data: user
   });
};

const failureGoogleLogin = (req, res) => {
  res.send("Error");
};

module.exports = {
  loadAuth,
  successGoogleLogin,
  failureGoogleLogin,
};