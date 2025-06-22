import { Router } from "express";
import { getBookedDays, getCarClientReviews } from "../controllers/car-bookings.controller";

const router = Router();

router.get("/:carID/booked-days", getBookedDays);
router.get("/:carID/reviews", getCarClientReviews);

export default router;