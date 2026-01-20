import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../Context/CartContext";
import { ShoppingCart, Search, Star } from "lucide-react";

import menu01 from "../assets/menu01.png";
import menu02 from "../assets/menu02.png";
import menu03 from "../assets/menu03.png";
import menu04 from "../assets/menu04.png";
import menu05 from "../assets/menu05.png";
import menu06 from "../assets/menu06.png";
import menu07 from "../assets/menu07.png";
import salmon from "../assets/salmon.png";
import sushi from "../assets/sushi.png";
import salad from "../assets/salad.png";

const BRAND = "#7C573C";

const menuItems = [
  {
    id: "americano",
    name: "Americano",
    description:
      "The aroma of our Americano brewed with premium roasted coffee grounds and hot water. It has a velvety body, caramel-like aroma with an earthy flavour and bittersweet finish.",
    price: "$19.90",
    image: menu01,
    category: "coffee",
    tag: "Popular",
    rating: 4.7,
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    description:
      "With the richness and intensity of espresso, complemented by the creamy and velvety texture of steamed milk, offering a combination of strong coffee notes, subtle sweetness, and a touch of bitterness.",
    price: "$19.90",
    image: menu02,
    category: "coffee",
    tag: "Best Seller",
    rating: 4.8,
  },
  {
    id: "yule",
    name: "Yule Log Cake",
    description:
      "Taste a combination of sweet and rich flavours of our thinly sliced Yule Log Cake, perfect for your festive celebrations.",
    price: "$25.00",
    image: menu03,
    category: "dessert",
    tag: "Seasonal",
    rating: 4.6,
  },
  {
    id: "latte",
    name: "Latte",
    description:
      "Smooth and creamy latte made with espresso and steamed milk, perfect for a comforting coffee experience.",
    price: "$18.50",
    image: menu04,
    category: "coffee",
    tag: "Smooth",
    rating: 4.6,
  },
  {
    id: "chocolate-muffin",
    name: "Chocolate Muffin",
    description:
      "Rich and moist chocolate muffin with chocolate chips, perfect for a sweet treat with your coffee.",
    price: "$12.00",
    image: menu05,
    category: "dessert",
    tag: "Sweet",
    rating: 4.5,
  },
  {
    id: "pastry",
    name: "Pastry",
    description:
      "Rich and moist pastry with chocolate chips, perfect for a sweet treat with your coffee.",
    price: "$30.00",
    image: menu06,
    category: "dessert",
    tag: "Premium",
    rating: 4.4,
  },
  {
    id: "avpcado-eggs",
    name: "Avocado and Eggs",
    description: "Delicious avocado and eggs dish, perfect for a healthy breakfast.",
    price: "$35.00",
    image: menu07,
    category: "food",
    tag: "Healthy",
    rating: 4.7,
  },
  {
    id: "salmon",
    name: "Salmon",
    description: "Salmon for best taste, perfect for a healthy breakfast.",
    price: "$50.00",
    image: salmon,
    category: "food",
    tag: "Healthy",
    rating: 4.7,
  },
  {
    id: "sushi",
    name: "Sushi",
    description: "Sushi, fesh and good soup, perfect for a healthy breakfast.",
    price: "$55.00",
    image: sushi,
    category: "food",
    tag: "Healthy",
    rating: 4.8,
  },
  {
    id: "salad",
    name: "Salad",
    description: "Salad soup perfect for a healthy breakfast.",
    price: "$15.00",
    image: salad,
    category: "food",
    tag: "Healthy",
    rating: 4.8,
  },
];

export default function Menu() {
  const { addToCart } = useCart();

  const [visibleCount, setVisibleCount] = useState(6);
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");

  const tabs = [
    { key: "all", label: "All" },
    { key: "coffee", label: "Coffee" },
    { key: "dessert", label: "Dessert" },
    { key: "food", label: "Food" },
  ];

  const parsePrice = (p) => Number(String(p).replace("$", "")) || 0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return menuItems.filter((item) => {
      const categoryOk = active === "all" || item.category === active;
      const searchOk =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q);

      return categoryOk && searchOk;
    });
  }, [active, query]);

  const shown = filtered.slice(0, visibleCount);

  const handleLoadMore = () => setVisibleCount((prev) => prev + 3);

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: parsePrice(item.price), // important for totals
      image: item.image,
      qty: 1,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1b0f0f] to-[#120a0a] text-[#f5e6d3]">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-5xl font-semibold font-[cursive]"
        >
          Our Menu
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-[#e6d3bd]/80 mt-4 max-w-2xl mx-auto leading-relaxed"
        >
          From bold espresso classics to sweet desserts and healthy plates — 
          explore our handcrafted menu and add your favourites to cart.
        </motion.p>

        {/* Tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {tabs.map((t) => {
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                onClick={() => {
                  setActive(t.key);
                  setVisibleCount(6);
                }}
                className={`px-5 py-2 rounded-full border transition font-semibold text-sm
                  ${isActive ? "text-white" : "text-[#e6d3bd] hover:bg-white/5"}`}
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

        {/* Search */}
        <div className="mt-6 max-w-xl mx-auto">
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
            <Search className="w-5 h-5 text-[#e6d3bd]/70" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisibleCount(6);
              }}
              placeholder="Search coffee, cake, pastry..."
              className="w-full bg-transparent outline-none text-[#f5e6d3] placeholder:text-[#e6d3bd]/50"
            />
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${active}-${query}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {shown.length === 0 ? (
              <div className="sm:col-span-2 lg:col-span-3 text-center text-[#e6d3bd]/80">
                No items found. Try another category or search.
              </div>
            ) : (
              shown.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="relative rounded-3xl overflow-hidden bg-[#5a3a2a] border border-white/10 shadow-xl"
                >
                  {/* soft glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                  {/* tag */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-xs px-3 py-1 rounded-full bg-[#e6d3bd] text-[#1b0f0f] font-bold">
                      {item.tag}
                    </span>
                  </div>

                  <div className="p-6 pb-0 flex justify-center items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="
                        h-52 
                        object-contain 
                        drop-shadow-[0_18px_35px_rgba(0,0,0,0.45)]
                        transition 
                        duration-300 
                        hover:scale-105
                      "
                    />
                  </div>

                  {/* content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold">{item.name}</h3>
                      <p className="text-lg font-extrabold">{item.price}</p>
                    </div>

                    <p className="text-sm text-[#e6d3bd]/85 mt-2 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2 mt-4 text-sm text-[#e6d3bd]/90">
                      <Star className="w-4 h-4" />
                      <span className="font-semibold">{item.rating}</span>
                      <span className="text-[#e6d3bd]/60">rating</span>
                      <span className="ml-auto text-xs uppercase tracking-wide text-[#e6d3bd]/60">
                        {item.category}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center justify-end">
                      <motion.button
                        onClick={() => handleAddToCart(item)}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white transition hover:opacity-90"
                        style={{ backgroundColor: BRAND }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* Load more */}
        {visibleCount < filtered.length && (
          <div className="text-center mt-12">
            <motion.button
              onClick={handleLoadMore}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="px-7 py-3 rounded-full font-semibold border transition"
              style={{
                borderColor: "rgba(230, 211, 189, 0.55)",
                color: "#e6d3bd",
              }}
            >
              Load More
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
