import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import ReserveImg from "../assets/ReserveImg.png";

function Reserve() {
  const imageVariant = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  const formVariant = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1, ease: "easeOut", delay: 0.3 },
    },
  };

  const inputVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 + 0.5, duration: 0.5, ease: "easeOut" },
    }),
  };

  const [form, setForm] = useState({
    date: "",
    time: "",
    guests: "",
    name: "",
    phone: "",
    email: "",
  });

  const [status, setStatus] = useState({ type: "idle", message: "" }); // idle | error | success
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    if (status.type !== "idle") setStatus({ type: "idle", message: "" });
  };

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const validate = () => {
    if (!form.date) return "Please select a date.";
    if (form.date < todayISO) return "Date cannot be in the past.";
    if (!form.time) return "Please select a time.";
    if (!form.guests) return "Please select number of guests.";
    if (!form.name.trim()) return "Please enter your name.";

    const phoneClean = form.phone.replace(/\s+/g, "");
    if (!phoneClean) return "Please enter your phone number.";
    if (phoneClean.length < 8) return "Phone number looks too short.";

    if (!form.email.trim()) return "Please enter your email.";
    if (!form.email.includes("@") || !form.email.includes("."))
      return "Please enter a valid email.";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      setStatus({ type: "error", message: err });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const payload = {
        date: form.date,
        time: form.time,
        guests: form.guests,
        name: form.name,
        phone: form.phone,
        email: form.email,
      };

      const res = await axios.post("/api/reservations", payload);
      setStatus({
        type: "success",
        message: res.data?.message || "Reserved",
      });

      setForm({
        date: "",
        time: "",
        guests: "",
        name: "",
        phone: "",
        email: "",
      });
    } catch (error) {
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setStatus({ type: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-[#7D5647] flex flex-col py-16 px-4 items-center">
      <motion.h1
        className="mb-12 text-5xl font-bold text-white leading-8 font-serif"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Reserve a Table
      </motion.h1>

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
            alt="Reserve"
          />
        </motion.div>

        {/* form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-transparent flex flex-col gap-4 w-full md:w-1/2"
          variants={formVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* feedback */}
          {status.type !== "idle" && (
            <div
              className={`rounded-md px-4 py-3 text-sm ${
                status.type === "error"
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {status.message}
            </div>
          )}

          {/* Date */}
          <motion.input
            custom={0}
            variants={inputVariant}
            type="date"
            min={todayISO}
            value={form.date}
            onChange={update("date")}
            className="w-full p-3 rounded-md bg-white text-black placeholder:text-gray-400 outline-none"
          />

          {/* Time + Guest */}
          <div className="flex gap-4 w-full">
            <motion.input
              custom={1}
              variants={inputVariant}
              type="time"
              value={form.time}
              onChange={update("time")}
              className="w-1/2 p-3 rounded-md bg-white text-black outline-none"
            />
            <motion.select
              custom={2}
              variants={inputVariant}
              value={form.guests}
              onChange={update("guests")}
              className="w-1/2 p-3 rounded-md bg-white text-black outline-none"
            >
              <option value="">Guest</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5+">5+</option>
            </motion.select>
          </div>

          {/* Name */}
          <motion.input
            custom={3}
            variants={inputVariant}
            type="text"
            placeholder="your name"
            value={form.name}
            onChange={update("name")}
            className="w-full p-3 rounded-md bg-white text-black outline-none"
          />

          {/* Phone */}
          <motion.input
            custom={4}
            variants={inputVariant}
            type="tel"
            placeholder="your phone"
            value={form.phone}
            onChange={update("phone")}
            className="w-full p-3 rounded-md bg-white text-black outline-none"
          />

          {/* Email + Button */}
          <div className="flex gap-4 w-full">
            <motion.input
              custom={5}
              variants={inputVariant}
              type="email"
              placeholder="your email"
              value={form.email}
              onChange={update("email")}
              className="w-3/4 p-3 rounded-md bg-white text-black outline-none"
            />

            <motion.button
              custom={6}
              variants={inputVariant}
              type="submit"
              disabled={submitting}
              className={`w-1/4 border border-[#D6C1A7] rounded-full transition font-medium
                ${
                  submitting
                    ? "bg-[#D6C1A7] text-[#4b2f23] opacity-70 cursor-not-allowed"
                    : "bg-transparent text-[#D6C1A7] hover:bg-[#D6C1A7] hover:text-[#4b2f23]"
                }`}
            >
              {submitting ? "..." : "Reserve"}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}

export default Reserve;
