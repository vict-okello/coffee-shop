import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

function makeSnippet(text = "", max = 220) {
  const clean = String(text).replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max) + "…" : clean;
}

function extractOrderId(text) {
  const m = String(text || "").match(/\b[0-9a-fA-F]{24}\b/);
  return m ? m[0] : null;
}

function extractPhone(text) {
  const m = String(text || "").match(/(\+?\d[\d\s-]{7,}\d)/);
  return m ? m[0] : null;
}

function normalizePhone(s) {
  const digits = String(s || "").replace(/\D/g, "");
  if (!digits) return null;
  if (digits.length === 10 && digits.startsWith("0")) return "254" + digits.slice(1);
  if (digits.length === 9 && digits.startsWith("7")) return "254" + digits;
  return digits;
}

function toSafeOrder(order) {
  return {
    id: String(order._id),
    status: order.status || "unknown",
    total: order.totals?.total ?? null,
    paymentMethod: order.paymentMethod ?? null,
    createdAt: order.createdAt ?? null,
    itemCount: Array.isArray(order.items)
      ? order.items.reduce((a, x) => a + (x.qty || 0), 0)
      : 0,
  };
}

export async function siteSearch(query, limit = 6) {
  const q = String(query || "").trim();

  // 🔍 PRODUCT SEARCH (using YOUR fields)
  let products = [];
  if (q) {
    products = await Product.find(
      { $text: { $search: q } },
      {
        score: { $meta: "textScore" },
        name: 1,
        description: 1,
        price: 1,
        discountPrice: 1,
        weight: 1,
        categories: 1,
        rating: 1,
        inStock: 1,
        stockQty: 1,
        featured: 1,
        updatedAt: 1,
      }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(limit)
      .lean();
  }

  const productResults = products.map((p) => ({
    title: p.name,
    url: `/product/${p._id}`, // since you don't use slug
    price: p.discountPrice ?? p.price, // show discount if available
    originalPrice: p.discountPrice ? p.price : null,
    inStock: typeof p.inStock === "boolean" ? p.inStock : null,
    stockQty: typeof p.stockQty === "number" ? p.stockQty : null,
    rating: p.rating ?? null,
    weight: p.weight ?? null,
    snippet: makeSnippet(p.description),
    updatedAt: p.updatedAt,
  }));

  // 🔐 ORDER SEARCH (private, safe)
  const orderId = extractOrderId(q);
  const phone = extractPhone(q);

  let orders = [];

  if (orderId && mongoose.Types.ObjectId.isValid(orderId)) {
    const order = await Order.findById(orderId).lean();
    if (order) orders.push(toSafeOrder(order));
  } else if (phone) {
    const normalized = normalizePhone(phone);
    if (normalized) {
      const found = await Order.find({
        $or: [{ "customer.phone": normalized }, { "customer.phone": phone }],
      })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean();
      orders = found.map(toSafeOrder);
    }
  }

  return { products: productResults, orders };
}
