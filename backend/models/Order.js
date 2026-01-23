import mongoose from "mongoose";


const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // links to Product
    name: { type: String, required: true }, // product name
    price: { type: Number, required: true }, // price per item
    qty: { type: Number, required: true, min: 1 }, // quantity
    image: { type: String }, // "/uploads/..."
  },
  { _id: false }
);

// Main Order schema
const orderSchema = new mongoose.Schema(
  {
    customer: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      notes: { type: String, default: "" },
    },

    items: { type: [orderItemSchema], required: true },

    totals: {
      subtotal: { type: Number, required: true },
      shipping: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },

    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "mpesa", "card"],
      default: "cash",
    },
  },
  { timestamps: true } 
);

export default mongoose.model("Order", orderSchema);
