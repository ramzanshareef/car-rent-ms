import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db";
import homeRoutes from "./routes/home.routes";
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

// Error handler
app.use(errorHandler);

// Routes
app.use("/home", homeRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${PORT}`);
});