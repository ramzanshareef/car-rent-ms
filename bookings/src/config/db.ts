import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI as string;
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI + "/bookingsDB");
        // eslint-disable-next-line no-console
        console.log("MongoDB Connected");
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
};

export default connectDB;