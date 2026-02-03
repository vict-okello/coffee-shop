import express from "express";
import Contact from "../models/ContactMessage.js";
import { staffOrAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const finalName = (name || "").trim();
    if (!finalName || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required." });
    }

    const created = await Contact.create({
      name: finalName,
      email: String(email).trim(),
      subject: String(subject || "").trim(),
      message: String(message).trim(),
    });

    return res.status(201).json({ message: "Sent", contact: created });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});
router.get("/", staffOrAdmin, async (req, res) => {
  try {
    const list = await Contact.find().sort({ createdAt: -1 });
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
