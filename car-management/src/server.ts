import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db";
import carRoutes from "./routes/car.routes";
import { errorHandler } from "./middlewares/error.middleware";
import cors from "cors";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Error handler
app.use(errorHandler);

// Routes
app.use("/api/cars", carRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});