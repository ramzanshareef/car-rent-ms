import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db";
import { errorHandler } from "./middlewares/error.middleware";
import userRoutes from "./routes/user.routes";
import feedbackRoutes from "./routes/feedbacks.routes";
import bookingRoutes from "./routes/bookings.routes";
import carRoutes from "./routes/car.routes";
import homeRoutes from "./routes/home.routes";
import authRoutes from "./routes/auth.routes";
import cors from "cors";

dotenv.config();
connectDB();
const app = express();
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());
app.use(errorHandler);

app.get("/", (req, res) => {
    res.send("API is running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/cars", carRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${PORT}`);
});