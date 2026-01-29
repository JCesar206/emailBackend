import { Router } from "express";
import { sendMail, getInbox } from "../controllers/mail.controller.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.get("/", auth, getInbox);
router.post("/", auth, upload.array("attachments"), sendMail);

export default router;