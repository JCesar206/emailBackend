import { Router } from "express";
import auth from "../middlewares/auth.js";
import { sendMail, inbox } from "../controllers/mail.controller.js";

const router = Router();
router.post("/", auth, sendMail);
router.get("/", auth, inbox);

export default router;