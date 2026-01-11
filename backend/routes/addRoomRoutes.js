import express from "express";
import { addRoom } from "../controllers/addRoomController.js";
import { authenticateToken } from "../middleware/auth.js";
import uploadRoomImage from "../middleware/uploadRoomImage.js"; // ✅ WAJIB

const router = express.Router();

router.post(
  "/add-room",
  authenticateToken,
  (req, res, next) => {
    console.log("\n==== ROUTE HIT: /add-room ====");
    console.log("Headers content-type:", req.headers["content-type"]);
    next();
  },
  uploadRoomImage.single("image"),
  (req, res, next) => {
    console.log("📡 Setelah multer");
    console.log("File di route:", req.file);
    console.log("Body di route:", req.body);
    next();
  },
  addRoom
);

export default router;
