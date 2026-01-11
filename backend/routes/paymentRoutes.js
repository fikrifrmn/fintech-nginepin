import express from "express";
import { createSnapToken, confirmPayment } from "../controllers/paymentController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Route generate Snap token
router.post("/create-snap-token", authenticateToken, createSnapToken);

// Route confirm payment
router.post("/bookings/:id/confirm-payment", authenticateToken, confirmPayment);

export default router;
