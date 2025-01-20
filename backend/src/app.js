const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
 

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser.json());

// Route Imports

// const userRoute = require("./routes/user.routes");


// Routes Declearation

// app.use("/api/v1/users", userRoute);


// basic route 
const ApiResponse = require("./utils/ApiResponse");
app.get("/", async (req, resp) => {
  return resp
  .status(200)
  .json(
    new ApiResponse(
      200,
      {},
      "app is running fine"
    )
  )
});

module.exports = { app };