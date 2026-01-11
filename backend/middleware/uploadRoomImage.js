import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================
// SIMPAN DI backend/assets/rooms
// ============================
const uploadDir = path.join(__dirname, "../assets/rooms");

// pastikan folder ada
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `room-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (/image\/(jpeg|png|jpg)/.test(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPG, JPEG, PNG allowed"), false);
};

const uploadRoomImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

console.log("📂 Upload folder:", uploadDir);

export default uploadRoomImage;

