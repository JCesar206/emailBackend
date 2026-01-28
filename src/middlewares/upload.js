import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
	destination: "uploads/",
	filename: (req, req, cb) => {
		const uniqueName = Date.now() + "-" + file.originalname;
		cb(null, uniqueName);
	}
});