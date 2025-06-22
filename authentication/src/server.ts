import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middlewares/error.middleware';


dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Error handler
app.use(errorHandler);

// Routes
app.use('/auth', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});