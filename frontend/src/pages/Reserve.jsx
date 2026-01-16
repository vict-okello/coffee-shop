import React from 'react';
import { motion } from 'framer-motion';
import ReserveImg from "../assets/ReserveImg.png";

function Reserve() {
  // Variants for image sliding in from left
  const imageVariant = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: 'easeOut' } },
  };

  // Variants for form sliding in from right
  const formVariant = {
    hidden: { opacity: 0, x: 100 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 1, ease: 'easeOut', delay: 0.3 } 
    },
  };

  // Variant for each input/button inside the form
  const inputVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 + 0.5, duration: 0.5, ease: 'easeOut' }
    }),
  };

  return (
    <section className='bg-[#7D5647] flex flex-col py-16 px-4 items-center'>
      <motion.h1
        className='mb-12 text-5xl font-bold text-white leading-8 font-serif'
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Reserve a Table
      </motion.h1>
       
      {/* wrapper */}
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-10 px-6">

        {/* image */}
        <motion.div
          className="flex justify-center md:justify-start w-full md:w-1/2"
          variants={imageVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <img 
            className="object-contain w-[300px] sm:w-[330px] md:w-[400px]"
            src={ReserveImg}
            alt="ReserveImg"
          />
        </motion.div>

        {/* form */}
        <motion.form
          className="bg-transparent flex flex-col gap-4 w-full md:w-1/2"
          variants={formVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Date */}
          <motion.input
            custom={0}
            variants={inputVariant}
            type="date"
            className="w-full p-3 rounded-md bg-[#fff] text-black placeholder:text-gray-400 outline-none"
            placeholder="Date"
          />

          {/* Time + Guest */}
          <div className="flex gap-4 w-full">
            <motion.input
              custom={1}
              variants={inputVariant}
              type="time"
              className="w-1/2 p-3 rounded-md bg-white text-black outline-none"
              placeholder="Time"
            />
            <motion.select
              custom={2}
              variants={inputVariant}
              className="w-1/2 p-3 rounded-md bg-white text-black outline-none"
            >
              <option>Guest</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5+</option>
            </motion.select>
          </div>

          {/* Name */}
          <motion.input
            custom={3}
            variants={inputVariant}
            type="text"
            placeholder="your name"
            className="w-full p-3 rounded-md bg-white text-black outline-none"
          />

          {/* Phone */}
          <motion.input
            custom={4}
            variants={inputVariant}
            type="tel"
            placeholder="your phone"
            className="w-full p-3 rounded-md bg-white text-black outline-none"
          />

          {/* Email + Button */}
          <div className="flex gap-4 w-full">
            <motion.input
              custom={5}
              variants={inputVariant}
              type="email"
              placeholder="your email"
              className="w-3/4 p-3 rounded-md bg-white text-black outline-none"
            />
            <motion.button
              custom={6}
              variants={inputVariant}
              className="w-1/4 bg-transparent border border-[#D6C1A7] text-[#D6C1A7] rounded-full hover:bg-[#D6C1A7] hover:text-[#4b2f23] transition font-medium"
            >
              Reserve
            </motion.button>
          </div>
        </motion.form>

      </div>
    </section>
  );
}

export default Reserve;
