import React, { useState } from "react";
import { useCart } from "../Context/CartContext";

export default function Payment() {
  const { cart } = useCart();
  const [success, setSuccess] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const formatPrice = (price) => `$${price.toFixed(2)}`;

  const handlePayment = (e) => {
    e.preventDefault();
    setSuccess(true);
  };

  if (cart.length === 0) {
    return <div className="p-6 text-center"><h1 className="text-xl font-bold">Your cart is empty!</h1></div>;
  }

  if (success) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold">Payment Successful! 🎉</h1>
        <p className="mt-2">You paid {formatPrice(total)}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      {cart.map(item => (
        <div key={item.id} className="flex justify-between mb-2">
          <span>{item.name} x {item.qty}</span>
          <span>{formatPrice(item.price * item.qty)}</span>
        </div>
      ))}
      <div className="font-bold text-right mt-4">Total: {formatPrice(total)}</div>
      <form onSubmit={handlePayment} className="mt-6 flex flex-col gap-3">
        <input type="text" placeholder="Card Name" required className="border p-2 rounded" />
        <input type="text" placeholder="Card Number" required className="border p-2 rounded" />
        <button type="submit" className="bg-[#C18A55] text-white px-5 py-2 rounded hover:opacity-90">Pay Now</button>
      </form>
    </div>
  );
}
