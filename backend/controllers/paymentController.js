import midtransClient from "midtrans-client";
import db from "../db.js";

// MIDTRANS CONFIG
const midtrans = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// ==============================
// Generate Snap Token
// ==============================
export const createSnapToken = async (req, res) => {
  try {
    const { amount, order_id, booking } = req.body;

    const parameter = {
      transaction_details: {
        order_id: order_id,
        gross_amount: amount
      },
      customer_details: {
        first_name: booking.customerName,
        email: booking.email,
        phone: booking.phone
      }
    };

    const snapToken = await midtrans.createTransactionToken(parameter);
    res.json({ snap_token: snapToken });
  } catch (err) {
    console.error("MIDTRANS SNAP ERROR:", err);
    res.status(500).json({ error: "Failed to create Snap Token" });
  }
};


// ==============================
// Confirm Payment (Insert ke payments)
// ==============================
export const confirmPayment = async (req, res) => {
  const bookingId = parseInt(req.params.id, 10);
  const { order_id, status } = req.body;

  try {
    // Ambil detail transaksi dari Midtrans
    const transaction = await midtrans.transaction.status(order_id);

    // Tentukan payment_method
    let payment_method = "unknown";
    if (transaction.payment_type) {
      payment_method = transaction.payment_type;
    } else if (transaction.va_numbers && transaction.va_numbers.length > 0) {
      payment_method = transaction.va_numbers[0].bank;
    }

    const amount_paid = parseFloat(transaction.gross_amount || 0);

    // Update booking
    const [updateResult] = await db.promise().query(
      "UPDATE bookings SET payment_status = ?, midtrans_order_id = ? WHERE booking_id = ?",
      [status, order_id, bookingId]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Insert ke payments
    const now = new Date();
    const [insertResult] = await db.promise().query(
      `INSERT INTO payments (booking_id, payment_method, amount_paid, payment_date, payment_status) 
       VALUES (?, ?, ?, ?, ?)`,
      [bookingId, payment_method, amount_paid, now, status]
    );

    res.json({ 
      message: "Payment confirmed and recorded",
      payment_id: insertResult.insertId 
    });
  } catch (err) {
    console.error("❌ SQL / Midtrans Error:", err);
    res.status(500).json({ error: "Failed to confirm payment", details: err.message });
  }
};
