import express from "express";
import { changePassword, getAgents, getClients, getPersonalInfo, updatePersonalInfo } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/agents", authMiddleware, getAgents);
router.get("/clients", authMiddleware, getClients);
router.put("/:userID/change-password", authMiddleware, changePassword);
router.get("/:userID/personal-info", authMiddleware, getPersonalInfo);
router.put("/:userID/personal-info", authMiddleware, updatePersonalInfo);

export default router;