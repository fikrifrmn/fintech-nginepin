import db from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// =============================
// REGISTER USER
// =============================
export const registerUser = async (req, res) => {
  const { username, email, password, phone } = req.body;

  if (!username || !email || !password || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [check] = await db.promise().query(
      "SELECT * FROM users WHERE email = ?", 
      [email]
    );

    if (check.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.promise().query(
      "INSERT INTO users (username, email, password, phone, created_at) VALUES (?, ?, ?, ?, NOW())",
      [username, email, hashedPassword, phone]
    );

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.promise().query(
      "SELECT * FROM users WHERE email = ?", 
      [email]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = rows[0];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid password" });

    // ⭐ IMPORTANT: gunakan user.user_id
    const token = jwt.sign(
      { 
        id: user.user_id,        // FIX
        username: user.username, 
        email: user.email,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      message: "Login success",
      token,
      user: { 
        id: user.user_id,        // FIX
        username: user.username, 
        email: user.email,
        role: user.role 
      }
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// =============================
// VERIFY USER TOKEN
// =============================
export const verifyUser = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    try {
      // ⭐ Perbaikan utama: gunakan user_id, bukan id
      const [rows] = await db.promise().query(
        `SELECT user_id AS id, username, email, role 
         FROM users 
         WHERE user_id = ?`,
        [decoded.id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        message: "Token valid",
        user: rows[0],
      });

    } catch (error) {
      console.error("Verify error:", error);
      return res.status(500).json({ message: "Database error" });
    }
  });
};
