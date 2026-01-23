import express from "express";
import multer from "multer";
import path from "path";
import { adminOnly } from "../middleware/adminAuth.js";

const router = express.Router();

// where files are saved
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = file.originalname
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_\.]/g, "")
      .toLowerCase();
    cb(null, `${Date.now()}-${safeName}${ext ? "" : ""}`);
  },
});

// allow only images
const fileFilter = (req, file, cb) => {
  const ok = file.mimetype.startsWith("image/");
  cb(ok ? null : new Error("Only image files allowed"), ok);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, 
});

// POST /api/upload  (admin only)
router.post("/", adminOnly, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  // the URL the frontend can use
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

export default router;
