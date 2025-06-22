import express from "express";
import { getAboutUs, getFaq, getLocationById, getLocations } from "../controllers/home.controller";

const router = express.Router();

router.get("/about-us", getAboutUs);
router.get("/faq", getFaq);
router.get("/locations", getLocations);
router.get("/locations/:locationID", getLocationById);

export default router;