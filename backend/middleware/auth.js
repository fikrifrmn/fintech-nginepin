import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
// Pastikan variabel lingkungan JWT_SECRET telah diatur
const JWT_SECRET = process.env.JWT_SECRET; 

/**
 * Middleware untuk memverifikasi JWT dari header Authorization (Bearer Token).
 * Jika valid, menyimpan data user di req.user.
 */
export const authenticateToken = (req, res, next) => {
    // Ambil token dari header Authorization (Format: "Bearer TOKEN")
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        // 401: Token tidak ada
        return res.status(401).json({ message: "Akses ditolak. Token tidak ditemukan." });
    }

    // Verifikasi token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // 403: Token tidak valid atau kadaluarsa
            return res.status(403).json({ message: "Token tidak valid atau telah kadaluarsa." });
        }
        
        // Token valid
        req.user = user; // Data user (id, role, dll.) ditambahkan ke request
        next(); // Lanjutkan ke controller
    });
};