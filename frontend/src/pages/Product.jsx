import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import product1 from "../assets/product1.png";
import product2 from "../assets/product2.png";
import product03 from "../assets/product03.png";
import espresso from "../assets/espresso.png";
import { useCart } from "../Context/CartContext";

export default function Product() {
  const { addToCart } = useCart();
  const BRAND = "#7C573C";

  const products = [
    {
      id: "half-roast",
      name: "Half Roast Beans",
      weight: "500 gm",
      price: 85,
      image: product1,
      desc:
        "Half roasted beans with a smooth aroma and balanced flavour—500 gm package full of happiness.",
      categories: ["best", "popular"],
      rating: 4.8,
    },
    {
      id: "full-roast",
      name: "Full Roast Beans",
      weight: "1 kg",
      price: 150,
      image: product2,
      desc:
        "Fully roasted beans with a bold finish and rich aroma—1 kg package full of happiness.",
      categories: ["popular", "premium"],
      rating: 4.9,
    },
     {
      id: "espresso",
      name: "Espresso",
      weight: "500 gm",
      price: 75,
      image: espresso,
      desc:
        "Half roasted beans with a smooth aroma and balanced flavour—500 gm package full of happiness.",
      categories: ["best", "popular", "premium"],
      rating: 4.8,
    },
     {
      id: "kenya-coffee",
      name: "Kenya Coffee",
      weight: "500 gm",
      price: 85,
      image: product03,
      desc:
        "Half roasted beans with a smooth aroma and balanced flavour—500 gm package full of happiness.",
      categories: ["best", "popular", "premium"],
      rating: 4.8,
    },
  ];

  const tabs = [
    { key: "all", label: "All" },
    { key: "best", label: "Best Seller" },
    { key: "popular", label: "Popular" },
    { key: "premium", label: "Premium" },
  ];

  const [active, setActive] = useState("all");

  const filtered = useMemo(() => {
    if (active === "all") return products;
    return products.filter((p) => p.categories.includes(active));
  }, [active]);

  const money = (n) => `$${Number(n).toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1b0f0f] to-[#120a0a] text-[#f5e6d3]">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-5xl font-semibold font-[cursive]"
        >
          Our Products
        </motion.h1>

        <p className="text-center text-[#e6d3bd]/80 mt-4 max-w-2xl mx-auto leading-relaxed">
  Welcome to a world where every bean tells a story. Carefully sourced, patiently roasted, 
  and crafted with passion, our coffee is more than a drink — it’s a ritual, a comfort, 
  and a moment of calm in your day.
        </p>

        {/*  Category Tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {tabs.map((t) => {
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={`px-5 py-2 rounded-full border transition font-semibold text-sm
                  ${
                    isActive
                      ? "text-white"
                      : "text-[#e6d3bd] hover:bg-white/5"
                  }`}
                style={{
                  borderColor: isActive ? BRAND : "rgba(230, 211, 189, 0.35)",
                  backgroundColor: isActive ? BRAND : "transparent",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/*  filtered Products */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {filtered.length === 0 ? (
              <div className="md:col-span-2 text-center text-[#e6d3bd]/80">
                No products found in this category.
              </div>
            ) : (
              filtered.map((p) => (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -6 }}
                  className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#5a3a2a] shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                  <div className="p-7">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-[#e6d3bd]/80">{p.weight}</p>
                        <h2 className="text-2xl font-bold mt-1">{p.name}</h2>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-[#e6d3bd]/80">Price</p>
                        <p className="text-2xl font-extrabold">{money(p.price)}</p>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-5 gap-6 items-center">
                      <div className="sm:col-span-2">
                        <div className="rounded-2xl bg-white/10 border border-white/10 p-5 flex items-center justify-center">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full max-w-[210px] object-contain drop-shadow-2xl"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <p className="text-[#f5e6d3]/90 leading-relaxed">{p.desc}</p>

                        <div className="flex items-center gap-2 mt-4 text-sm text-[#e6d3bd]/90">
                          <Star className="w-4 h-4" />
                          <span className="font-semibold">{p.rating}</span>
                          <span className="text-[#e6d3bd]/60">(1,200+ reviews)</span>
                        </div>

                        <div className="mt-6">
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              addToCart({
                                id: p.id,
                                name: `${p.name} (${p.weight})`,
                                price: p.price,
                                image: p.image,
                                qty: 1,
                              })
                            }
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-white transition hover:opacity-90"
                            style={{ backgroundColor: BRAND }}
                          >
                            <ShoppingCart className="w-5 h-5" />
                            Add to Cart
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Small tag pill */}
                  <div className="absolute top-4 right-4">
                    <span className="text-xs px-3 py-1 rounded-full bg-[#e6d3bd] text-[#1b0f0f] font-bold">
                      {p.categories.includes("best")
                        ? "Best Seller"
                        : p.categories.includes("popular")
                        ? "Popular"
                        : "Premium"}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
