import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Trash2,
  RefreshCcw,
  Search,
  Star,
  Tag,
  DollarSign,
  Image as ImageIcon,
  CalendarCheck2,
  MessageSquare,
  Phone,
  Mail,
  Users,
  Clock,
} from "lucide-react";

export default function Admin() {
  const BRAND = "#7C573C";

  const getToken = () =>
    localStorage.getItem("admin_token") || sessionStorage.getItem("admin_token");

  const logoutAndGoLogin = () => {
    localStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_token");
    window.location.href = "/admin-login";
  };

  const [tab, setTab] = useState("products"); // products | add | reservations | contacts

  // -----------------------
  // Products state
  // -----------------------
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "", // optional manual URL
    imageFile: null, // selected file
    description: "",
    weight: "500 gm",
    categories: "popular",
    rating: "4.8",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((p) => ({ ...p, imageFile: file }));
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      setErr("");

      const token = getToken();
      if (!token) throw new Error("Not logged in. Go to Admin Login first.");

      // Upload image if user selected a file
      let imageUrl = form.image.trim(); // allows manual URL too

      if (form.imageFile) {
        const fd = new FormData();
        fd.append("image", form.imageFile);

        const upRes = await fetch("/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // DO NOT set Content-Type when using FormData
          },
          body: fd,
        });

        if (upRes.status === 401) {
          setErr("Session expired. Please login again.");
          logoutAndGoLogin();
          return;
        }

        const upData = await upRes.json().catch(() => ({}));
        if (!upRes.ok) throw new Error(upData.message || "Image upload failed");

        imageUrl = upData.url; // "/uploads/....png"
      }

      // Create product using imageUrl
      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        image: imageUrl,
        description: form.description.trim(),
        weight: form.weight.trim(),
        categories: form.categories
          .split(",")
          .map((c) => c.trim().toLowerCase())
          .filter(Boolean),
        rating: Number(form.rating),
      };

      if (!payload.name) throw new Error("Name is required");
      if (Number.isNaN(payload.price)) throw new Error("Price must be a number");

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        setErr("Session expired. Please login again.");
        logoutAndGoLogin();
        return;
      }

      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg.message || "Failed to add product");
      }

      setForm({
        name: "",
        price: "",
        image: "",
        imageFile: null,
        description: "",
        weight: "500 gm",
        categories: "popular",
        rating: "4.8",
      });

      await fetchProducts();
      setTab("products");
    } catch (e2) {
      setErr(e2.message || "Failed to add product");
    }
  };

  const deleteProduct = async (id, name) => {
    const ok = window.confirm(`Delete "${name}"?`);
    if (!ok) return;

    try {
      setErr("");

      const token = getToken();
      if (!token) throw new Error("Not logged in. Go to Admin Login first.");

      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        setErr("Session expired. Please login again.");
        logoutAndGoLogin();
        return;
      }

      if (!res.ok) throw new Error("Failed to delete product");

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (e2) {
      setErr(e2.message || "Failed to delete product");
    }
  };

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const cats = (p.categories || []).join(",").toLowerCase();
      return name.includes(q) || cats.includes(q);
    });
  }, [products, query]);

  const stats = useMemo(() => {
    const count = products.length;
    const avgRating =
      count === 0
        ? 0
        : products.reduce((s, p) => s + Number(p.rating || 0), 0) / count;
    const avgPrice =
      count === 0
        ? 0
        : products.reduce((s, p) => s + Number(p.price || 0), 0) / count;

    const bestCount = products.filter((p) =>
      (p.categories || []).includes("best")
    ).length;

    return {
      count,
      bestCount,
      avgRating: Number(avgRating.toFixed(2)),
      avgPrice: Number(avgPrice.toFixed(2)),
    };
  }, [products]);

  // -----------------------
  // Reservations state
  // -----------------------
  const [reservations, setReservations] = useState([]);
  const [resLoading, setResLoading] = useState(false);
  const [resErr, setResErr] = useState("");
  const [resQuery, setResQuery] = useState("");

  const fetchReservations = async () => {
    try {
      setResLoading(true);
      setResErr("");

      const token = getToken();
      if (!token) throw new Error("Not logged in. Go to Admin Login first.");

      const res = await fetch("/api/reservations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        setResErr("Session expired. Please login again.");
        logoutAndGoLogin();
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.error || "Failed to fetch reservations");

      setReservations(Array.isArray(data) ? data : []);
    } catch (e) {
      setResErr(e.message || "Failed to fetch reservations");
    } finally {
      setResLoading(false);
    }
  };

  const filteredReservations = useMemo(() => {
    const q = resQuery.trim().toLowerCase();
    if (!q) return reservations;
    return reservations.filter((r) => {
      const blob = `${r.name} ${r.phone} ${r.email} ${r.date} ${r.time} ${r.guests} ${r.status}`.toLowerCase();
      return blob.includes(q);
    });
  }, [reservations, resQuery]);

  // -----------------------
  // Contacts state
  // -----------------------
  const [contacts, setContacts] = useState([]);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactErr, setContactErr] = useState("");
  const [contactQuery, setContactQuery] = useState("");

  const fetchContacts = async () => {
    try {
      setContactLoading(true);
      setContactErr("");

      const token = getToken();
      if (!token) throw new Error("Not logged in. Go to Admin Login first.");

      // ✅ Admin list endpoint
      const res = await fetch("/api/contact", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        setContactErr("Session expired. Please login again.");
        logoutAndGoLogin();
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.error || "Failed to fetch contacts");

      setContacts(Array.isArray(data) ? data : data.contacts || []);
    } catch (e) {
      setContactErr(e.message || "Failed to fetch contacts");
    } finally {
      setContactLoading(false);
    }
  };

  const filteredContacts = useMemo(() => {
    const q = contactQuery.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter((c) => {
      const blob = `${c.fullName || ""} ${c.name || ""} ${c.email || ""} ${c.phone || ""} ${c.message || ""}`.toLowerCase();
      return blob.includes(q);
    });
  }, [contacts, contactQuery]);

  // Load data when opening tabs
  useEffect(() => {
    if (tab === "reservations") fetchReservations();
    if (tab === "contacts") fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const pill = (text) => (
    <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-[#e6d3bd]">
      {text}
    </span>
  );

  const inputClass =
    "w-full p-3 rounded-xl bg-black/30 border border-white/10 outline-none " +
    "focus:border-white/25 focus:bg-black/35 transition";

  const subtitle =
    tab === "products"
      ? "Manage products"
      : tab === "add"
      ? "Add new product"
      : tab === "reservations"
      ? "Manage reservations"
      : "Manage contact messages";

  const refreshCurrent = () => {
    if (tab === "reservations") fetchReservations();
    else if (tab === "contacts") fetchContacts();
    else fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1b0f0f] to-[#120a0a] text-[#f5e6d3]">
      <div className="max-w-7xl mx-auto px-5 py-8">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center border border-white/10 bg-white/5"
              style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.35)" }}
            >
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold font-[cursive]">
                Elza Coffee
              </h1>
              <p className="text-sm text-[#e6d3bd]/70">{subtitle}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={refreshCurrent}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </button>

            <button
              onClick={logoutAndGoLogin}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/15 text-red-100 border border-red-500/20 hover:bg-red-500/25 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Errors */}
        {err && (tab === "products" || tab === "add") && (
          <div className="mt-6 p-4 rounded-2xl bg-red-500/15 text-red-100 border border-red-500/20">
            {err}
          </div>
        )}
        {resErr && tab === "reservations" && (
          <div className="mt-6 p-4 rounded-2xl bg-red-500/15 text-red-100 border border-red-500/20">
            {resErr}
          </div>
        )}
        {contactErr && tab === "contacts" && (
          <div className="mt-6 p-4 rounded-2xl bg-red-500/15 text-red-100 border border-red-500/20">
            {contactErr}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-3 rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <p className="text-sm text-[#e6d3bd]/70">Navigation</p>
              <h2 className="text-xl font-semibold mt-1">Dashboard</h2>
            </div>

            <div className="p-4 space-y-2">
              <button
                onClick={() => setTab("products")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition ${
                  tab === "products"
                    ? "bg-white/10 border-white/20"
                    : "bg-transparent border-white/10 hover:bg-white/5"
                }`}
              >
                <Package className="w-5 h-5" />
                <span className="font-semibold">Products</span>
              </button>

              <button
                onClick={() => setTab("add")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition ${
                  tab === "add"
                    ? "bg-white/10 border-white/20"
                    : "bg-transparent border-white/10 hover:bg-white/5"
                }`}
              >
                <PlusCircle className="w-5 h-5" />
                <span className="font-semibold">Add Product</span>
              </button>

              <button
                onClick={() => setTab("reservations")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition ${
                  tab === "reservations"
                    ? "bg-white/10 border-white/20"
                    : "bg-transparent border-white/10 hover:bg-white/5"
                }`}
              >
                <CalendarCheck2 className="w-5 h-5" />
                <span className="font-semibold">Reservations</span>
              </button>

              <button
                onClick={() => setTab("contacts")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition ${
                  tab === "contacts"
                    ? "bg-white/10 border-white/20"
                    : "bg-transparent border-white/10 hover:bg-white/5"
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span className="font-semibold">Contacts</span>
              </button>
            </div>

            <div className="p-5 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#e6d3bd]/70">Total products</span>
                <span className="font-bold">{stats.count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#e6d3bd]/70">Best sellers</span>
                <span className="font-bold">{stats.bestCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#e6d3bd]/70">Avg rating</span>
                <span className="font-bold">
                  {stats.count ? stats.avgRating : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#e6d3bd]/70">Avg price</span>
                <span className="font-bold">
                  {stats.count ? `$${stats.avgPrice}` : "—"}
                </span>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="lg:col-span-9 space-y-6">
            <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold">
                    {tab === "products"
                      ? "Products"
                      : tab === "add"
                      ? "Add a new product"
                      : tab === "reservations"
                      ? "Reservations"
                      : "Contacts"}
                  </h3>
                  <p className="text-sm text-[#e6d3bd]/70 mt-1">
                    {tab === "products"
                      ? "Search, review, and delete products."
                      : tab === "add"
                      ? 'Add product details. Example categories: "best,popular".'
                      : tab === "reservations"
                      ? "View table reservations made by customers."
                      : "View messages sent from your Contact page."}
                  </p>
                </div>

                {tab === "products" && (
                  <div className="relative w-full md:w-[360px]">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#e6d3bd]/60" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search name or category..."
                      className={`pl-11 pr-4 ${inputClass}`}
                    />
                  </div>
                )}

                {tab === "reservations" && (
                  <div className="relative w-full md:w-[360px]">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#e6d3bd]/60" />
                    <input
                      value={resQuery}
                      onChange={(e) => setResQuery(e.target.value)}
                      placeholder="Search name, phone, date..."
                      className={`pl-11 pr-4 ${inputClass}`}
                    />
                  </div>
                )}

                {tab === "contacts" && (
                  <div className="relative w-full md:w-[360px]">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#e6d3bd]/60" />
                    <input
                      value={contactQuery}
                      onChange={(e) => setContactQuery(e.target.value)}
                      placeholder="Search name, email, message..."
                      className={`pl-11 pr-4 ${inputClass}`}
                    />
                  </div>
                )}

                {tab === "add" && (
                  <button
                    onClick={() => setTab("products")}
                    className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition"
                  >
                    Back to Products
                  </button>
                )}
              </div>
            </div>

            {/* PRODUCTS VIEW */}
            {tab === "products" && (
              <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="p-4 sm:p-6">
                  {loading ? (
                    <p className="text-[#e6d3bd]/80">Loading...</p>
                  ) : filteredProducts.length === 0 ? (
                    <p className="text-[#e6d3bd]/80">No products found.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredProducts.map((p) => (
                        <div
                          key={p._id}
                          className="rounded-3xl bg-black/25 border border-white/10 p-5 hover:border-white/15 transition"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-lg font-semibold truncate">
                                {p.name}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {pill(`$${p.price}`)}
                                {pill(p.weight || "—")}
                                {pill(
                                  (p.categories || []).length
                                    ? (p.categories || []).join(", ")
                                    : "no categories"
                                )}
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-[#e6d3bd]">
                                  <Star className="w-3.5 h-3.5" />
                                  {p.rating ?? "—"}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => deleteProduct(p._id, p.name)}
                              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-500/15 text-red-100 border border-red-500/20 hover:bg-red-500/25 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>

                          {p.description ? (
                            <p className="mt-4 text-sm text-[#f5e6d3]/85 line-clamp-3">
                              {p.description}
                            </p>
                          ) : (
                            <p className="mt-4 text-sm text-[#e6d3bd]/60 italic">
                              No description.
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ADD PRODUCT VIEW */}
            {tab === "add" && (
              <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
                <form onSubmit={addProduct} className="p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-[#e6d3bd]/70 flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4" /> Name
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        placeholder="Latte"
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm text-[#e6d3bd]/70 flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4" /> Price
                      </label>
                      <input
                        name="price"
                        value={form.price}
                        onChange={onChange}
                        placeholder="4.25"
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm text-[#e6d3bd]/70 flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4" /> Weight
                      </label>
                      <input
                        name="weight"
                        value={form.weight}
                        onChange={onChange}
                        placeholder="500 gm"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="text-sm text-[#e6d3bd]/70 flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4" /> Rating
                      </label>
                      <input
                        name="rating"
                        value={form.rating}
                        onChange={onChange}
                        placeholder="4.8"
                        className={inputClass}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm text-[#e6d3bd]/70 flex items-center gap-2 mb-2">
                        <ImageIcon className="w-4 h-4" /> Product Image
                      </label>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                        className={inputClass}
                      />

                      <p className="text-xs text-[#e6d3bd]/55 mt-2">
                        Use URL if necessary
                      </p>

                      {(form.imageFile || form.image) && (
                        <div className="mt-3 rounded-2xl bg-black/25 border border-white/10 p-4">
                          <p className="text-xs text-[#e6d3bd]/60 mb-2">
                            Preview
                          </p>
                          <img
                            src={
                              form.imageFile
                                ? URL.createObjectURL(form.imageFile)
                                : form.image
                            }
                            alt="preview"
                            className="max-h-48 rounded-xl object-contain"
                          />
                        </div>
                      )}
                    </div>

                    {/* Optional manual URL */}
                    <div className="md:col-span-2">
                      <label className="text-sm text-[#e6d3bd]/70 flex items-center gap-2 mb-2">
                        <ImageIcon className="w-4 h-4" /> Image URL (optional)
                      </label>
                      <input
                        name="image"
                        value={form.image}
                        onChange={onChange}
                        placeholder='e.g. "/uploads/latte.png" or "https://..."'
                        className={inputClass}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm text-[#e6d3bd]/70 flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4" /> Categories
                      </label>
                      <input
                        name="categories"
                        value={form.categories}
                        onChange={onChange}
                        placeholder="best,popular,premium"
                        className={inputClass}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm text-[#e6d3bd]/70 flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4" /> Description
                      </label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={onChange}
                        placeholder="Write a short description..."
                        className={inputClass + " min-h-[120px]"}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white hover:opacity-90 transition"
                    style={{ backgroundColor: BRAND }}
                  >
                    <PlusCircle className="w-5 h-5" />
                    Add Product
                  </button>
                </form>
              </div>
            )}

            {/* RESERVATIONS VIEW */}
            {tab === "reservations" && (
              <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="p-4 sm:p-6">
                  {resLoading ? (
                    <p className="text-[#e6d3bd]/80">
                      Loading reservations...
                    </p>
                  ) : filteredReservations.length === 0 ? (
                    <p className="text-[#e6d3bd]/80">No reservations found.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-[900px] w-full text-sm">
                        <thead className="bg-black/20">
                          <tr className="text-[#e6d3bd]/80">
                            <th className="text-left p-3 border-b border-white/10">
                              <span className="inline-flex items-center gap-2">
                                <Tag className="w-4 h-4" /> Name
                              </span>
                            </th>
                            <th className="text-left p-3 border-b border-white/10">
                              <span className="inline-flex items-center gap-2">
                                <Phone className="w-4 h-4" /> Phone
                              </span>
                            </th>
                            <th className="text-left p-3 border-b border-white/10">
                              <span className="inline-flex items-center gap-2">
                                <Mail className="w-4 h-4" /> Email
                              </span>
                            </th>
                            <th className="text-left p-3 border-b border-white/10">
                              <span className="inline-flex items-center gap-2">
                                <CalendarCheck2 className="w-4 h-4" /> Date
                              </span>
                            </th>
                            <th className="text-left p-3 border-b border-white/10">
                              <span className="inline-flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Time
                              </span>
                            </th>
                            <th className="text-left p-3 border-b border-white/10">
                              <span className="inline-flex items-center gap-2">
                                <Users className="w-4 h-4" /> Guests
                              </span>
                            </th>
                            <th className="text-left p-3 border-b border-white/10">
                              Status
                            </th>
                            <th className="text-left p-3 border-b border-white/10">
                              Created
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredReservations.map((r) => (
                            <tr key={r._id} className="hover:bg-white/5">
                              <td className="p-3 border-b border-white/10">
                                {r.name}
                              </td>
                              <td className="p-3 border-b border-white/10">
                                {r.phone}
                              </td>
                              <td className="p-3 border-b border-white/10">
                                {r.email}
                              </td>
                              <td className="p-3 border-b border-white/10">
                                {r.date}
                              </td>
                              <td className="p-3 border-b border-white/10">
                                {r.time}
                              </td>
                              <td className="p-3 border-b border-white/10">
                                {r.guests}
                              </td>
                              <td className="p-3 border-b border-white/10 capitalize">
                                {r.status || "pending"}
                              </td>
                              <td className="p-3 border-b border-white/10">
                                {r.createdAt
                                  ? new Date(r.createdAt).toLocaleString()
                                  : "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CONTACTS VIEW */}
            {tab === "contacts" && (
              <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="p-4 sm:p-6">
                  {contactLoading ? (
                    <p className="text-[#e6d3bd]/80">
                      Loading contact messages...
                    </p>
                  ) : filteredContacts.length === 0 ? (
                    <p className="text-[#e6d3bd]/80">
                      No contact messages found.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-[900px] w-full text-sm">
                        <thead className="bg-black/20">
                          <tr className="text-[#e6d3bd]/80">
                            <th className="text-left p-3 border-b border-white/10">
                              Name
                            </th>
                            <th className="text-left p-3 border-b border-white/10">
                              Email
                            </th>
                            <th className="text-left p-3 border-b border-white/10">
                              Phone
                            </th>
                            <th className="text-left p-3 border-b border-white/10">
                              Message
                            </th>
                            <th className="text-left p-3 border-b border-white/10">
                              Created
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredContacts.map((c) => (
                            <tr key={c._id} className="hover:bg-white/5 align-top">
                              <td className="p-3 border-b border-white/10">
                                {c.fullName || c.name || "—"}
                              </td>
                              <td className="p-3 border-b border-white/10">
                                {c.email || "—"}
                              </td>
                              <td className="p-3 border-b border-white/10">
                                {c.phone || "—"}
                              </td>
                              <td className="p-3 border-b border-white/10 max-w-[520px]">
                                <p className="line-clamp-4 text-[#f5e6d3]/90">
                                  {c.message || "—"}
                                </p>
                              </td>
                              <td className="p-3 border-b border-white/10">
                                {c.createdAt
                                  ? new Date(c.createdAt).toLocaleString()
                                  : "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
