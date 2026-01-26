import express from "express";
import Reservation from "../models/Reservation.js";

const router = express.Router();

// POST /api/reservations
router.post("/", async (req, res) => {
  try {
    console.log("RESERVATION BODY:", req.body);

    const { date, time, guests, name, phone, email } = req.body;

    if (!date || !time || !guests || !name || !phone || !email) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const created = await Reservation.create({
      date,
      time,
      guests,
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email).trim(),
    });

    console.log(" Saved reservation:", created);

    return res.status(201).json({
      message: "Reserved",
      reservation: created,
    });
  } catch (err) {
    console.error("❌ Reservation POST error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const list = await Reservation.find().sort({ createdAt: -1 });
    return res.json(list);
  } catch (err) {
    console.error("Reservation GET error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
