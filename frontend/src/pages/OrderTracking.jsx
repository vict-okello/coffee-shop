import React, { useState } from "react";
import { Search } from "lucide-react";

const BRAND = "#7C573C";

export default function OrderTracking() {
  const [mode, setMode] = useState("orderId"); // orderId | phone
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [orders, setOrders] = useState([]);

  const track = async (e) => {
    e.preventDefault();
    setErr("");
    setOrders([]);

    const id = orderId.trim();
    const ph = phone.trim();

    if (mode === "orderId" && !id) {
      setErr("Please enter your order ID.");
      return;
    }
    if (mode === "phone" && !ph) {
      setErr("Please enter your phone number.");
      return;
    }

    setLoading(true);
    try {
      const qs =
        mode === "orderId"
          ? `orderId=${encodeURIComponent(id)}`
          : `phone=${encodeURIComponent(ph)}`;
      const res = await fetch(`/api/orders/track?${qs}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Tracking failed");
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (e2) {
      setErr(e2.message || "Tracking failed");
    } finally {
      setLoading(false);
    }
  };

  const money = (n) => `$${Number(n || 0).toFixed(2)}`;

  return (
    <div className="min-h-screen bg-[#FAF7F3] px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Track Your Order
        </h1>
        <p className="text-gray-600 mt-2">
          Enter your order ID or phone number to check status.
        </p>

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setMode("orderId")}
              className={`px-4 py-2 rounded-xl border font-semibold transition ${
                mode === "orderId"
                  ? "bg-[#7C573C] text-white border-transparent"
                  : "bg-white text-gray-800 hover:bg-gray-50"
              }`}
            >
              Order ID
            </button>
            <button
              type="button"
              onClick={() => setMode("phone")}
              className={`px-4 py-2 rounded-xl border font-semibold transition ${
                mode === "phone"
                  ? "bg-[#7C573C] text-white border-transparent"
                  : "bg-white text-gray-800 hover:bg-gray-50"
              }`}
            >
              Phone
            </button>
          </div>

          <form onSubmit={track} className="mt-5 space-y-4">
            {mode === "orderId" ? (
              <input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. 65a9f1b0c1e2d3f4a5b6c7d8"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#7C573C]/25"
              />
            ) : (
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0712345678"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#7C573C]/25"
              />
            )}

            {err && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold transition hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: BRAND }}
            >
              <Search className="w-4 h-4" />
              {loading ? "Checking..." : "Track Order"}
            </button>
          </form>
        </div>

        {orders.length > 0 && (
          <div className="mt-8 space-y-4">
            {orders.map((o) => (
              <div
                key={o._id}
                className="rounded-2xl border bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <div className="font-semibold text-gray-900">
                    Order ID: {o._id}
                  </div>
                  <span className="text-xs uppercase tracking-wide px-2 py-1 rounded-full bg-[#7C573C] text-white">
                    {o.status || "pending"}
                  </span>
                  {o.isPaid && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                      Paid
                    </span>
                  )}
                </div>

                <div className="mt-3 text-sm text-gray-600">
                  Items: {o.itemCount || 0} • Total: {money(o?.totals?.total)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Created:{" "}
                  {o.createdAt ? new Date(o.createdAt).toLocaleString() : "—"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
