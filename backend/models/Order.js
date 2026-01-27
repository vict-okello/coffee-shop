import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    image: { type: String },
  },
  { _id: false }
);

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

    // Payment tracking (works for M-Pesa and card too)
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },

    // M-Pesa STK Push details
    mpesa: {
      phone: { type: String, default: "" },
      amount: { type: Number, default: 0 },

      merchantRequestID: { type: String, default: "" },
      checkoutRequestID: { type: String, default: "" },

      resultCode: { type: Number },
      resultDesc: { type: String, default: "" },

      receiptNumber: { type: String, default: "" }, 
      transactionDate: { type: String, default: "" }, 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
