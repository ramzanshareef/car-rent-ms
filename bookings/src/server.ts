import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db";
import { errorHandler } from "./middlewares/error.middleware";
import bookingsRoutes from "./routes/bookings.routes";
import feedbackRoutes from "./routes/feedback.routes";
import carBookingRoutes from "./routes/car-bookings.routes";
import cors from "cors";

dotenv.config();

connectDB();

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());

app.use("/api/bookings", bookingsRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/bookings/car", carBookingRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${PORT}`);
});