import express from "express";
import MenuItem from "../models/MenuItem.js";
import { adminOnly } from "../middleware/adminAuth.js";

const router = express.Router();

/**
 * GET /api/menu (Public)
 */
router.get("/", async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * POST /api/menu (Admin)
 */
router.post("/", adminOnly, async (req, res) => {
  try {
    const { slug, name, description, price, image, category, tag, rating, inStock } = req.body;

    if (!slug || !name || price === undefined) {
      return res.status(400).json({ message: "slug, name, and price are required." });
    }

    const exists = await MenuItem.findOne({ slug });
    if (exists) return res.status(409).json({ message: "Slug already exists." });

    const created = await MenuItem.create({
      slug,
      name,
      description: description || "",
      price: Number(price),
      image: image || "",
      category: category || "coffee",
      tag: tag || "",
      rating: rating !== undefined ? Number(rating) : 4.5,
      inStock: inStock !== undefined ? Boolean(inStock) : true,
    });

    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
});

/**
 * PUT /api/menu/:id (Admin) (optional edit)
 */
router.put("/:id", adminOnly, async (req, res) => {
  try {
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Menu item not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
});

/**
 * DELETE /api/menu/:id (Admin)
 */
router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Menu item not found" });
    res.json({ message: "Deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
