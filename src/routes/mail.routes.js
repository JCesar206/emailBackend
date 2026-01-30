import { Router} from "express";
import auth from "../middlewares/auth.js";
import { sendMail, getInbox, moveToFolder } from "../controllers/mail.controller.js";

const router = Router();

router.get("/", auth, getInbox);
router.post("/", auth, sendMail);
router.put("/:id/folder", auth, moveToFolder);

export default router;