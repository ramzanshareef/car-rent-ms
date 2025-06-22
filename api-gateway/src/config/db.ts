/* eslint-disable no-console */
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI + "/userDB");
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Error = ", error);
        process.exit(1);
    }
};

export default connectDB;