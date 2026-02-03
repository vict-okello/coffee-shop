import express from "express";
import Order from "../models/Order.js";
import { adminOnly, staffOrAdmin } from "../middleware/adminAuth.js";
import mongoose from "mongoose";

const router = express.Router();

const safeOrder = (order) => ({
  _id: order._id,
  status: order.status,
  isPaid: order.isPaid,
  paidAt: order.paidAt,
  totals: order.totals,
  paymentMethod: order.paymentMethod,
  createdAt: order.createdAt,
  itemCount: Array.isArray(order.items)
    ? order.items.reduce((sum, item) => sum + (item.qty || 0), 0)
    : 0,
});

const normalizePhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10 && digits.startsWith("0")) return "254" + digits.slice(1);
  if (digits.length === 9 && digits.startsWith("7")) return "254" + digits;
  return digits;
};


router.post("/", async (req, res) => {
  try {
    const { customer, items, totals, paymentMethod } = req.body;

    if (!customer?.fullName || !customer?.phone || !customer?.address) {
      return res.status(400).json({ message: "Customer info is required." });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required." });
    }
    if (!totals?.total && totals?.total !== 0) {
      return res.status(400).json({ message: "Totals are required." });
    }

    const order = new Order({
      customer,
      items,
      totals,
      paymentMethod: paymentMethod || "cash",
      status: "pending",
    });

    const saved = await order.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to create order" });
  }
});

router.get("/", staffOrAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch orders" });
  }
});

// Public: track order by orderId or phone (no PII)
router.get("/track", async (req, res) => {
  try {
    const orderId = String(req.query.orderId || "").trim();
    const phone = String(req.query.phone || "").trim();

    if (!orderId && !phone) {
      return res.status(400).json({ message: "orderId or phone is required" });
    }

    if (orderId) {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: "Invalid orderId" });
      }
      const order = await Order.findById(orderId).lean();
      if (!order) return res.status(404).json({ message: "Order not found" });
      return res.json({ orders: [safeOrder(order)] });
    }

    const normalized = normalizePhone(phone);
    if (!normalized) return res.status(400).json({ message: "Invalid phone" });

    const found = await Order.find({
      $or: [{ "customer.phone": normalized }, { "customer.phone": phone }],
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    if (found.length === 0) {
      return res.status(404).json({ message: "No orders found for that phone" });
    }

    return res.json({ orders: found.map(safeOrder) });
  } catch (err) {
    return res.status(500).json({ message: "Failed to track order" });
  }
});

// Public: allow polling order status by id (no PII)
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.json({
      _id: order._id,
      status: order.status,
      isPaid: order.isPaid,
      paidAt: order.paidAt,
      totals: order.totals,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
    });
  } catch (err) {
    return res.status(400).json({ message: "Invalid order ID" });
  }
});


router.patch("/:id/status", adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["pending", "paid", "shipped", "delivered", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Order not found" });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to update status" });
  }
});

export default router;
