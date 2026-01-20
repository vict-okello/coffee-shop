import React, { useMemo, useState } from "react";
import { useCart } from "../Context/CartContext";

export default function Payment() {
  const { cart } = useCart();

  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [success, setSuccess] = useState(false);

  const money = (n) => `$${Number(n || 0).toFixed(2)}`;

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price) * Number(item.qty || 1), 0),
    [cart]
  );

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return subtotal * 0.1; // 10% demo discount
  }, [appliedCoupon, subtotal]);

  const tax = 0;
  const total = Math.max(0, subtotal - discountAmount + tax);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (code === "SAVE10" || code === "COFFEE10") setAppliedCoupon(code);
    else setAppliedCoupon(null);
  };

  const handlePay = (e) => {
    e.preventDefault();
    setSuccess(true);
  };

  if (cart.length === 0) {
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
          <h1 className="text-2xl font-bold text-[#7C573C]">Payment Successful! 🎉</h1>
          <p className="mt-2">You paid {money(total)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* LEFT FORM */}
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Let’s Make Payment
            </h1>
            <p className="text-gray-500 mt-3 max-w-xl">
              To start your subscription, input your card details to make payment.
              You will be redirected to your bank&apos;s authorization page.
            </p>

            <form onSubmit={handlePay} className="mt-10 space-y-5">
              {/* Cardholder */}
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

              {/* Card Number */}
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

              {/* Expiry + CVC */}
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

              {/* Discount Code */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Discount Code
                </label>
                <div className="flex items-center gap-3 rounded-xl bg-gray-100 px-4 py-3
                                border border-transparent focus-within:border-[#7C573C]
                                focus-within:bg-white transition">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="CHIKAMSO-20-OFF"
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

              {/* Pay Button */}
              <button
                type="submit"
                className="mt-4 w-48 h-12 rounded-xl text-white font-semibold
                           bg-[#7C573C] hover:opacity-90 transition shadow-sm"
              >
                Pay
              </button>
            </form>
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
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4">
                    <div>
                      <p className="font-bold text-gray-900">
                        {item.name} x {item.qty || 1}
                      </p>
                      <p className="text-sm text-gray-500">
                        Size: m &nbsp; Color: Red
                      </p>
                    </div>
                    <div className="font-semibold text-gray-900">
                      {money(item.price * item.qty)}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
