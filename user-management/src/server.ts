import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./middlewares/error.middleware";
import cors from "cors";
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

// Error handler (should be after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${PORT}`);
});