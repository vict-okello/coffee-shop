import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const BRAND = "#7C573C";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);

    // connect to backend / email service
    setTimeout(() => setSent(false), 4000);
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#1b0f0f] to-[#120a0a] text-[#f5e6d3] py-24">
      <div className="max-w-6xl mx-auto px-6 space-y-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl font-semibold font-[cursive]">
            Contact Us
          </h1>
          <p className="mt-4 text-[#e6d3bd]/80 max-w-2xl mx-auto leading-relaxed">
            Have a question, reservation request, or just want to say hello?  
            We’d love to hear from you — our team is always happy to help.
          </p>
        </motion.div>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Address */}
          <motion.div
            custom={0}
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="bg-[#5a3a2a] border border-white/10 rounded-3xl p-8 text-center shadow-lg"
          >
            <div className="flex justify-center mb-4">
              <MapPin className="w-8 h-8" style={{ color: BRAND }} />
            </div>
            <h4 className="font-semibold tracking-wide text-sm uppercase">
              Our Address
            </h4>
            <p className="text-sm mt-2 text-[#e6d3bd]/90">
              3517 W, Gray St. <br /> Utica 57867
            </p>
          </motion.div>

          {/* Phone + Email */}
          <motion.div
            custom={1}
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="bg-[#5a3a2a] border border-white/10 rounded-3xl p-8 text-center shadow-lg space-y-6"
          >
            <div>
              <div className="flex justify-center mb-2">
                <Phone className="w-7 h-7" style={{ color: BRAND }} />
              </div>
              <p className="text-sm font-semibold">(406) 555 0120</p>
            </div>

            <div>
              <div className="flex justify-center mb-2">
                <Mail className="w-7 h-7" style={{ color: BRAND }} />
              </div>
              <p className="text-sm font-semibold">elzacoffee.co.ke</p>
            </div>
          </motion.div>

          {/* Hours */}
          <motion.div
            custom={2}
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="bg-[#5a3a2a] border border-white/10 rounded-3xl p-8 text-center shadow-lg"
          >
            <div className="flex justify-center mb-4">
              <Clock className="w-8 h-8" style={{ color: BRAND }} />
            </div>
            <h4 className="font-semibold tracking-wide text-sm uppercase">
              Opening Hours
            </h4>
            <p className="text-sm mt-2 text-[#e6d3bd]/90">
              Monday – Friday <br /> 9:00 AM – 12:00 PM
            </p>
          </motion.div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold tracking-wide text-center mb-10">
            Get In Touch
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-8 bg-[#5a3a2a] border border-white/10 rounded-3xl p-10 shadow-xl"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Your Name"
                required
                className="bg-transparent border-b border-white/20 focus:border-[#7C573C] outline-none py-3 placeholder:text-[#e6d3bd]/60"
              />
              <input
                type="email"
                placeholder="Your Email"
                required
                className="bg-transparent border-b border-white/20 focus:border-[#7C573C] outline-none py-3 placeholder:text-[#e6d3bd]/60"
              />
            </div>

            <input
              type="text"
              placeholder="Subject"
              className="w-full bg-transparent border-b border-white/20 focus:border-[#7C573C] outline-none py-3 placeholder:text-[#e6d3bd]/60"
            />

            <textarea
              placeholder="Your Message"
              rows="4"
              required
              className="w-full bg-transparent border-b border-white/20 focus:border-[#7C573C] outline-none py-3 resize-none placeholder:text-[#e6d3bd]/60"
            />

            <div className="text-center pt-4">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="px-10 py-3 rounded-full font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: BRAND }}
              >
                {sent ? "Message Sent ✓" : "Send Message"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
