// routes/amountroomRoutes.js
import express from "express";
import { getAmountRooms } from "../controllers/amountroomController.js";

const router = express.Router();

router.get("/amount", getAmountRooms);

export default router;
