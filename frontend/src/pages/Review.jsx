import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Star, Search } from "lucide-react";

function Stars({ value = 0, size = 16 }) {
  const full = Math.round(value);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < full ? "text-[#f8d8b8]" : "text-[#BFA88C]/40"}
          fill={i < full ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const [query, setQuery] = useState("");
  const [filterStars, setFilterStars] = useState("All"); // All | 5 | 4 | ...
  const [items, setItems] = useState([
    {
      id: "r1",
      name: "Amina K.",
      rating: 5,
      date: "Jan 2026",
      title: "Amazing aroma!",
      comment:
        "The beans smelled incredible the moment I opened the bag. Smooth taste and not bitter at all.",
      product: "Arabica Dark Roast",
    },
    {
      id: "r2",
      name: "Brian O.",
      rating: 4,
      date: "Jan 2026",
      title: "Great for cappuccino",
      comment:
        "Works really well with milk. I just wish the delivery was a little faster, but coffee is top.",
      product: "House Blend",
    },
    {
      id: "r3",
      name: "Lilian M.",
      rating: 5,
      date: "Dec 2025",
      title: "Cold brew perfection",
      comment:
        "I used this for cold brew and it came out super smooth. Will definitely order again.",
      product: "Robusta Roast",
    },
    {
      id: "r4",
      name: "Noah T.",
      rating: 3,
      date: "Dec 2025",
      title: "Good, but strong",
      comment:
        "Flavor is nice but it was a bit strong for me. Might try a lighter roast next time.",
      product: "Robusta Roast",
    },
  ]);

  // New review form state
  const [form, setForm] = useState({
    name: "",
    product: "",
    rating: 5,
    title: "",
    comment: "",
  });

  const stats = useMemo(() => {
    const total = items.length;
    const avg = total ? items.reduce((s, r) => s + r.rating, 0) / total : 0;
    const counts = [1, 2, 3, 4, 5].reduce((acc, n) => {
      acc[n] = items.filter((r) => r.rating === n).length;
      return acc;
    }, {});
    return { total, avg, counts };
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((r) => {
      const starOk = filterStars === "All" || r.rating === Number(filterStars);
      const qOk =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        r.product.toLowerCase().includes(q);
      return starOk && qOk;
    });
  }, [items, query, filterStars]);

  const addReview = (e) => {
    e.preventDefault();
    if (!form.name || !form.title || !form.comment) return;

    const newItem = {
      id: `r-${Date.now()}`,
      name: form.name,
      rating: Number(form.rating),
      date: "Today",
      title: form.title,
      comment: form.comment,
      product: form.product || "General",
    };

    setItems((prev) => [newItem, ...prev]);
    setForm({ name: "", product: "", rating: 5, title: "", comment: "" });
  };

  const StarFilterButton = ({ label, value }) => (
    <button
      onClick={() => setFilterStars(value)}
      className={`px-3 py-2 rounded-xl text-sm border transition ${
        filterStars === value
          ? "bg-[#f8d8b8] text-[#1D1212] border-[#f8d8b8]"
          : "bg-transparent text-[#EDE3D5] border-[#3a2f24] hover:border-[#f8d8b8]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <main className="min-h-screen bg-[#1D1212] text-[#EDE3D5] px-4 py-14">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#f8d8b8]">
            Customer Reviews
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#BFA88C] max-w-2xl">
            Real feedback from coffee lovers. Filter by rating, search by keyword, and add your own review.
          </p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Summary */}
          <section className="bg-[#2a1b1b] border border-[#3a2f24] rounded-2xl p-6 h-fit">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-[#f8d8b8]">
                  {stats.avg.toFixed(1)}
                </div>
                <div className="mt-2">
                  <Stars value={stats.avg} size={18} />
                </div>
                <div className="mt-2 text-sm text-[#BFA88C]">
                  Based on {stats.total} reviews
                </div>
              </div>
            </div>

            {/* Bars */}
            <div className="mt-6 space-y-3">
              {[5, 4, 3, 2, 1].map((n) => {
                const count = stats.counts[n] || 0;
                const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={n} className="flex items-center gap-3">
                    <div className="w-10 text-sm text-[#BFA88C]">{n}★</div>
                    <div className="flex-1 h-2 rounded-full bg-[#1D1212] border border-[#3a2f24] overflow-hidden">
                      <div className="h-full bg-[#f8d8b8]" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="w-10 text-sm text-[#BFA88C] text-right">{pct}%</div>
                  </div>
                );
              })}
            </div>

            {/* Filters */}
            <div className="mt-7">
              <h3 className="text-[#f8d8b8] font-semibold">Filter</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <StarFilterButton label="All" value="All" />
                <StarFilterButton label="5★" value="5" />
                <StarFilterButton label="4★" value="4" />
                <StarFilterButton label="3★" value="3" />
                <StarFilterButton label="2★" value="2" />
                <StarFilterButton label="1★" value="1" />
              </div>
            </div>
          </section>

          {/* Middle: Reviews list */}
          <section className="lg:col-span-2">
            {/* Search */}
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BFA88C]" size={18} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search reviews: espresso, delivery, aroma..."
                  className="w-full bg-[#2a1b1b] border border-[#3a2f24] rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none focus:border-[#f8d8b8]"
                />
              </div>
            </div>

            {/* Review cards */}
            <div className="mt-5 grid grid-cols-1 gap-4">
              {filtered.map((r, idx) => (
                <motion.article
                  key={r.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-[#2a1b1b] border border-[#3a2f24] rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="font-semibold text-[#EDE3D5]">{r.name}</div>
                        <div className="text-xs text-[#BFA88C]">{r.date}</div>
                      </div>
                      <div className="mt-2">
                        <Stars value={r.rating} />
                      </div>
                    </div>

                    <div className="text-xs text-[#BFA88C] border border-[#3a2f24] bg-[#1D1212] px-3 py-1 rounded-full">
                      {r.product}
                    </div>
                  </div>

                  <h4 className="mt-3 text-[#f8d8b8] font-semibold">{r.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#EDE3D5]/90">{r.comment}</p>
                </motion.article>
              ))}

              {filtered.length === 0 && (
                <div className="bg-[#2a1b1b] border border-[#3a2f24] rounded-2xl p-8 text-center text-[#BFA88C]">
                  No reviews match your search.
                </div>
              )}
            </div>

            {/* Write a review */}
            <div className="mt-8 bg-[#2a1b1b] border border-[#3a2f24] rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-[#f8d8b8]">Write a Review</h3>
              <p className="mt-1 text-sm text-[#BFA88C]">
                This is frontend-only. Later we can save reviews to a database.
              </p>

              <form onSubmit={addReview} className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Your name"
                  className="bg-[#1D1212] border border-[#3a2f24] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#f8d8b8]"
                  required
                />

                <input
                  value={form.product}
                  onChange={(e) => setForm((p) => ({ ...p, product: e.target.value }))}
                  placeholder="Product (optional)"
                  className="bg-[#1D1212] border border-[#3a2f24] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#f8d8b8]"
                />

                <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 sm:items-center">
                  <label className="text-sm text-[#BFA88C]">Rating</label>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm((p) => ({ ...p, rating: e.target.value }))}
                    className="bg-[#1D1212] border border-[#3a2f24] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#f8d8b8] w-full sm:w-48"
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Good</option>
                    <option value={3}>3 - Okay</option>
                    <option value={2}>2 - Not great</option>
                    <option value={1}>1 - Poor</option>
                  </select>
                </div>

                <input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Review title"
                  className="md:col-span-2 bg-[#1D1212] border border-[#3a2f24] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#f8d8b8]"
                  required
                />

                <textarea
                  value={form.comment}
                  onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
                  placeholder="Write your review..."
                  rows={4}
                  className="md:col-span-2 bg-[#1D1212] border border-[#3a2f24] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#f8d8b8]"
                  required
                />

                <button
                  type="submit"
                  className="md:col-span-2 bg-[#f8d8b8] text-[#1D1212] rounded-xl px-5 py-3 text-sm font-semibold hover:opacity-90 transition"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
