import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "../Context/CartContext";
import menu01 from "../assets/menu01.png";
import menu02 from "../assets/menu02.png";
import menu03 from "../assets/menu03.png";
import menu04 from "../assets/menu04.png";
import menu05 from "../assets/menu05.png";
import menu06 from "../assets/menu06.png";
import menu07 from "../assets/menu07.png";

const menuItems = [
  { id: 1, name: "Americano", description: "The aroma of our Americano brewed with premium roasted coffee grounds and hot water. It has a velvety body, caramel-like aroma with an earthy flavour and bittersweet finish.", price: "$19.90", image: menu01 },
  { id: 2, name: "Cappuccino", description: "With the richness and intensity of espresso, complemented by the creamy and velvety texture of steamed milk, offering a combination of strong coffee notes, subtle sweetness, and a touch of bitterness.", price: "$19.90", image: menu02 },
  { id: 3, name: "Yule Log Cake", description: "Taste a combination of sweet and rich flavours of our thinly sliced Yule Log Cake, perfect for your festive celebrations.", price: "$25.00", image: menu03 },
  { id: 4, name: "Latte", description: "Smooth and creamy latte made with espresso and steamed milk, perfect for a comforting coffee experience.", price: "$18.50", image: menu04 },
  { id: 5, name: "Chocolate Muffin", description: "Rich and moist chocolate muffin with chocolate chips, perfect for a sweet treat with your coffee.", price: "$12.00", image: menu05 },
  { id: 6, name: "Pastry", description: "Rich and moist pastry with chocolate chips, perfect for a sweet treat with your coffee.", price: "$30.00", image: menu06 },
  { id: 7, name: "Avocado and Eggs", description: "Delicious avocado and eggs dish, perfect for a healthy breakfast.", price: "$35.00", image: menu07 },
];

const Menu = () => {
  const [visibleCount, setVisibleCount] = useState(3); 
  const { addToCart } = useCart(); 

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 2); 
  };

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  // Variants for menu cards
  const cardVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" }
    }),
  };

  return (
    <div className="max-w-4xl mx-auto p-4">

      {menuItems.slice(0, visibleCount).map((item, index) => (
        <motion.div
          key={item.id}
          className="flex flex-col md:flex-row items-center gap-6 border-2 p-4 mb-6 rounded-lg"
          custom={index}
          variants={cardVariant}
          initial="hidden"
          animate="visible"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full md:w-1/3 h-auto object-cover rounded-lg"
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">{item.name}</h2>
            <p className="text-gray-700 mb-4">{item.description}</p>
            <div className="flex items-center justify-between">
              <span className="font-semibold">{item.price}</span>
              <motion.button
                onClick={() => handleAddToCart(item)}
                className="px-6 py-3 rounded-full border-2 border-[#D6C1A7] text-[#D6C1A7] hover:bg-[#D6C1A7] hover:text-[#4A2F23] transition"
                whileHover={{ scale: 1.05 }}
              >
                Add to Cart
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}

      {visibleCount < menuItems.length && (
        <div className="text-center">
          <motion.button
            onClick={handleLoadMore}
            className="px-6 py-3 bg-black text-white rounded-full transition"
            whileHover={{ scale: 1.05 }}
          >
            Load More
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default Menu;
