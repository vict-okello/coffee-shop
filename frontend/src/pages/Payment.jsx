import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "../Context/CartContext";
 

const BRAND = "#7C573C";
const API_BASE = import.meta.env.VITE_API_BASE || "";
const apiUrl = (path) => (API_BASE ? `${API_BASE}${path}` : path);
const money = (n) => `$${Number(n || 0).toFixed(2)}`;

// Kenya numbers helper: 07.. / 7.. / +2547.. / 2547..
const normalizePhone = (raw) => {
  const s = String(raw || "").trim().replace(/\s+/g, "");
  if (s.startsWith("+")) return s.slice(1);
  if (s.startsWith("0")) return "254" + s.slice(1);
  if (s.startsWith("7")) return "254" + s;
  if (s.startsWith("254")) return s;
  return s;
};

export default function Payment() {
  const { cart, clearCart } = useCart?.() || {}; // if you have clearCart, great. if not, ignore.

  const [method, setMethod] = useState("bank"); // bank | mpesa

  // Bank card fields
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Coupon
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Success
  const [success, setSuccess] = useState(false);

  // M-Pesa
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [mpesaLoading, setMpesaLoading] = useState(false);
  const [mpesaMsg, setMpesaMsg] = useState("");
  const [mpesaErr, setMpesaErr] = useState("");
  const [mpesaOrderId, setMpesaOrderId] = useState("");

  const subtotal = useMemo(
    () =>
      (cart || []).reduce(
        (sum, item) => sum + Number(item.price) * Number(item.qty || 1),
        0
      ),
    [cart]
  );

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return subtotal * 0.1;
  }, [appliedCoupon, subtotal]);

  const tax = 0;
  const total = Math.max(0, subtotal - discountAmount + tax);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (code === "SAVE10" || code === "COFFEE10") setAppliedCoupon(code);
    else setAppliedCoupon(null);
  };

  const handleBankPay = (e) => {
    e.preventDefault();
    setSuccess(true);
    clearCart?.();
  };

  // M-Pesa: create order first, then STK push using orderId
  const handleMpesaPay = async (e) => {
    e.preventDefault();
    setMpesaErr("");
    setMpesaMsg("");
    setMpesaOrderId("");

    const normalized = normalizePhone(mpesaPhone || phone);
    if (!/^2547\d{8}$/.allow?.test) {
      // ignore (just to avoid lint confusion) - next line is correct regex
    }
    if (!/^2547\d{8}$/.test(normalized)) {
      setMpesaErr("Enter a valid Safaricom number (e.g. 0712345678).");
      return;
    }
    if (total <= 0) {
      setMpesaErr("Total must be greater than 0.");
      return;
    }

    setMpesaLoading(true);
    try {
      // 1) Create order
      const orderRes = await fetch(apiUrl("/api/orders"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            fullName: fullName || name || "Customer",
            phone: normalized,
            address: address || "N/A",
            notes: "",
          },
          items: (cart || []).map((i) => ({
            productId: i.productId || i._id || undefined,
            name: i.name,
            price: Number(i.price),
            qty: Number(i.qty || 1),
            image: i.image || "",
          })),
          totals: {
            subtotal: Number(subtotal),
            shipping: 0,
            total: Number(total),
          },
          paymentMethod: "mpesa",
        }),
      });

      const createdOrder = await orderRes.json();
      if (!orderRes.ok || !createdOrder?._id) {
        throw new Error(createdOrder?.message || "Order creation failed.");
      }

      setMpesaOrderId(createdOrder._id);

      // 2) STK push (IMPORTANT: endpoint is /api/mpesa/stkpush)
      const stkRes = await fetch(apiUrl("/api/mpesa/stkpush"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: createdOrder._id,
          phone: normalized,
        }),
      });

      const stk = await stkRes.json();
      if (!stkRes.ok || !stk?.ok) {
        throw new Error(stk?.message || "M-Pesa request failed.");
      }

      setMpesaMsg("STK Push sent. Check your phone and enter your M-Pesa PIN.");
    } catch (e) {
      setMpesaErr(e.message || "M-Pesa error.");
    } finally {
      setMpesaLoading(false);
    }
  };

  // After STK push, poll the order until isPaid becomes true
  useEffect(() => {
    if (!mpesaOrderId) return;

    let timer = null;
    let tries = 0;

    const checkPaid = async () => {
      tries += 1;
      try {
        const res = await fetch(apiUrl(`/api/orders/${mpesaOrderId}`));
        const order = await res.json();

        if (res.ok && order?.isPaid) {
          setSuccess(true);
          clearCart?.();
          return;
        }

        if (tries >= 24) {
          setMpesaErr(
            "Payment not confirmed yet. If you paid, please wait a bit and refresh."
          );
          return;
        }

        timer = setTimeout(checkPaid, 5000);
      } catch {
        timer = setTimeout(checkPaid, 5000);
      }
    };

    checkPaid();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [mpesaOrderId]);

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full border rounded-2xl p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold">Your cart is empty!</h1>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full border rounded-2xl p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-[#7C573C]">
            Payment Successful! 🎉
          </h1>
          <p className="mt-2">You paid {money(total)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* LEFT */}
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Let’s Make Payment
            </h1>
            <p className="text-gray-500 mt-3 max-w-xl">
              Pay using Bank Card, M-Pesa, or Stripe.
            </p>

            {/* METHOD SWITCH */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setMethod("bank")}
                className={`px-5 py-3 rounded-xl border font-semibold transition ${
                  method === "bank"
                    ? "bg-[#7C573C] text-white border-transparent"
                    : "bg-white text-gray-800 hover:bg-gray-50"
                }`}
              >
                Bank Card
              </button>
              <button
                type="button"
                onClick={() => setMethod("mpesa")}
                className={`px-5 py-3 rounded-xl border font-semibold transition ${
                  method === "mpesa"
                    ? "bg-[#7C573C] text-white border-transparent"
                    : "bg-white text-gray-800 hover:bg-gray-50"
                }`}
              >
                M-Pesa
              </button>
            </div>

            {/* CUSTOMER INFO (helps for M-Pesa/Orders) */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-2">
                  Full Name (for delivery)
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-xl bg-gray-100 px-4 py-4 outline-none
                             border border-transparent
                             focus:border-[#7C573C] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Phone
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07XXXXXXXX"
                  className="w-full rounded-xl bg-gray-100 px-4 py-4 outline-none
                             border border-transparent
                             focus:border-[#7C573C] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Address
                </label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Delivery address"
                  className="w-full rounded-xl bg-gray-100 px-4 py-4 outline-none
                             border border-transparent
                             focus:border-[#7C573C] focus:bg-white transition"
                />
              </div>
            </div>

            {/* COUPON */}
            <div className="mt-8">
              <label className="block text-sm text-gray-600 mb-2">
                Discount Code
              </label>
              <div
                className="flex items-center gap-3 rounded-xl bg-gray-100 px-4 py-3
                              border border-transparent focus-within:border-[#7C573C]
                              focus-within:bg-white transition"
              >
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="SAVE10"
                  className="flex-1 bg-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="text-[#7C573C] font-semibold hover:opacity-80"
                >
                  Apply
                </button>
              </div>

              {appliedCoupon && (
                <p className="text-sm text-green-600 mt-2">
                  Coupon {appliedCoupon} applied (10% off)
                </p>
              )}
            </div>

            {/* BANK CARD FORM (demo) */}
            {method === "bank" && (
              <form onSubmit={handleBankPay} className="mt-10 space-y-5">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Cardholder’s Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="PAULINA CHIMAROKE"
                    className="w-full rounded-xl bg-gray-100 px-4 py-4 outline-none
                               border border-transparent
                               focus:border-[#7C573C] focus:bg-white transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Card Number
                  </label>
                  <input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="9870 3456 7890 6473"
                    className="w-full rounded-xl bg-gray-100 px-4 py-4 outline-none
                               border border-transparent
                               focus:border-[#7C573C] focus:bg-white transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Expiry
                    </label>
                    <input
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="03 / 25"
                      className="w-full rounded-xl bg-gray-100 px-4 py-4 outline-none
                                 border border-transparent
                                 focus:border-[#7C573C] focus:bg-white transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      CVC
                    </label>
                    <input
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      placeholder="654"
                      className="w-full rounded-xl bg-gray-100 px-4 py-4 outline-none
                                 border border-transparent
                                 focus:border-[#7C573C] focus:bg-white transition"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-4 w-48 h-12 rounded-xl text-white font-semibold
                             bg-[#7C573C] hover:opacity-90 transition shadow-sm"
                >
                  Pay
                </button>
              </form>
            )}

            {/* MPESA FORM */}
            {method === "mpesa" && (
              <form onSubmit={handleMpesaPay} className="mt-10 space-y-5">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    M-Pesa Phone Number
                  </label>
                  <input
                    value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    placeholder="0712345678"
                    className="w-full rounded-xl bg-gray-100 px-4 py-4 outline-none
                               border border-transparent
                               focus:border-[#7C573C] focus:bg-white transition"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    We’ll send an STK Push prompt to your phone.
                  </p>
                </div>

                {mpesaErr && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">
                    {mpesaErr}
                  </div>
                )}

                {mpesaMsg && (
                  <div className="text-sm text-green-700 bg-green-50 border border-green-200 p-3 rounded-xl">
                    {mpesaMsg}
                    <div className="mt-2 text-xs text-gray-600">
                      Waiting for confirmation...
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={mpesaLoading}
                  className="mt-2 w-60 h-12 rounded-xl text-white font-semibold
                             bg-[#7C573C] hover:opacity-90 transition shadow-sm disabled:opacity-60"
                >
                  {mpesaLoading ? "Sending STK..." : "Pay via M-Pesa"}
                </button>
              </form>
            )}

          </div>

          {/* RIGHT SUMMARY */}
          <div className="lg:pl-6">
            <div
              className="rounded-2xl p-8 shadow-sm border
                         bg-gradient-to-br from-gray-100 via-gray-100 to-[#e6d7cb]"
            >
              <p className="text-gray-600 font-medium">You’re paying,</p>
              <div className="text-5xl font-extrabold text-gray-900 mt-2">
                {money(total)}
              </div>

              <div className="mt-8 space-y-6">
                {(cart || []).map((item) => (
                  <div key={item.id || item._id} className="flex justify-between gap-4">
                    <div>
                      <p className="font-bold text-gray-900">
                        {item.name} x {item.qty || 1}
                      </p>
                      <p className="text-sm text-gray-500">Size: m &nbsp; Color: Red</p>
                    </div>
                    <div className="font-semibold text-gray-900">
                      {money(Number(item.price) * Number(item.qty || 1))}
                    </div>
                  </div>
                ))}

                <div className="flex justify-between">
                  <p className="font-bold">Discounts & Offers</p>
                  <p className="font-semibold">{money(discountAmount)}</p>
                </div>

                <hr className="border-gray-300/70" />

                <div className="flex justify-between">
                  <p className="font-bold">Tax</p>
                  <p className="font-semibold">{money(tax)}</p>
                </div>

                <div className="flex justify-between">
                  <p className="font-extrabold">Total</p>
                  <p className="font-extrabold">{money(total)}</p>
                </div>

                <div className="pt-2 text-xs text-gray-600">
                  Payment method:{" "}
                  <span className="font-semibold">
                    {method === "bank"
                      ? "Bank Card "
                      : method === "mpesa"
                      ? "M-Pesa"
                      : "M-Pesa"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
