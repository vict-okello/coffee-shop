import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "../Context/CartContext";

export default function Product() {
  const { addToCart } = useCart();
  const BRAND = "#7C573C";

  const [products, setProducts] = useState([]);
  const [active, setActive] = useState("all");
  const [loading, setLoading] = useState(true);

  const tabs = [
    { key: "all", label: "All" },
    { key: "best", label: "Best Seller" },
    { key: "popular", label: "Popular" },
    { key: "premium", label: "Premium" },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    if (active === "all") return products;
    return products.filter((p) => (p.categories || []).includes(active));
  }, [active, products]);

  const money = (n) => `$${Number(n).toLocaleString()}`;

  
  const resolveImage = (img) => {
    if (!img) return ""; 
    return img; 
  };

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
          Welcome to a world where every bean tells a story...
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {tabs.map((t) => {
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={`px-5 py-2 rounded-full border transition font-semibold text-sm ${
                  isActive ? "text-white" : "text-[#e6d3bd] hover:bg-white/5"
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

      <div className="max-w-6xl mx-auto px-6 pb-20">
        {loading ? (
          <p className="text-center text-[#e6d3bd]/80">Loading...</p>
        ) : (
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
                    key={p._id}
                    whileHover={{ y: -6 }}
                    className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#5a3a2a] shadow-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                    <div className="p-7">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-[#e6d3bd]/80">
                            {p.weight || "—"}
                          </p>
                          <h2 className="text-2xl font-bold mt-1">{p.name}</h2>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-[#e6d3bd]/80">Price</p>
                          <p className="text-2xl font-extrabold">
                            {money(p.price)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-5 gap-6 items-center">
                        <div className="sm:col-span-2">
                          <div className="rounded-2xl bg-white/10 border border-white/10 p-5 flex items-center justify-center">
                            <img
                              src={resolveImage(p.image)}
                              alt={p.name}
                              className="w-full max-w-[210px] object-contain drop-shadow-2xl"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <p className="text-[#f5e6d3]/90 leading-relaxed">
                            {p.description || "No description."}
                          </p>

                          <div className="flex items-center gap-2 mt-4 text-sm text-[#e6d3bd]/90">
                            <Star className="w-4 h-4" />
                            <span className="font-semibold">
                              {p.rating ?? "—"}
                            </span>
                          </div>

                          <div className="mt-6">
                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                addToCart({
                                  id: p._id,
                                  name: `${p.name} (${p.weight || ""})`,
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

                    <div className="absolute top-4 right-4">
                      <span className="text-xs px-3 py-1 rounded-full bg-[#e6d3bd] text-[#1b0f0f] font-bold">
                        {(p.categories || []).includes("best")
                          ? "Best Seller"
                          : (p.categories || []).includes("popular")
                          ? "Popular"
                          : "Premium"}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
