import { Router } from "express";
import auth from "../middlewares/auth.js";
import { sendMail, inbox, mailDetail } from "../controllers/mail.controller.js";

const router = Router();

router.post("/", auth, upload.array("attachments"), sendMail);
router.get("/", auth, inbox);
router.get("/:id", auth, mailDetail);

export default router;