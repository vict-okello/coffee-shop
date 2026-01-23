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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/api/chat/stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const message = String(req.query.message || "").trim();

    if (!message) {
      res.write(`data: Please type a message.\n\n`);
      res.write(`event: done\ndata: end\n\n`);
      res.end();
      return;
    }

    const stream = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "You are Eliza Coffee Assistant. Be friendly and short. Help with menu, delivery, opening hours, and order tracking. If tracking is requested, ask for order number. If unrelated, redirect politely.",
        },
        { role: "user", content: message },
      ],
      stream: true,
    });

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
    const message =
      err?.message ||
      err?.response?.data?.error?.message ||
      "Unknown error";

    res.write(`data: OpenAI error ${status}: ${message}\n\n`);
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
