import express from "express";
import { createBooking, confirmPayment, getBookingById, getDashboardStats } from "../controllers/bookingController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticateToken, createBooking);          
router.get("/:id", authenticateToken, getBookingById);
router.get("/stats/dashboard", authenticateToken, getDashboardStats);

export default router;
