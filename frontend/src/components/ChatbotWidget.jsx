import React, { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi! ☕ I’m Eliza Assistant. Ask me about menu, delivery, or orders.",
    },
  ]);

  const listRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open, typing]);

  const quickReplies = useMemo(
    () => ["Show menu", "Delivery info", "Opening hours", "Track my order"],
    []
  );

  const streamReply = (text) => {
    // create empty bot bubble for streaming
    setMessages((prev) => [...prev, { from: "bot", text: "" }]);
    setTyping(true);

    const es = new EventSource(
      `/api/chat/stream?message=${encodeURIComponent(text)}`
    );

    es.onmessage = (e) => {
      const chunk = e.data;

      setMessages((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        copy[copy.length - 1] = {
          ...last,
          text: (last.text || "") + chunk,
        };
        return copy;
      });
    };

    es.addEventListener("done", () => {
      setTyping(false);
      es.close();
    });

    es.onerror = () => {
      setTyping(false);
      es.close();

      // replace empty bot bubble with error message
      setMessages((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last?.from === "bot" && (last.text || "") === "") {
          copy[copy.length - 1] = {
            from: "bot",
            text: "Oops—connection issue. Please try again.",
          };
        }
        return copy;
      });
    };
  };

  const send = (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text) return;

    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");

    streamReply(text);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
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
      )}

      {/* Chat window */}
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
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              className="h-[340px] overflow-y-auto px-3 py-3 bg-[#FAF7F2]"
            >
              <AnimatePresence>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`mb-2 flex ${
                      m.from === "user" ? "justify-end" : "justify-start"
                    }`}
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

              {/* Typing bubble */}
              {typing && (
                <div className="mb-2 flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm bg-white text-gray-800 rounded-bl-md">
                    typing…
                  </div>
                </div>
              )}

              {/* Quick replies */}
              <div className="mt-3 flex flex-wrap gap-2">
                {quickReplies.map((q) => (
                  <motion.button
                    key={q}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => send(q)}
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
                  onClick={() => send()}
                  className="rounded-xl bg-[#7C573C] text-[#EDE3D5] px-3 py-2"
                  aria-label="Send message"
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
