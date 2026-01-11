import mysql from "mysql2";
import dotenv from "dotenv";

// Cukup gunakan ini, dotenv akan otomatis mencari .env jika ada (di lokal), 
// dan tidak akan error jika file tidak ada di production (Railway)
dotenv.config();

console.log("🔹 Menghubungkan ke DB Host:", process.env.DB_HOST);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || process.env.DB_PASS, // Railway sering pakai DB_PASSWORD
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  // TAMBAHKAN INI: Railway mewajibkan SSL untuk koneksi luar
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL database.");
  }
});

export default db;