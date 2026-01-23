import express from "express";
import Order from "../models/Order.js";
import { adminOnly } from "../middleware/adminAuth.js";

const router = express.Router();


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

router.get("/", adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch orders" });
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
