import express from "express";
import Order from "../models/Order.js";
import Reservation from "../models/Reservation.js";
import Contact from "../models/ContactMessage.js";
import { adminOnly } from "../middleware/adminAuth.js";

const router = express.Router();

const escapeCsv = (val) => {
  const s = String(val ?? "");
  if (s.includes('"') || s.includes(",") || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
};

const toCsv = (headers, rows) => {
  const head = headers.map(escapeCsv).join(",");
  const body = rows
    .map((r) => headers.map((h) => escapeCsv(r[h])).join(","))
    .join("\n");
  return [head, body].join("\n");
};

router.get("/orders", adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    const headers = [
      "id",
      "status",
      "isPaid",
      "paymentMethod",
      "total",
      "itemCount",
      "createdAt",
    ];

    const rows = orders.map((o) => ({
      id: o._id,
      status: o.status,
      isPaid: o.isPaid,
      paymentMethod: o.paymentMethod,
      total: o?.totals?.total ?? "",
      itemCount: Array.isArray(o.items)
        ? o.items.reduce((s, it) => s + (it.qty || 0), 0)
        : 0,
      createdAt: o.createdAt,
    }));

    const csv = toCsv(headers, rows);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=orders.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "Failed to export orders" });
  }
});

router.get("/reservations", adminOnly, async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 }).lean();
    const headers = [
      "id",
      "name",
      "phone",
      "email",
      "date",
      "time",
      "guests",
      "status",
      "createdAt",
    ];
    const rows = reservations.map((r) => ({
      id: r._id,
      name: r.name,
      phone: r.phone,
      email: r.email,
      date: r.date,
      time: r.time,
      guests: r.guests,
      status: r.status,
      createdAt: r.createdAt,
    }));

    const csv = toCsv(headers, rows);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=reservations.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "Failed to export reservations" });
  }
});

router.get("/contacts", adminOnly, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
    const headers = ["id", "name", "email", "subject", "message", "createdAt"];
    const rows = contacts.map((c) => ({
      id: c._id,
      name: c.name,
      email: c.email,
      subject: c.subject,
      message: c.message,
      createdAt: c.createdAt,
    }));

    const csv = toCsv(headers, rows);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=contacts.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "Failed to export contacts" });
  }
});

export default router;
