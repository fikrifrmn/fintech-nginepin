import db from "../db.js";

export const getAllBookings = (req, res) => {
  const sql = `
    SELECT 
      b.booking_id,
      b.user_id,
      u.username AS user_name,
      u.email AS user_email,
      b.room_id,
      r.room_name,
      r.price_per_night,
      r.description,
      r.image_url,
      DATE(b.check_in_date) AS check_in_date,
      DATE(b.check_out_date) AS check_out_date,
      b.guests,
      b.total_price,
      b.payment_status
    FROM bookings b
    LEFT JOIN users u ON b.user_id = u.user_id
    LEFT JOIN rooms r ON b.room_id = r.room_id
    ORDER BY b.booking_id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ SQL Error:", err);
      return res.status(500).json({
        error: "Database error",
        details: err.message
      });
    }

    // Jika ingin memastikan format string tanggal di Node.js
    const formattedResults = results.map(b => ({
      ...b,
      check_in_date: b.check_in_date ? b.check_in_date.toISOString().split('T')[0] : null,
      check_out_date: b.check_out_date ? b.check_out_date.toISOString().split('T')[0] : null
    }));

    res.json({
      total: formattedResults.length,
      data: formattedResults
    });
  });
};
