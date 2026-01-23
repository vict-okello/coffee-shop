import express from "express";
import Product from "../models/Product.js";
import { adminOnly } from "../middleware/adminAuth.js";

const router = express.Router();

// GET all products (public)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single product (public)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: "Invalid product ID" });
  }
});

// POST new product (admin only )
router.post("/", adminOnly, async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE product (admin only )
router.put("/:id", adminOnly, async (req, res) => {
  try {
    const allowed = [
      "name",
      "price",
      "image",
      "description",
      "weight",
      "categories",
      "rating",
      "inStock",
      "stockQty",
      "featured",
      "discountPrice",
    ];

    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (updates.name) updates.name = String(updates.name).trim();
    if (updates.image) updates.image = String(updates.image).trim();
    if (updates.description) updates.description = String(updates.description).trim();

    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.rating !== undefined) updates.rating = Number(updates.rating);
    if (updates.stockQty !== undefined) updates.stockQty = Number(updates.stockQty);
    if (updates.discountPrice !== undefined) updates.discountPrice = Number(updates.discountPrice);

    if (updates.categories !== undefined) {
      if (Array.isArray(updates.categories)) {
        updates.categories = updates.categories
          .map((c) => String(c).trim().toLowerCase())
          .filter(Boolean);
      } else {
        updates.categories = String(updates.categories)
          .split(",")
          .map((c) => c.trim().toLowerCase())
          .filter(Boolean);
      }
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to update product" });
  }
});

// DELETE product (admin only)
router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid product ID" });
  }
});

export default router;
