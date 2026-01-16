import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ourstory from '../assets/ourstory.png';

function Story() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = [ourstory, ourstory, ourstory];

  // Variants for card slide-in
  const cardVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  // Variants for image
  const imageVariant = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  // Variants for text
  const textVariant = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 } },
  };

  return (
    <section className="bg-[#1D1212] flex flex-col items-center py-16 px-4">
      
      {/* Card */}
      <motion.div
        className="
          bg-[#4f3728]
          max-w-5xl w-full
          h-auto md:h-[220px]
          flex flex-col md:flex-row
          items-center gap-6 md:gap-8
          px-6
          rounded-[12px]
          relative
        "
        variants={cardVariant}
        initial="hidden"
        animate="visible"
      >
        {/* Image */}
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex} // animate on slide change
            src={slides[activeIndex]}
            alt="story"
            className="
              relative
              -mt-24 sm:-mt-28 md:mt-20
              w-[160px] sm:w-[180px] md:w-[200px]
              h-[300px] sm:h-[360px] md:h-[450px]
              object-cover
            "
            variants={imageVariant}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: -50, transition: { duration: 0.5 } }}
          />
        </AnimatePresence>

        {/* Text */}
        <motion.div
          className="text-white max-w-xl text-center md:text-left"
          variants={textVariant}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#f8d8b8] mb-4">
            Our Story
          </h2>

          <p className="leading-relaxed text-sm sm:text-base">
            Eliza Is An Online Coffee Store That Offers The Widest Selection Of
            Specialty Coffees And Teas From Around The World...
          </p>

          <a href="#" className="text-[#f8d8b8] underline mt-4 inline-block">
            More
          </a>
        </motion.div>
      </motion.div>

      {/* Dots */}
      <div className="flex gap-3 mt-8">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              activeIndex === index ? 'bg-[#f8d8b8]' : 'bg-gray-400'
            }`}
            whileTap={{ scale: 1.3 }}
            animate={{ scale: activeIndex === index ? 1.25 : 1 }}
          />
        ))}
      </div>
    </section>
  );
}

export default Story;
