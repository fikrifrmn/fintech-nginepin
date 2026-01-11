import express from "express";
import { addRoom } from "../controllers/adminRoomController.js";
import { authenticateToken } from "../middleware/auth.js";
import uploadRoomImage from "../middleware/uploadRoomImage.js";

const router = express.Router();

router.post(
  "/add-room",
  authenticateToken,
  uploadRoomImage.single("image"),
  addRoom
);

export default router;
