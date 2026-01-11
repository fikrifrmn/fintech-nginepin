// routes/bookingPreviewRoutes.js
import express from "express";
import { getAllBookings } from "../controllers/bookingPreviewController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET semua booking (butuh login)
router.get("/preview", authenticateToken, getAllBookings);

export default router;
