import { Router } from "express";
import auth from "../middlewares/auth.js";
import { createFolder, getFolders } from "../controllers/folder.controller.js";

const router = Router();

router.post("/", auth, createFolder);
router.get("/", auth, getFolders);

export default router;