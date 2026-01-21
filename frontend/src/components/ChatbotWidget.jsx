import React, { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function normalize(text = "") {
  return text.toLowerCase().trim();
}

function makeBotReply(userText) {
  const t = normalize(userText);

  if (t.includes("hi") || t.includes("hello")) {
    return "Hi! ☕ Welcome to Eliza Coffee. How can I help—menu, delivery, or orders?";
  }

  if (t.includes("menu") || t.includes("coffee") || t.includes("tea")) {
    return "Our menu includes Americano, Cappuccino, Latte, Mocha and specialty teas. Want recommendations?";
  }

  if (t.includes("recommend")) {
    return "Strong → Americano. Creamy → Cappuccino/Latte. Sweet → Mocha. What do you prefer?";
  }

  if (t.includes("delivery") || t.includes("shipping")) {
    return "We offer delivery in selected areas. Tell me your location and I’ll check availability.";
  }

  if (t.includes("hours") || t.includes("open")) {
    return "We’re open daily from 8:00 AM to 8:00 PM.";
  }

  if (t.includes("order") || t.includes("track")) {
    return "Please share your order number so I can help track it.";
  }

  return "I can help with menu, delivery, hours, or order tracking. What would you like to know?";
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! ☕ I’m Eliza Assistant. Ask me about menu, delivery, or orders." },
  ]);

  const listRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const quickReplies = useMemo(
    () => ["Show menu", "Delivery info", "Opening hours", "Track my order"],
    []
  );

  const send = () => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");

    setTimeout(() => {
      const reply = makeBotReply(text);
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    }, 400);
  };

  return (
    <>
      {/* Floating animated button */}
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="fixed bottom-5 right-5 z-[9999] rounded-full bg-[#7C573C] text-[#EDE3D5] p-4 shadow-lg"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Animated Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-5 right-5 z-[9999] w-[340px] md:w-[380px] rounded-2xl shadow-2xl overflow-hidden bg-white border"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#7C573C] text-[#EDE3D5]">
              <div>
                <p className="font-semibold leading-tight">Eliza Assistant</p>
                <p className="text-xs opacity-90">Online now</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={listRef} className="h-[340px] overflow-y-auto px-3 py-3 bg-[#FAF7F2]">
              <AnimatePresence>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`mb-2 flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                        m.from === "user"
                          ? "bg-[#7C573C] text-[#EDE3D5] rounded-br-md"
                          : "bg-white text-gray-800 rounded-bl-md"
                      }`}
                    >
                      {m.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Quick replies */}
              <div className="mt-3 flex flex-wrap gap-2">
                {quickReplies.map((q) => (
                  <motion.button
                    key={q}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setInput(q);
                      setTimeout(() => send(), 0);
                    }}
                    className="text-xs px-3 py-1 rounded-full border bg-white hover:bg-gray-50"
                  >
                    {q}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7C573C]/30"
                  placeholder="Type your message..."
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={send}
                  className="rounded-xl bg-[#7C573C] text-[#EDE3D5] px-3 py-2"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
