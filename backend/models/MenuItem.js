import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true }, // like "americano"
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
    category: { type: String, default: "coffee" },
    tag: { type: String, default: "" },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/* Enable full-text search for chatbot */
menuItemSchema.index({
  name: "text",
  description: "text",
  tag: "text",
  category: "text",
  slug: "text",
});

export default mongoose.model("MenuItem", menuItemSchema);
