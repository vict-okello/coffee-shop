
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import OpenAI from "openai";
import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";

//  MongoDB “website scan” (products + orders)
import { siteSearch } from "./utils/siteSearch.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5000;

console.log("OPENAI_API_KEY loaded?", process.env.OPENAI_API_KEY ? "YES" : "NO");

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());

app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//  Greeting guard: respond first, no DB scan
function isGreeting(message) {
  const greetings = [
    "hi",
    "hello",
    "hey",
    "good morning",
    "good afternoon",
    "good evening",
    "yo",
    "hola",
  ];
  const text = String(message || "").toLowerCase().trim();
  return greetings.some(
    (g) => text === g || text.startsWith(g + " ") || text.endsWith(" " + g)
  );
}

function greetingReply() {
  const replies = [
    "Hi! 😊 How can I help you today?",
    "Hello! ☕ How can I assist you?",
    "Hey there! What can I help you with—menu, delivery, or orders?"
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}

// Helpers for context formatting
function buildSiteContext({ products = [], orders = [] }) {
  const productsContext = products.length
    ? [
        "MATCHING PRODUCTS (live DB):",
        ...products.map((p) => {
          const stock =
            p.inStock == null
              ? "inStock: unknown"
              : `inStock: ${p.inStock}${
                  p.stockQty != null ? ` | stockQty: ${p.stockQty}` : ""
                }`;

          const priceLine =
            p.originalPrice != null
              ? `price: ${p.price} (discounted from ${p.originalPrice})`
              : `price: ${p.price ?? "N/A"}`;

          return `- ${p.title} | ${priceLine} | ${stock}${
            p.url ? ` | url: ${p.url}` : ""
          }\n  info: ${p.snippet ?? ""}`;
        }),
      ].join("\n")
    : "No matching products found.";

  const ordersContext = orders.length
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
    : "No matching orders found (if tracking, provide orderId or phone).";

  return `${productsContext}\n\n${ordersContext}`;
}

app.get("/api/chat/stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const userMessage = String(req.query.message || "").trim();

    if (!userMessage) {
      res.write(`data: Please type a message.\n\n`);
      res.write(`event: done\ndata: end\n\n`);
      res.end();
      return;
    }

    //  If user says "Hi", respond first (no search)
    if (isGreeting(userMessage)) {
      const reply = greetingReply();
      res.write(`data: ${reply}\n\n`);
      res.write(`event: done\ndata: end\n\n`);
      res.end();
      return;
    }

    //  Real-time DB scan (products + orders)
    // IMPORTANT: siteSearch.js must export siteSearch(query, limit) returning { products: [], orders: [] }
    const results = await siteSearch(userMessage, 6);
    const siteContext = buildSiteContext(results);

    const stream = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "You are Eliza Coffee Assistant. Be friendly and short. " +
            "Use SITE CONTEXT as the source of truth for products (prices, stock, descriptions) and order status. " +
            "If the user asks to track an order but no orderId/phone is provided, ask for orderId (preferred) or phone. " +
            "Do not reveal private address details. " +
            "If the answer is not in SITE CONTEXT, say you couldn't find it on the site and ask 1 short follow-up question.",
        },
        {
          role: "user",
          content: `USER QUESTION:\n${userMessage}\n\nSITE CONTEXT:\n${siteContext}`,
        },
      ],
      stream: true,
    });

    // Abort if client closes connection
    req.on("close", () => {
      try {
        stream.controller?.abort?.();
      } catch {}
    });

    for await (const event of stream) {
      if (event.type === "response.output_text.delta") {
        const chunk = String(event.delta || "").replace(/\r?\n/g, " ");
        res.write(`data: ${chunk}\n\n`);
      }

      if (event.type === "response.completed") {
        res.write(`event: done\ndata: end\n\n`);
        res.end();
        return;
      }
    }

    res.write(`event: done\ndata: end\n\n`);
    res.end();
  } catch (err) {
    console.error("OPENAI ERROR FULL:", err);

    const status = err?.status || err?.response?.status || "";
    const msg =
      err?.message ||
      err?.response?.data?.error?.message ||
      "Unknown error";

    res.write(`data: OpenAI error ${status}: ${msg}\n\n`);
    res.write(`event: done\ndata: end\n\n`);
    res.end();
  }
});

app.get("/", (req, res) => {
  res.send("Backend running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
