import db from "../db.js";

export const addRoom = (req, res) => {
  console.log("==== ADD ROOM CONTROLLER ====");
  console.log("Req body:", req.body);
  console.log("Req file:", req.file);

  if (!req.file) {
    console.log("❌ Tidak ada file yang diterima multer");
    return res.status(400).json({ message: "Image wajib diupload" });
  }

  const { name, price, description } = req.body;

  if (!name || !price) {
    console.log("❌ Name atau price kosong");
    return res.status(400).json({ message: "Name & price wajib" });
  }

  let features = [];
  try {
    features = req.body.features ? JSON.parse(req.body.features) : [];
  } catch (err) {
    console.log("❌ Error parsing features:", err);
  }

  const image = req.file.filename;
  console.log("📸 Image disimpan sebagai:", image);

  const sql = `
    INSERT INTO rooms (room_name, price_per_night, description, image_url)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [name, price, description, image], (err, result) => {
    if (err) {
      console.log("❌ Insert room gagal:", err);
      return res.status(500).json({ message: "Insert room gagal" });
    }

    console.log("✅ Room inserted, ID:", result.insertId);

    const roomId = result.insertId;

    if (features.length === 0) {
      console.log("ℹ️ Tidak ada features, selesai");
      return res.status(201).json({ message: "Room berhasil ditambahkan" });
    }

    const values = features.map(f => [roomId, f]);
    console.log("🧩 Insert features:", values);

    db.query(
      "INSERT INTO room_facilities (room_id, facility_name) VALUES ?",
      [values],
      (err2) => {
        if (err2) console.log("❌ Insert fasilitas gagal:", err2);
        return res.status(201).json({ message: "Room berhasil ditambahkan" });
      }
    );
  });
};
