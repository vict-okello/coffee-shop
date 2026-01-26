import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },   // "YYYY-MM-DD"
    time: { type: String, required: true },   // "HH:mm"
    guests: { type: String, required: true }, // "1" | "2" | "5+"

    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },

    status: { type: String, default: "pending" }, // pending | confirmed | cancelled
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);
