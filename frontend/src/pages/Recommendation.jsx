import { ShoppingCart, ChevronLeft, ChevronRight, Info } from "lucide-react";
import coffeeblue from "../assets/coffeeblue.png";
import coffeegreen from "../assets/coffeegreen.png";
import coffeebrown from "../assets/coffeebrown.png";
import { useCart } from "../Context/CartContext";
import { motion } from "framer-motion";

const products = [
  {
    id: 1,
    name: "Arabica",
    roast: "Dark Roast",
    price: 19.9, // Added price
    image: coffeeblue,
  },
  {
    id: 2,
    name: "House Blend",
    roast: "Dark Roast",
    price: 17.5,
    image: coffeebrown,
  },
  {
    id: 3,
    name: "Robusta",
    roast: "Dark Roast",
    price: 15.0,
    image: coffeegreen,
  },
];

export default function Recommended() {
  const { addToCart } = useCart();

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1b0f0f] to-[#120a0a]">
      <div className="max-w-6xl w-full px-6">
        
        {/* Title */}
        <h2 className="text-center text-4xl font-semibold text-[#f5e6d3] mb-12 font-[cursive]">
          Recommended
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="relative bg-[#5a3a2a] rounded-3xl p-6 flex flex-col items-center shadow-lg cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0,0,0,0.4)" }}
            >
              {/* Info icon */}
              <Info className="absolute top-4 left-4 text-[#e6d3bd] w-5 h-5 opacity-70" />

              {/* Product image */}
              <img
                src={product.image}
                alt={product.name}
                className="h-52 object-contain mb-6"
              />

              {/* Text */}
              <div className="mt-auto text-center text-[#f5e6d3]">
                <p className="font-semibold text-lg">{product.name}</p>
                <p className="text-sm opacity-80 mb-2">| {product.roast}</p>
                <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
              </div>

              <button
                onClick={() => addToCart({ ...product, qty: 1 })}
                className="absolute bottom-6 right-6 bg-[#e6d3bd] text-[#1b0f0f] p-2 rounded-full hover:scale-110 transition"
              >
                <ShoppingCart className="w-6 h-6" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Navigation arrows */}
        <div className="flex justify-center items-center gap-6 mt-12">
          <motion.button
            className="w-10 h-10 rounded-full border border-[#e6d3bd] flex items-center justify-center text-[#e6d3bd]"
            whileHover={{ scale: 1.2, backgroundColor: "#e6d3bd", color: "#1b0f0f" }}
          >
            <ChevronLeft />
          </motion.button>
          <motion.button
            className="w-10 h-10 rounded-full border border-[#e6d3bd] flex items-center justify-center text-[#e6d3bd]"
            whileHover={{ scale: 1.2, backgroundColor: "#e6d3bd", color: "#1b0f0f" }}
          >
            <ChevronRight />
          </motion.button>
        </div>

      </div>
    </section>
  );
}
