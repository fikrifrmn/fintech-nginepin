import mysql from "mysql2";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Helper untuk ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Perbaikan: Hapus jalur "../.env" karena .env berada di direktori yang sama (backend).
dotenv.config({ path: path.resolve(__dirname, ".env") });
// Pilihan alternatif yang lebih sederhana jika file berada di root yang sama: dotenv.config();

console.log("✅ ENV Loaded from:", path.resolve(__dirname, ".env"));
console.log("🔹 DB Config:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS ? "********" : "NO_PASS_SET", // Sembunyikan pass untuk logging
  name: process.env.DB_NAME
});

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS, // Pastikan menggunakan 'password' (bukan 'pass')
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    // Log pesan error yang lebih detail
    console.error("❌ Database connection failed. Cek kredensial di .env.");
    console.error("❌ Error detail:", err.message);
  } else {
    console.log("✅ Connected to MySQL database.");
  }
});

export default db;