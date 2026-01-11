// controllers/bookingController.js
import db from "../db.js";

/* ---------------------------------------------------------
   CREATE BOOKING (Pending)
--------------------------------------------------------- */
export const createBooking = (req, res) => {
  console.log("📌 Incoming Booking Request");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  const { 
    user_id, 
    room_id, 
    check_in_date, 
    check_out_date, 
    guests,
    total_price
  } = req.body;

  if (!user_id || !room_id || !check_in_date || !check_out_date || !guests || !total_price) {
    return res.status(400).json({
      error: "Data booking tidak lengkap"
    });
  }

  const sql = `
    INSERT INTO bookings 
    (user_id, room_id, check_in_date, check_out_date, guests, total_price, payment_status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    user_id,
    room_id,
    check_in_date,
    check_out_date,
    guests,
    total_price,
    "pending"   // default
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("❌ SQL Error:", err);
      return res.status(500).json({
        error: "Gagal menyimpan booking"
      });
    }

    res.status(201).json({
      message: "Booking berhasil dibuat sebagai pending",
      booking_id: result.insertId
    });
  });
};


/* ---------------------------------------------------------
   UPDATE PAYMENT STATUS VIA MIDTRANS CALLBACK
--------------------------------------------------------- */
export const confirmPayment = (req, res) => {
  const { order_id, transaction_status } = req.body;

  console.log("🔥 Payment Callback:", req.body);

  if (!order_id) return res.status(400).json({ error: "order_id tidak ada" });

  let newStatus = "pending";

  if (transaction_status === "settlement") newStatus = "paid";
  if (transaction_status === "expire") newStatus = "cancelled";
  if (transaction_status === "cancel") newStatus = "cancelled";
  if (transaction_status === "deny") newStatus = "cancelled";
  if (transaction_status === "failure") newStatus = "cancelled";

  const sql = `
    UPDATE bookings
    SET payment_status = ?, midtrans_order_id = ?
    WHERE booking_id = ?
  `;

  // order_id format "BLUESKY-12345"
  const bookingId = order_id.split("-")[1];

  db.query(sql, [newStatus, order_id, bookingId], (err, result) => {
    if (err) {
      console.error("❌ SQL Error:", err);
      return res.status(500).json({ error: "Gagal update status pembayaran" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking tidak ditemukan" });
    }

    res.json({
      message: "Payment status updated",
      booking_id: bookingId,
      status: newStatus
    });
  });
};

export const getBookingById = (req, res) => {
  const bookingId = req.params.id;
  console.log("🔍 Fetching Data for ID:", bookingId);

  // PERBAIKAN PENTING DI SINI:
  // 1. Menggunakan 'b.id' (bukan booking_id)
  // 2. Mengambil 'r.name' (pastikan di tabel rooms kolomnya 'name')
  
  const sql = `
    SELECT 
      b.booking_id, 
      b.user_id, 
      b.room_id, 
      b.check_in_date, 
      b.check_out_date, 
      b.guests, 
      b.total_price, 
      b.payment_status, 
      b.midtrans_order_id,
      r.room_name AS room_name, 
      r.price_per_night AS room_price
    FROM bookings b
    LEFT JOIN rooms r ON b.room_id = r.room_id
    WHERE b.booking_id = ? 
  `;

  db.query(sql, [bookingId], (err, result) => {
    if (err) {
      console.error("❌ SQL Error GetBooking:", err);
      // Kirim error detail ke frontend biar kelihatan di Console Browser
      return res.status(500).json({ error: "Database Error", details: err.sqlMessage });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Data Booking tidak ditemukan" });
    }

    const data = result[0];

    // Format Data untuk Frontend (CamelCase)
    const formattedData = {
      id: data.id,
      roomName: data.room_name || "Unknown Room",
      checkIn: data.check_in_date,
      checkOut: data.check_out_date,
      guests: data.guests,
      total: data.total_price,
      status: data.payment_status, // Penting: ini harus terkirim
      order_id: data.midtrans_order_id || `BOOK-${data.id}`
    };

    console.log("✅ Data sent to frontend:", formattedData);
    res.json(formattedData);
  });
};

/* ---------------------------------------------------------
   DASHBOARD STATS
--------------------------------------------------------- */
export const getDashboardStats = (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM bookings) AS totalBookings,
      (SELECT IFNULL(SUM(total_price), 0) FROM bookings WHERE payment_status = 'paid') AS totalRevenue,
      (SELECT COUNT(DISTINCT user_id) FROM bookings) AS activeUsers
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ SQL Error Dashboard Stats:", err);
      return res.status(500).json({ success: false });
    }

    res.json({
      success: true,
      totalBookings: result[0].totalBookings,
      totalRevenue: result[0].totalRevenue,
      activeUsers: result[0].activeUsers
    });
  });
};
