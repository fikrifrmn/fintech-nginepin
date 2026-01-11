import db from "../db.js";

export const getRoomsWithFacilities = (req, res) => {
  const sql = `
    SELECT 
      r.room_id,
      r.room_name AS name,
      r.price_per_night AS price,
      r.image_url,
      GROUP_CONCAT(f.facility_name SEPARATOR ', ') AS features
    FROM rooms r
    LEFT JOIN room_facilities f ON r.room_id = f.room_id
    GROUP BY r.room_id
    ORDER BY r.room_id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    const data = results.map(r => ({
      id: r.room_id,
      name: r.name,
      price: Number(r.price),
      image: r.image_url
        ? `http://localhost:5000/assets/rooms/${r.image_url}`
        : "https://via.placeholder.com/400x300?text=Room",
      features: r.features
        ? r.features.split(",").map(f => f.trim())
        : []
    }));

    res.json(data);
  });
};
