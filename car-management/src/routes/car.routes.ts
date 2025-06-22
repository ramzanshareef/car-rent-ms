import express from "express";
import { getPopularCars } from "../controllers/car.controller";
import { getCars } from "../controllers/cars.controller";
import { getCarById } from "../controllers/getCarById.controller";
import { getBookedDays, getCarReviews } from "../controllers/car.booking.controller";

const router = express.Router();

router.get("/", getCars);
router.get("/car/:carId", getCarById);
router.get("/popular-cars", getPopularCars);
router.get("/car/:carID/booked-days", getBookedDays);
router.get("/car/:carID/reviews", getCarReviews);

export default router;