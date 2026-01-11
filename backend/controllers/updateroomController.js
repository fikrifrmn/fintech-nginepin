import db from "../db.js";

export const updateRoom = (req, res) => {
  const roomId = req.params.id;
  const { name, price, features } = req.body;

  // ===== VALIDATION =====
  if (!name || !price || !Array.isArray(features)) {
    return res.status(400).json({
      error: "Invalid request body. name, price, and features[] are required"
    });
  }

  // ===== SQL QUERIES =====
  const sqlUpdateRoom = `
    UPDATE rooms
    SET room_name = ?, price_per_night = ?
    WHERE room_id = ?;
  `;

  const sqlDeleteFacilities = `
    DELETE FROM room_facilities
    WHERE room_id = ?;
  `;

  const sqlInsertFacility = `
    INSERT INTO room_facilities (room_id, facility_name)
    VALUES (?, ?);
  `;

  // ===== START TRANSACTION =====
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to start transaction" });
    }

    // ===== UPDATE ROOM =====
    db.query(sqlUpdateRoom, [name, price, roomId], (err, result) => {
      if (err || result.affectedRows === 0) {
        return db.rollback(() => {
          res.status(500).json({ error: "Failed to update room" });
        });
      }

      // ===== DELETE OLD FACILITIES =====
      db.query(sqlDeleteFacilities, [roomId], (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: "Failed to delete facilities" });
          });
        }

        // ===== INSERT NEW FACILITIES =====
        const insertPromises = features.map((facility) => {
          return new Promise((resolve, reject) => {
            db.query(
              sqlInsertFacility,
              [roomId, facility.trim()],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });
        });

        Promise.all(insertPromises)
          .then(() => {
            // ===== COMMIT =====
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ error: "Commit failed" });
                });
              }

              res.status(200).json({
                message: "Room updated successfully",
                room_id: roomId
              });
            });
          })
          .catch(() => {
            db.rollback(() => {
              res.status(500).json({ error: "Failed to insert facilities" });
            });
          });
      });
    });
  });
};
