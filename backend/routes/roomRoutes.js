import express from "express";
import { getRoomsWithFacilities } from "../controllers/roomController.js";

const router = express.Router();

// GET /api/rooms
router.get("/", getRoomsWithFacilities);

export default router;
