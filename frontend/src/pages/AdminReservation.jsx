import React, { useEffect, useMemo, useState } from "react";

export default function AdminReservations() {
  const BRAND = "#7C573C";

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");

  const token = localStorage.getItem("token");

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setErr("");

      const res = await fetch("/api/reservations", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErr(data?.message || data?.error || "Failed to load reservations");
        return;
      }

      setReservations(Array.isArray(data) ? data : data?.reservations || []);
    } catch (e) {
      setErr("Network error. Is your backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return reservations;
    return reservations.filter((r) => {
      const blob = `${r.name} ${r.phone} ${r.email} ${r.date} ${r.time} ${r.guests} ${r.status}`.toLowerCase();
      return blob.includes(q);
    });
  }, [reservations, query]);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h2 className="text-2xl font-semibold">Reservations</h2>

        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone, date..."
            className="px-4 py-2 rounded-lg border outline-none w-64"
          />

          <button
            onClick={fetchReservations}
            className="px-4 py-2 rounded-lg text-white font-semibold"
            style={{ backgroundColor: BRAND }}
          >
            Refresh
          </button>
        </div>
      </div>

      {loading && <div>Loading reservations...</div>}

      {err && (
        <div className="mb-4 rounded-md bg-red-100 text-red-800 px-4 py-3 text-sm">
          {err}
        </div>
      )}

      {!loading && !err && filtered.length === 0 && (
        <div className="text-sm text-gray-600">No reservations found.</div>
      )}

      {!loading && !err && filtered.length > 0 && (
        <div className="overflow-x-auto bg-white border rounded-xl">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 border-b">Name</th>
                <th className="text-left p-3 border-b">Phone</th>
                <th className="text-left p-3 border-b">Email</th>
                <th className="text-left p-3 border-b">Date</th>
                <th className="text-left p-3 border-b">Time</th>
                <th className="text-left p-3 border-b">Guests</th>
                <th className="text-left p-3 border-b">Status</th>
                <th className="text-left p-3 border-b">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{r.name}</td>
                  <td className="p-3 border-b">{r.phone}</td>
                  <td className="p-3 border-b">{r.email}</td>
                  <td className="p-3 border-b">{r.date}</td>
                  <td className="p-3 border-b">{r.time}</td>
                  <td className="p-3 border-b">{r.guests}</td>
                  <td className="p-3 border-b capitalize">{r.status || "pending"}</td>
                  <td className="p-3 border-b">
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
