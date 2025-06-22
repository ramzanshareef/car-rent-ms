import { Router } from "express";
import { createBooking, deleteBooking, getAllUserBookings, getBookingDetails, updateBooking } from "../controllers/bookings.controller";

const router = Router();

router.get("/booking/:bookingID", getBookingDetails);
router.post("/", createBooking);
router.get("/:userID", getAllUserBookings);
router.delete("/:bookingID", deleteBooking);
router.put("/:bookingID", updateBooking);

export default router;