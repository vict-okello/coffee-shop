import React from 'react';
import { motion } from 'framer-motion';
import elzacoffee from '../assets/elzacoffee.png';
import coffeebanner from '../assets/coffeebanner.png';
import { useNavigate } from "react-router-dom";

function Banner() {
  const navigate = useNavigate();

  // Variants for left side text
  const leftVariant = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  // Variants for right side image
  const rightVariant = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  return (
    <section className="w-full min-h-screen bg-[#1D1212] flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-12">

      {/* LEFT SIDE */}
      <motion.div
        className="flex flex-col gap-6 md:gap-8 max-w-lg text-left"
        variants={leftVariant}
        initial="hidden"
        animate="visible"
      >
        <motion.img
          src={elzacoffee}
          alt="Logo"
          className="w-60 sm:w-72 md:w-96"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
        />

        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#7C573C] leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          Today's good mood is sponsored by coffee
        </motion.h2>

        <motion.p
          className="text-base sm:text-lg text-[#D6C1A7]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          Search for your favourite coffee
        </motion.p>

        {/* BUTTONS */}
        <motion.div
          className="flex gap-4 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <button
            onClick={() => navigate("/product")}
            className="px-6 py-3 rounded-full border-2 border-[#D6C1A7] text-[#D6C1A7] hover:bg-[#D6C1A7] hover:text-[#4A2F23] transition"
          >
            Shop Now
          </button>

          <button
            onClick={() => navigate("/menu")}
            className="px-6 py-3 rounded-full border-2 border-[#D6C1A7] text-[#D6C1A7] hover:bg-[#D6C1A7] hover:text-[#4A2F23] transition"
          >
            Catalog
          </button>
        </motion.div>
      </motion.div>

      {/* RIGHT SIDE IMAGE */}
      <motion.div
        className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0"
        variants={rightVariant}
        initial="hidden"
        animate="visible"
      >
        <motion.img
          src={coffeebanner}
          alt="Coffee Banner"
          className="w-full max-w-md md:max-w-full object-cover"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 1 }}
        />
      </motion.div>

    </section>
  );
}

export default Banner;
