import express from "express";
import { getAllAgents, getAllClients } from "../controllers/user.controller";
import { getUserInfo } from "../controllers/getInfo.controller";
import { updateUserInfo } from "../controllers/updateUserInfo.controller";

const router = express.Router();

router.get("/allClients", getAllClients);
router.get("/allAgents", getAllAgents);

router.get("/:id/personal-info", getUserInfo);
router.put("/:id/personal-info", updateUserInfo);

export default router;