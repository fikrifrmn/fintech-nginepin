// controllers/amountroomController.js
import db from "../db.js";

export const getAmountRooms = (req, res) => {
  const sql = `SELECT COUNT(room_id) AS total FROM rooms`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    return res.json({
      success: true,
      total: result[0].total
    });
  });
};
