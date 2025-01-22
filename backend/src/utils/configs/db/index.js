const mongoose = require("mongoose");
const { DB_NAME } = require("../../constants");

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_CONNECTION_STRING}/${DB_NAME}`
      //     {
      //     useNewUrlParser: true,
      //     useUnifiedTopology: true
      // }
    );
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection error", error);
    process.exit(1);
  }
};

module.exports = connectDB;
