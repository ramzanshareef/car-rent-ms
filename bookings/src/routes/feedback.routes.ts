import { Router } from "express";
import { createFeedback, getRecentFeedbacks } from "../controllers/feedbacks.controller";

const router = Router();

// POST /api/feedbacks - Create new feedback
router.post("/", createFeedback);

// GET /api/feedbacks/recent - Get recent feedbacks
router.get("/recent", getRecentFeedbacks);

export default router;