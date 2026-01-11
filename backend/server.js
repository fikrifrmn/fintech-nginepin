import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js"; 
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import amountroomRoutes from "./routes/amountroomRoutes.js";
import updateroomRoutes from "./routes/updateroomRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js"; 
import bookingPreviewRoutes from "./routes/bookingPreviewRoutes.js";
import addRoomRoutes from "./routes/addRoomRoutes.js";
import axios from "axios";           
import { Buffer } from "buffer";

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

console.log("JWT_SECRET terbaca:", process.env.JWT_SECRET ? "YES" : "NO");
console.log("Preview secret:", process.env.JWT_SECRET?.substring(0, 15) + "..."); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  console.log(`📥 [${req.method}] ${req.originalUrl}`);
  next();
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://127.0.0.1:5500",
  credentials: true,
}));
app.use(bodyParser.json());

/* ============================
   🔥 STATIC FILES FIX DI SINI
============================ */

app.use(
  "/assets",
  express.static(path.join(__dirname, "assets"))
);

console.log("🌍 Static aktif di: /assets");
console.log("📁 Real path:", path.join(__dirname, "assets"));

// ==========================
// ROUTES
// ==========================
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/rooms", amountroomRoutes);
app.use("/api/rooms", updateroomRoutes);
app.use("/api", paymentRoutes);
app.use("/api/admin/bookings", bookingPreviewRoutes);
app.use("/api/admin", addRoomRoutes);

// Root
app.get("/", (req, res) => {
  res.send("Backend API is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
