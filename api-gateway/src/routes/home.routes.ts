import express from "express";
import { getAboutUs, getFAQ, getLocations } from "../controllers/home.controller";

const router = express.Router();

router.get("/about-us", getAboutUs);
router.get("/faq", getFAQ);
router.get("/locations", getLocations);

export default router;