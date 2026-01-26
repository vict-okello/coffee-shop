// backend/routes/chatRoutes.js
import express from "express";
import OpenAI from "openai";
import { siteSearch } from "../utils/siteSearch.js";

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function formatContext(results) {
  const products = results?.products || [];
  const orders = results?.orders || [];

  const productContext = products.length
    ? [
        "MATCHING PRODUCTS (live DB):",
        ...products.map((p) => {
          const stockPart =
            p.inStock === null || p.inStock === undefined
              ? "inStock: unknown"
              : `inStock: ${p.inStock}${
                  p.stockCount !== null && p.stockCount !== undefined
                    ? ` | stockCount: ${p.stockCount}`
                    : ""
                }`;

          return `- ${p.title} | price: ${p.price ?? "N/A"} | ${stockPart}${
            p.url ? ` | url: ${p.url}` : ""
          }\n  info: ${p.snippet ?? ""}`;
        }),
      ].join("\n")
    : "No matching products found in the database.";

  const orderContext = orders.length
    ? [
        "MATCHING ORDERS (live DB):",
        ...orders.map(
          (o) =>
            `- orderId: ${o.id} | status: ${o.status} | total: ${
              o.total ?? "N/A"
            } | items: ${o.itemCount ?? 0} | payment: ${
              o.paymentMethod ?? "N/A"
            } | createdAt: ${o.createdAt ?? "N/A"}`
        ),
      ].join("\n")
    : "No matching orders found (provide orderId or phone to check status).";

  return `${productContext}\n\n${orderContext}`;
}

router.post("/", async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();
    if (!message) return res.status(400).json({ message: "Message is required." });

    //  Real-time “scan” (MongoDB search + optional order lookup)
    // NOTE: This assumes your siteSearch.js returns: { products: [], orders: [] }
    const results = await siteSearch(message, 6);

    const siteContext = formatContext(results);

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant for a coffee shop website. " +
            "Use SITE CONTEXT as the source of truth. " +
            "For products: use the live DB product info (price, stock, descriptions). " +
            "For orders: only talk about orders that appear in SITE CONTEXT. " +
            "If the user asks about an order but provided no orderId or phone, ask for orderId (preferred) or phone. " +
            "Do not reveal private customer address details.",
        },
        {
          role: "user",
          content: `USER QUESTION:\n${message}\n\nSITE CONTEXT:\n${siteContext}`,
        },
      ],
    });

    const reply = completion.choices?.[0]?.message?.content || "I couldn’t generate a response.";

    res.json({
      reply,
      sources: {
        products: (results.products || []).map((p) => ({ title: p.title, url: p.url })),
        orders: (results.orders || []).map((o) => ({ id: o.id, status: o.status })),
      },
    });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ message: "Chat failed." });
  }
});

export default router;
