import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import User from "../models/user.model.js";

const connectDB = async () => {
  try {
    mongoose.set("autoIndex", false);
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
      {
        maxPoolSize: 10,              // max DB connections
        minPoolSize: 2,               // always keep ready
        serverSelectionTimeoutMS: 5000, // fail fast if DB down
        socketTimeoutMS: 45000,        // close inactive sockets
      }
    );

    console.log(
      `MongoDB connected! Host: ${connectionInstance.connection.host}`
    );
    console.log("DB Name:", mongoose.connection.name);

    // Sync indexes for User model
    // await User.syncIndexes();
    await User.createIndexes();

    console.log(" User indexes synced");

  } catch (error) {
    console.error("MongoDB connection FAILED ", error);
    process.exit(1); // crash app if DB fails
  }
};

export default connectDB;
