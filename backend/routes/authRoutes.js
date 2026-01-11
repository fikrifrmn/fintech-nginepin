import express from "express";
import { registerUser, loginUser, verifyUser } from "../controllers/authController.js";
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify", verifyUser);
router.get('/check-auth', authenticateToken, (req, res) => {
    // Jika kode sampai sini, berarti token valid
    res.status(200).json({ 
        message: "Otentikasi berhasil", 
        user: req.user // Mengembalikan data user yang sudah di-decode dari token
    });
});

export default router;
