import express from "express";
import { updateRoom } from "../controllers/updateroomController.js";

const router = express.Router();

// UPDATE room
router.put("/:id", updateRoom);

export default router;
