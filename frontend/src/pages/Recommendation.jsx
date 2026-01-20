import React, { useMemo, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight, Info } from "lucide-react";
import coffeeblue from "../assets/coffeeblue.png";
import coffeegreen from "../assets/coffeegreen.png";
import coffeebrown from "../assets/coffeebrown.png";
import coldcoffee from "../assets/coldcoffee.png";
import matcha from "../assets/matcha.png"
import latte from "../assets/latte.png"
import { useCart } from "../Context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const products = [
  { id: "latte", name: "Latte", roast: "Latte", price: 9.50, image: latte },
  { id: "matcha", name: "Matcha", roast: "Matcha", price: 8.50, image: matcha },
  { id: "cold-coffee", name: "Cold Coffee", roast: "Cold Coffee", price: 10.0, image: coldcoffee },
  { id: "arabica", name: "Arabica", roast: "Dark Roast", price: 19.9, image: coffeeblue },
  { id: "house-blend", name: "House Blend", roast: "Dark Roast", price: 17.5, image: coffeebrown },
  { id: "robusta", name: "Robusta", roast: "Dark Roast", price: 15.0, image: coffeegreen },
  
  
];

export default function Recommended() {
  const { addToCart } = useCart();

  const VISIBLE = 3;
  const [start, setStart] = useState(0);
  const [dir, setDir] = useState(1);

  const clamp = (i) => {
    const n = products.length;
    return ((i % n) + n) % n;
  };

  const visible = useMemo(() => {
    const out = [];
    for (let k = 0; k < Math.min(VISIBLE, products.length); k++) {
      out.push(products[clamp(start + k)]);
    }
    return out;
  }, [start]);

  const next = () => {
    setDir(1);
    setStart((s) => clamp(s + 1));
  };

  const prev = () => {
    setDir(-1);
    setStart((s) => clamp(s - 1));
  };

  const slide = {
    initial: (direction) => ({ opacity: 0, x: direction * 60 }),
    animate: { opacity: 1, x: 0 },
    exit: (direction) => ({ opacity: 0, x: direction * -60 }),
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1b0f0f] to-[#120a0a]">
      <div className="max-w-6xl w-full px-6">
        <h2 className="text-center text-4xl font-semibold text-[#f5e6d3] mb-12 font-[cursive]">
          Recommended
        </h2>

        {/* only 3 cards (no mobile duplicate block) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout" custom={dir} initial={false}>
            {visible.map((product, index) => (
              <motion.div
                key={product.id}
                custom={dir}
                variants={slide}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.35 }}
                className="relative bg-[#5a3a2a] rounded-3xl p-6 flex flex-col items-center shadow-lg cursor-pointer"
                whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0,0,0,0.4)" }}
              >
                <Info className="absolute top-4 left-4 text-[#e6d3bd] w-5 h-5 opacity-70" />

                <img
                  src={product.image}
                  alt={product.name}
                  className="h-52 object-contain mb-6"
                />

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
          </AnimatePresence>
        </div>

        {/* Navigation arrows */}
        <div className="flex justify-center items-center gap-6 mt-12">
          <motion.button
            type="button"
            onClick={prev}
            className="w-10 h-10 rounded-full border border-[#e6d3bd] flex items-center justify-center text-[#e6d3bd]"
            whileHover={{ scale: 1.2, backgroundColor: "#e6d3bd", color: "#1b0f0f" }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft />
          </motion.button>

          <motion.button
            type="button"
            onClick={next}
            className="w-10 h-10 rounded-full border border-[#e6d3bd] flex items-center justify-center text-[#e6d3bd]"
            whileHover={{ scale: 1.2, backgroundColor: "#e6d3bd", color: "#1b0f0f" }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
