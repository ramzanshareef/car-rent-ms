import express from "express";
import { signUp } from "../controllers/user.controller";
import { signIn } from "../controllers/signIn.controller";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);

export default router;