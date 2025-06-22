import express from "express";
import { createFeedback, getRecentFeedbacks } from "../controllers/feedbacks.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, createFeedback);
router.get("/recent", getRecentFeedbacks);

export default router;