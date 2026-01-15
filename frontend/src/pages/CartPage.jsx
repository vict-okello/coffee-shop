import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cart, increaseQty, decreaseQty, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 && (
        <p className="text-gray-500 text-center mt-4">Your cart is empty 🛒</p>
      )}

      {cart.map(item => (
        <div key={item.id} className="flex justify-between border-b py-4 items-center">
          <div>
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-gray-600">Rs {item.price} each</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => decreaseQty(item.id)}
              className="px-2 py-1 border rounded"
            >
              -
            </button>
            <span>{item.qty}</span>
            <button
              onClick={() => increaseQty(item.id)}
              className="px-2 py-1 border rounded"
            >
              +
            </button>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 px-2 py-1"
            >
              Remove
            </button>
          </div>
          <div>
            <span className="font-semibold">Rs {item.price * item.qty}</span>
          </div>
        </div>
      ))}

      {cart.length > 0 && (
        <>
          <div className="text-right mt-6 font-bold text-lg">Total: Rs {total}</div>

          {/* Checkout Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate("/checkout")} 
              className="bg-[#C18A55] text-white px-5 py-2 rounded hover:opacity-90"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
