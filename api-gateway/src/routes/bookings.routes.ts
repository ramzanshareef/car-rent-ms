import express from "express";
import { createBooking, deleteBooking, getBookingById, getClientsAllBookings, updateBooking } from "../controllers/bookings.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/booking/:bookingID", authMiddleware, getBookingById);
router.post("/", authMiddleware, createBooking);
router.get("/:userID", authMiddleware, getClientsAllBookings);
router.delete("/:bookingID", authMiddleware, deleteBooking);
router.put("/:bookingID", authMiddleware, updateBooking);

export default router;