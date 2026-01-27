import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";

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

async function safeTextSearch(model, q, fields, projection, limit) {
  if (!q) return [];

  try {
    const rows = await model
      .find({ $text: { $search: q } }, { ...projection, score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .limit(limit)
      .lean();

    return rows;
  } catch (err) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const or = fields.map((f) => ({ [f]: rx }));
    const rows = await model.find({ $or: or }, projection).limit(limit).lean();
    return rows;
  }
}

export async function siteSearch(query, limit = 6) {
  const q = String(query || "").trim();
  if (!q) return { products: [], menu: [], orders: [] };

  // PRODUCT SEARCH
  const productProjection = {
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
  };

  const products = await safeTextSearch(
    Product,
    q,
    ["name", "description", "categories"],
    productProjection,
    limit
  );

  const productResults = products.map((p) => ({
    type: "product",
    title: p.name,
    url: `/product/${p._id}`,
    price: p.discountPrice ?? p.price,
    originalPrice: p.discountPrice ? p.price : null,
    inStock: typeof p.inStock === "boolean" ? p.inStock : null,
    stockQty: typeof p.stockQty === "number" ? p.stockQty : null,
    rating: p.rating ?? null,
    weight: p.weight ?? null,
    snippet: makeSnippet(p.description),
    updatedAt: p.updatedAt,
  }));

  // MENU SEARCH
  const menuProjection = {
    slug: 1,
    name: 1,
    description: 1,
    price: 1,
    image: 1,
    category: 1,
    tag: 1,
    rating: 1,
    inStock: 1,
    updatedAt: 1,
  };

  const menuItems = await safeTextSearch(
    MenuItem,
    q,
    ["slug", "name", "description", "category", "tag"],
    menuProjection,
    limit
  );

  const menuResults = menuItems.map((m) => ({
    type: "menu",
    title: m.name,
    url: `/menu`,
    price: m.price ?? null,
    inStock: typeof m.inStock === "boolean" ? m.inStock : null,
    rating: m.rating ?? null,
    category: m.category ?? null,
    tag: m.tag ?? null,
    image: m.image ?? null,
    snippet: makeSnippet(m.description),
    updatedAt: m.updatedAt,
  }));

  // ORDER SEARCH (private, safe)
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

  return { products: productResults, menu: menuResults, orders };
}
