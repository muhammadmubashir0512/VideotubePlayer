import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_Name } from "../constants.js";

dotenv.config();


const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  } finally {
    mongoose.set("strictQuery", false);
  }
};

export default connectDB;