import express from "express";
import { getAllCars, getBookedDaysOfCar, getCarByID, getClientReviewOfCar, getPopularCars } from "../controllers/car.controller";

const router = express.Router();
router.get("/", getAllCars);
router.get("/popular", getPopularCars);
router.get("/:carID", getCarByID);
router.get("/:carID/booked-days", getBookedDaysOfCar);
router.get("/:carID/client-review", getClientReviewOfCar);

export default router;